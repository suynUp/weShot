import { useState, useMemo } from 'react'
import request from '../utils/request.js'
import { usePagination } from '../hooks/usePagination.js'
import { Pagination } from '../components/pagination.jsx'
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

  // 获取用户列表
  const fetchUserList = async (page, pageSize) => {
    try {
      console.log(' 发送用户列表请求，参数：', { pageNum: page, pageSize: pageSize })
      const res = await request.get('/admin/users', {
        params: {
          pageNum: page,
          pageSize: pageSize
        }
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
      console.error('eee❌ 获取用户列表失败：', error)
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
      console.warn('警告🤯 参数无效，终止请求', { userId, currentStatus, actionLoadingId })
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

      console.log(`发送${actionText}请求，完整URL：`, url.toString())

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

      console.log(`${actionText}接口返回：`, res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        alert(`${actionText}成功`)

        // 立即更新列表状态
        setUserList(prevList => 
          prevList.map(user => 
            user.cas_id === userId 
              ? { ...user, status: targetStatus } // 更新对应用户的状态
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
      alert(`${actionText}失败：${errorMsg}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  // 取消身份功能
  const handleCancelRole = (userId) => {
    if (!userId) return
    if (window.confirm('确定要取消该用户的身份吗？')) {
      alert('取消身份成功')
      refresh ? refresh() : setCurrentPage(currentPage)
    }
  }

  // 辅助显示函数 根据用户数据返回显示的昵称和角色标签
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
                      onClick={() => handleCancelRole(user.cas_id)}
                    >
                      取消身份
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
    </div>
  )
}