import { useState, useMemo } from 'react'
import request from '../utils/request.js'
import { usePagination } from '../hooks/usePagination.js'
import { Pagination } from '../components/pagination.jsx'
import { toast } from '../hooks/useToast.jsx'
import styles from './UserManage.module.css'

const USER_STATUS = {
  NORMAL: 0,    // 正常
  FROZEN: 1     // 冻结
}
const STATUS_LABEL = {
  [USER_STATUS.NORMAL]: '正常',
  [USER_STATUS.FROZEN]: '冻结'
}
const STATUS_BTN_TEXT = {
  [USER_STATUS.NORMAL]: '冻结',
  [USER_STATUS.FROZEN]: '解冻'
}

const API_BASE_URL = 'http://172.24.37.149:8080'

export default function UserManage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [roleFilter1, setRoleFilter1] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [userList, setUserList] = useState([])
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // 取消摄影师身份弹窗状态
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [currentRevokeUser, setCurrentRevokeUser] = useState(null)
  const [revokeForm, setRevokeForm] = useState({ reason: '' })

  // 获取用户列表 
  const fetchUserList = async (page, pageSize) => {
    try {
      console.log('📤 发送用户列表请求，参数：', { pageNum: page, pageSize: pageSize })
      const res = await request.get('/admin/users', {
        pageNum: page,
        pageSize: pageSize
      })
      console.log('用户列表接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        const { list = [], total = 0 } = res.data || {}
        setUserList(list)
        return { total }
      } else {
        throw new Error(res.msg || '获取用户列表失败')
      }
    } catch (error) {
      console.error('❌ 获取用户列表失败：', error)
      throw error
    }
  }

  const {
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    refresh
  } = usePagination({
    itemsPerPage: 10,
    fetchData: fetchUserList,
    dependencies: [searchKeyword, roleFilter1, statusFilter]
  })

  // 冻结/解冻功能 
  const handleToggleStatus = async (userId, currentStatus) => {
    if (actionLoadingId || !userId || currentStatus === undefined || currentStatus === null) {
      console.warn('参数无效，终止请求', { userId, currentStatus, actionLoadingId })
      return
    }

    const targetStatus = currentStatus === USER_STATUS.NORMAL
      ? USER_STATUS.FROZEN
      : USER_STATUS.NORMAL
    const actionText = STATUS_BTN_TEXT[currentStatus]

    if (targetStatus === USER_STATUS.FROZEN) {
      const isConfirm = window.confirm(`确定要${actionText}该用户吗？冻结后用户将无法正常使用系统`)
      if (!isConfirm) return
    }

    try {
      setActionLoadingId(userId)

      const url = new URL(`${API_BASE_URL}/admin/users/${userId}/status`)
      url.searchParams.append('status', targetStatus)

      console.log(`发送${actionText}请求 完整URL：`, url.toString())

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        credentials: 'include',
        body: null
      })

      let res
      const contentType = response.headers.get('content-type')
      if (response.ok && contentType && contentType.includes('application/json')) {
        res = await response.json()
      } else {
        const errorText = await response.text()
        console.error(`❌ 服务器返回非JSON响应：`, { status: response.status, text: errorText })
        throw new Error(`服务器错误 (${response.status})`)
      }

      console.log(` ${actionText}接口返回：`, res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        toast.success(`${actionText}成功`)

        // 立即更新列表状态
        setUserList(prevList => 
          prevList.map(user => 
            user.cas_id === userId 
              ? { ...user, status: targetStatus }
              : user
          )
        )

        if (refresh) {
          refresh()
        } else {
          setCurrentPage(currentPage)
        }
      } else {
        throw new Error(res.msg || `${actionText}失败`)
      }
    } catch (error) {
      console.error(`❌ ${actionText}失败：`, error)
      const errorMsg = error.message || '系统异常，请稍后重试'
      toast.error(`${actionText}失败：${errorMsg}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  // 打开取消身份弹窗
  const handleCancelRole = (user) => {
    // 仅摄影师账号可取消身份
    if (!user || user.role !== 2) {
      toast.error('仅摄影师账号可执行取消身份操作');
      return
    }
    if (actionLoadingId === user.cas_id) return

    setCurrentRevokeUser(user)
    setRevokeForm({ reason: '' })
    setShowRevokeModal(true)
  }

  // 取消摄影师身份提交 
  const handleRevokeSubmit = async () => {
    const { reason } = revokeForm
    if (!reason.trim()) {
      toast.warning('请填写取消身份的原因')
      return
    }
    if (!currentRevokeUser?.cas_id || actionLoadingId) return

    const userId = currentRevokeUser.cas_id
    try {
      setActionLoadingId(userId)
      console.log('发送取消摄影师身份请求，参数：', { casId: userId, reason: reason.trim() })
      
      const res = await request.post(
        '/admin/photographers/revoke',
        {}, 
        {
          casId: userId,
          reason: reason.trim()
        }
      )
      console.log('✅ 取消摄影师身份接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        toast.success('取消摄影师身份成功')
        // 本地立即更新
        setUserList(prevList => 
          prevList.map(user => 
            user.cas_id === userId 
              ? { ...user, role: 0 } // 取消后变为普通客户角色
              : user
          )
        )
        handleRevokeModalClose()
        // 刷新列表保证数据同步
        refresh?.()
      } else {
        throw new Error(res.msg || '取消身份失败')
      }
    } catch (error) {
      console.error('❌ 取消摄影师身份失败：', error)
      toast.error(error.message || '取消身份失败，请稍后重试')
    } finally {
      setActionLoadingId(null)
    }
  }

  // 取消身份弹窗关闭
  const handleRevokeModalClose = () => {
    // 加载中禁止关闭
    if (actionLoadingId) return
    setShowRevokeModal(false)
    setCurrentRevokeUser(null)
    setRevokeForm({ reason: '' })
  }

  // 表单输入同步
  const handleRevokeFormChange = (value) => {
    setRevokeForm(prev => ({ ...prev, reason: value }))
  }

  // 辅助显示函数
  const getDisplayNickname = (user) => {
    if (user.nickname === 'Admin' || user.cas_id === 'Admin') return 'Admin'
    if (!user.nickname) return `用户${user.cas_id}`
    return user.nickname
  }

  const getDisplayRole = (user) => {
    if (user.nickname === 'Admin' || user.cas_id === 'Admin') return '管理员'
    if (user.role === 2) return '摄影师'
    return '客户'
  }

  // 前端筛选逻辑
  const filteredUserList = useMemo(() => {
    return userList.filter(user => {
      const displayNickname = getDisplayNickname(user)
      const matchKeyword =
        displayNickname.includes(searchKeyword) || String(user.cas_id || '').includes(searchKeyword)

      const matchRole = !roleFilter1 || roleFilter1 === 'all' || getDisplayRole(user) === roleFilter1

      const matchStatus = !statusFilter || statusFilter === 'all' || user.status === Number(statusFilter)

      return matchKeyword && matchRole && matchStatus
    })
  }, [searchKeyword, roleFilter1, statusFilter, userList])

  return (
    <div className={styles['user-manage-page']}>
      {/* 顶部筛选栏 */}
      <div className={styles['filter-bar']}>
        <input
          type="text"
          placeholder="请输入ID或昵称搜索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className={styles['filter-input']}
        />

        <button
          className={styles['search-btn']}
          onClick={() => console.log('搜索：', searchKeyword)}
        >
          搜索
        </button>

        <select
          value={roleFilter1}
          onChange={(e) => setRoleFilter1(e.target.value)}
          className={styles['filter-select']}
        >
          <option value="" disabled hidden>选择角色用户端</option>
          <option value="all">全部</option>
          <option value="摄影师">摄影师</option>
          <option value="客户">客户</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles['filter-select']}
        >
          <option value="" disabled hidden>选择角色状态</option>
          <option value="all">全部</option>
          <option value={USER_STATUS.NORMAL}>正常</option>
          <option value={USER_STATUS.FROZEN}>冻结</option>
        </select>
      </div>

      {/* 用户表格 */}
      <div className={styles['table-wrapper']}>
        {loading && <div className={styles['loading-tip']}>正在加载用户数据...</div>}
        {error && <div className={styles['error-tip']}>加载失败：{error}</div>}

        <table className={styles['user-table']}>
          <thead>
            <tr>
              <th className={styles['col-nickname']}>昵称</th>
              <th className={styles['col-id']}>ID</th>
              <th className={styles['col-role']}>角色</th>
              <th className={styles['col-status']}>账号状态</th>
              <th className={styles['col-action']}>操作</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredUserList.map((user) => (
              <tr key={user.cas_id} className={styles['table-row']}>
                <td className={styles['table-cell']}>{getDisplayNickname(user)}</td>
                <td className={styles['table-cell']}>{user.cas_id}</td>
                <td className={styles['table-cell']}>
                  <span className={`${styles['role-tag']} ${styles[`role-${user.role}`]}`}>
                    {getDisplayRole(user)}
                  </span>
                </td>
                <td className={styles['table-cell']}>
                  <span className={`${styles['status-tag']} ${styles[`status-${user.status}`]}`}>
                    {STATUS_LABEL[user.status] || '未知'}
                  </span>
                </td>
                <td className={`${styles['table-cell']} ${styles['action-cell']}`}>
                  <div className={styles['action-btns']}>
                    <button
                      className={`${styles['status-btn']} ${user.status === USER_STATUS.NORMAL ? styles['btn-freeze'] : styles['btn-unfreeze']}`}
                      onClick={() => handleToggleStatus(user.cas_id, user.status)}
                      disabled={actionLoadingId === user.cas_id}
                    >
                      {actionLoadingId === user.cas_id ? '操作中...' : STATUS_BTN_TEXT[user.status]}
                    </button>
                    <button
                      className={styles['cancel-role-btn']}
                      onClick={() => handleCancelRole(user)}
                      disabled={actionLoadingId === user.cas_id || user.role !== 2}
                      style={{ opacity: (actionLoadingId === user.cas_id || user.role !== 2) ? 0.5 : 1 }}
                    >
                      {actionLoadingId === user.cas_id ? '操作中...' : '取消身份'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredUserList.length === 0 && (
              <tr>
                <td colSpan={5} className={styles['empty-row']}>
                  暂无匹配的用户数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页组件 */}
      {!loading && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 取消摄影师身份弹窗 */}
      {showRevokeModal && currentRevokeUser && (
        <div className={styles['modal-overlay']} onClick={handleRevokeModalClose}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2 className={styles['modal-title']}>取消摄影师身份</h2>
              <button 
                className={styles['modal-close-btn']} 
                onClick={handleRevokeModalClose}
                disabled={actionLoadingId}
              >
                ×
              </button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['modal-info-row']}>
                <span className={styles['modal-label']}>操作用户：</span>
                <span className={styles['modal-value']}>{getDisplayNickname(currentRevokeUser)}（ID：{currentRevokeUser.cas_id}）</span>
              </div>
              <div className={styles['form-item']}>
                <label className={styles['form-label']}>取消原因 <span className={styles['required']}>*</span></label>
                <textarea
                  className={styles['reason-textarea']}
                  value={revokeForm.reason}
                  onChange={(e) => handleRevokeFormChange(e.target.value)}
                  placeholder="请填写取消该用户摄影师身份的原因"
                  disabled={actionLoadingId}
                  rows={4}
                />
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button 
                className={styles['modal-confirm-btn']} 
                onClick={handleRevokeSubmit}
                disabled={actionLoadingId}
              >
                {actionLoadingId ? '提交中...' : '确认取消'}
              </button>
              <button 
                className={styles['modal-cancel-btn']} 
                onClick={handleRevokeModalClose}
                disabled={actionLoadingId}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}