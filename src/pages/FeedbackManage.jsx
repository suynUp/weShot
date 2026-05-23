import { useState } from 'react'
import { Pagination } from '../components/pagination.jsx'
import { usePagination } from '../hooks/usePagination.js'
import { toast } from '../hooks/useToast.jsx'
import request from '../utils/request.js'
import styles from './FeedbackManage.module.css'

// 接口返回：0=未读/未处理，1=已读/已处理
const FEEDBACK_STATUS = {
  UNREAD: 0,
  READ: 1
}
// 状态显示文本
const STATUS_LABEL = {
  [FEEDBACK_STATUS.UNREAD]: '未处理',
  [FEEDBACK_STATUS.READ]: '已处理'
}
// 按钮显示文本
const BTN_LABEL = {
  [FEEDBACK_STATUS.UNREAD]: '查看',
  [FEEDBACK_STATUS.READ]: '已查看'
}

export default function FeedbackManage() {
  // 公告设置状态
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    type: '1'
  })
  const [publishLoading, setPublishLoading] = useState(false)

  // 意见反馈相关状态
  const [feedbackList, setFeedbackList] = useState([])
  const [actionLoadingId, setActionLoadingId] = useState(null)
  // localStorage兜底可暂时解决特殊异常
  const [viewedFeedbackIds, setViewedFeedbackIds] = useState(() => {
    const saved = localStorage.getItem('viewed_feedback_ids')
    return saved ? JSON.parse(saved) : []
  })

  // 弹窗状态 
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)

  // 获取反馈列表 
  const fetchFeedbackList = async (page, itemsPerPage) => {
    try {
      console.log('📤 发送获取反馈列表请求，参数：', { pageNum: page, pageSize: itemsPerPage })
      const res = await request.get('/admin/feedbacks', {
        pageNum: page,
        pageSize: itemsPerPage
      })
      console.log('✅ 反馈列表接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        const { list = [], total = list.length } = res.data || {}
        
        const formattedList = list.map(item => {
          const apiStatus = item.status ?? FEEDBACK_STATUS.UNREAD
          const finalStatus = viewedFeedbackIds.includes(item.id) ? FEEDBACK_STATUS.READ : apiStatus
          return {
            id: item.id,
            userId: item.userId || item.user_id, // 兼容两种字段
            contact: item.contact || '-',
            submitTime: item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '/') : '',
            submitter: item.nickname || '匿名用户',
            problemType: '其他反馈',
            description: item.content || '',
            status: finalStatus
          }
        })

        setFeedbackList(formattedList)
        return { total }
      } else {
        throw new Error(res.msg || '获取反馈列表失败')
      }
    } catch (err) {
      console.error('❌ 获取反馈列表失败：', err)
      throw err
    }
  }

  // 分页Hook
  const {
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    refresh
  } = usePagination({
    itemsPerPage: 10,
    fetchData: fetchFeedbackList,
    dependencies: []
  })

  const markFeedbackAsRead = async (feedbackId) => {
    if (!feedbackId || actionLoadingId === feedbackId) return
    try {
      setActionLoadingId(feedbackId)
      console.log(`📤 发送标记反馈已读请求，feedbackId: ${feedbackId}`)

      // request.post(url, data, params, options)
      // 空请求体 feedbackId放在Query参数
      const res = await request.post(
        '/admin/feedback/read', // url
        {}, // data：空请求体
        { feedbackId: feedbackId } // params：放在Query参数里
      )

      console.log(`✅ 标记反馈已读接口返回：`, res)
      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        // 本地立即更新列表状态
        setFeedbackList(prevList => 
          prevList.map(item => 
            item.id === feedbackId 
              ? { ...item, status: FEEDBACK_STATUS.READ }
              : item
          )
        )

        // 本地兜底持久化
        const newViewedIds = [...new Set([...viewedFeedbackIds, feedbackId])]
        setViewedFeedbackIds(newViewedIds)
        localStorage.setItem('viewed_feedback_ids', JSON.stringify(newViewedIds))

        return true
      } else {
        throw new Error(res.msg || '标记已读失败')
      }
    } catch (err) {
      console.error('❌ 标记反馈已读失败：', err)
      // 接口报错时，仍做本地标记兜底
      const newViewedIds = [...new Set([...viewedFeedbackIds, feedbackId])]
      setViewedFeedbackIds(newViewedIds)
      localStorage.setItem('viewed_feedback_ids', JSON.stringify(newViewedIds))
      setFeedbackList(prevList => 
        prevList.map(item => 
          item.id === feedbackId 
            ? { ...item, status: FEEDBACK_STATUS.READ }
            : item
        )
      )
      toast.error(err.message || '标记已读失败，已本地记录查看状态')
      return true // 即使接口报错 也允许打开弹窗
    } finally {
      setActionLoadingId(null)
    }
  }

  // 发布公告逻辑
  const handlePublishNotice = async () => {
    if (!noticeForm.title.trim()) {
      toast.error('请填写公告标题')
      return
    }
    if (!noticeForm.content.trim()) {
      toast.error('请填写公告内容')
      return
    }

    setPublishLoading(true)
    try {
      console.log('📤 发送发布公告请求，参数：', noticeForm)
      const res = await request.post('/admin/announcements', noticeForm)
      console.log('✅ 发布公告接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        toast.success(res.msg || '公告发布成功')
        setNoticeForm({ title: '', content: '', type: '1' })
      } else {
        throw new Error(res.msg || '公告发布失败')
      }
    } catch (err) {
      console.error('❌ 发布公告失败：', err)
      toast.error(err.message || '公告发布失败')
    } finally {
      setPublishLoading(false)
    }
  }

  // 交互逻辑
  const handleNoticeChange = (key, value) => {
    setNoticeForm(prev => ({ ...prev, [key]: value }))
  }

  //查看反馈逻辑（自动标记已读+支持反复查看）
  const handleViewFeedback = async (item) => {
    // 首次点击未读反馈：先调用标记已读接口
    if (item.status === FEEDBACK_STATUS.UNREAD) {
      const markSuccess = await markFeedbackAsRead(item.id)
      if (!markSuccess) return
    }

    // 无论是否已读，都打开详情弹窗
    setCurrentFeedback(item)
    setDetailModalVisible(true)
  }

  const handleCloseModal = () => {
    setDetailModalVisible(false)
    setCurrentFeedback(null)
  }

  return (
    <div className={styles['feedback-page']}>
      {/* 公告设置区域 */}
      <div className={styles['notice-section']}>
        <h1 className={styles['section-title']}>公告设置</h1>

        <div className={styles['form-row']}>
          <label className={styles['form-label']}>公告标题</label>
          <input
            type="text"
            className={styles['title-input']}
            value={noticeForm.title}
            onChange={(e) => handleNoticeChange('title', e.target.value)}
          />
        </div>

        <div className={styles['form-row']}>
          <label className={styles['form-label']}>公告内容</label>
          <textarea
            className={styles['content-textarea']}
            value={noticeForm.content}
            onChange={(e) => handleNoticeChange('content', e.target.value)}
            placeholder="请输入公告内容..."
          />
        </div>

        <div className={styles['publish-btn-row']}>
          <button 
            className={styles['publish-btn']}
            onClick={handlePublishNotice}
            disabled={publishLoading}
            style={{ opacity: publishLoading ? 0.7 : 1 }}
          >
            {publishLoading ? '发布中...' : '发布公告'}
          </button>
        </div>
      </div>

      {/* 意见反馈管理区域 */}
      <div className={styles['feedback-section']}>
        <h1 className={styles['section-title']}>意见反馈管理</h1>

        {/* 加载/错误提示 */}
        {loading && <div className={styles['loading-tip']}>正在加载反馈数据...</div>}
        {error && <div className={styles['error-tip']}>{error}</div>}

        <div className={styles['table-wrapper']}>
          <table className={styles['feedback-table']}>
            <thead>
              <tr>
                <th>提交时间</th>
                <th>提交人</th>
                <th>联系方式</th>
                <th>问题类型</th>
                <th>问题描述</th>
                <th>处理状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {!loading && feedbackList.map((item) => (
                <tr key={item.id} className={styles['table-row']}>
                  <td>{item.submitTime}</td>
                  <td>{item.submitter}</td>
                  <td>{item.contact}</td>
                  <td>{item.problemType}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`${styles['status-tag']} ${styles[`status-${item.status === FEEDBACK_STATUS.READ ? 'read' : 'unread'}`]}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles['view-btn']} ${item.status === FEEDBACK_STATUS.READ ? styles['btn-read'] : ''}`}
                      onClick={() => handleViewFeedback(item)}
                      disabled={actionLoadingId === item.id}
                    >
                      {actionLoadingId === item.id ? '处理中...' : BTN_LABEL[item.status]}
                    </button>
                  </td>
                </tr>
              ))}

              {/* 空数据状态 */}
              {!loading && !error && feedbackList.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles['empty-row']}>
                    暂无反馈数据
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

      {/* 反馈详情弹窗 */}
      {detailModalVisible && currentFeedback && (
        <div className={styles['modal-overlay']} onClick={handleCloseModal}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2 className={styles['modal-title']}>反馈详情</h2>
              <button className={styles['modal-close-btn']} onClick={handleCloseModal}>×</button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['modal-detail-row']}>
                <span className={styles['modal-detail-label']}>提交时间：</span>
                <span className={styles['modal-detail-value']}>{currentFeedback.submitTime}</span>
              </div>
              <div className={styles['modal-detail-row']}>
                <span className={styles['modal-detail-label']}>提交人：</span>
                <span className={styles['modal-detail-value']}>{currentFeedback.submitter}</span>
              </div>
              <div className={styles['modal-detail-row']}>
                <span className={styles['modal-detail-label']}>联系方式：</span>
                <span className={styles['modal-detail-value']}>{currentFeedback.contact}</span>
              </div>
              <div className={styles['modal-detail-row']}>
                <span className={styles['modal-detail-label']}>问题类型：</span>
                <span className={styles['modal-detail-value']}>{currentFeedback.problemType}</span>
              </div>
              <div className={styles['modal-detail-row']}>
                <span className={styles['modal-detail-label']}>问题描述：</span>
              </div>
              <div className={styles['modal-description-box']}>
                {currentFeedback.description}
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['modal-confirm-btn']} onClick={handleCloseModal}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}