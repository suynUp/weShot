import { useState, useEffect, useMemo, useRef } from 'react'
import { usePagination } from '../hooks/usePagination.js'
import { Pagination } from '../components/pagination.jsx'
import { toast } from '../hooks/useToast.jsx'
import request from '../utils/request.js'
import styles from './ContentAudit.module.css'

// 图片字符串解析函数
const parseImages = (imagesStr) => {
  if (!imagesStr) return []
  try {
    const parsed = JSON.parse(imagesStr)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('图片地址解析失败：', e, '原始值：', imagesStr)
    return []
  }
}

// 时间范围判断函数
const isTimeInRange = (timeStr, days) => {
  if (!timeStr) return false
  const targetTime = new Date(timeStr).getTime()
  const now = Date.now()
  const range = days * 24 * 60 * 60 * 1000
  return now - targetTime <= range
}

// 辅助显示函数
const getDisplayNickname = (user) => {
  if (user.nickname === 'Admin' || user.cas_id === 'Admin' || user.user_id === 'Admin') return 'Admin'
  if (!user.nickname) return `用户${user.cas_id || user.user_id || '未知'}`
  return user.nickname
}

// 辅助显示函数
const getDisplayCustomer = (order) => {
  if (!order) return '未知用户'
  if (order.customerName) return order.customerName
  if (order.customer_id) return `用户${order.customer_id}`
  return '未知用户'
}

const CONTENT_TYPE_CONFIG = {
  作品: {
    api: '/admin/posts',
    deleteApiPrefix: '/admin/posts/',
    pageParamName: 'pageNum',      
    pageSizeParamName: 'pageSize',   
    formatItem: (item) => {
      const images = parseImages(item.images)
      return {
        id: item.post_id,
        type: '作品',
        thumbnail: images[0] || '',
        publisherId: item.user_id,
        publisherName: getDisplayNickname(item),
        publishTime: item.created_at ? item.created_at.split('T')[0].replace(/-/g, '/') : '',
        fullPublishTime: item.created_at,
        rawData: { ...item, images: images },
        content: `标题：${item.title}\n内容：${item.content}`,
        status: item.status === 1 ? '正常' : '已删除'
      }
    }
  },
  客单: {
    api: '/admin/orders',
    deleteApiPrefix: '/admin/orders/',
    pageParamName: 'pageNum',
    pageSizeParamName: 'pageSize',
    formatItem: (item) => ({
      id: item.order_id,
      type: '客单',
      thumbnail: '',
      publisherId: item.customer_id,
      publisherName: getDisplayCustomer(item),
      publishTime: item.created_at ? item.created_at.split('T')[0].replace(/-/g, '/') : '',
      fullPublishTime: item.created_at,
      rawData: JSON.parse(JSON.stringify(item)),
      content: `类型：${item.type}\n时长：${item.duration}\n备注：${item.remark}`,
      status: '正常'
    })
  },
  评论: {
    api: '/admin/comments',
    deleteApiPrefix: '/admin/comments/',
    pageParamName: 'pageNum',       
    pageSizeParamName: 'pageSize',  
    formatItem: (item) => ({
      id: item.commentId,
      type: '评论',
      thumbnail: item.userAvatar || '',
      publisherId: item.userId || item.userName,
      publisherName: item.userName || `用户${item.userId || '未知'}`,
      publishTime: item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '/') : '',
      fullPublishTime: item.createdAt,
      rawData: JSON.parse(JSON.stringify(item)),
      content: `关联帖子：${item.postTitle}\n评论内容：${item.content}`,
      status: '正常'
    })
  }
}

export default function ContentAudit() {
  // 筛选条件状态
  const [filter, setFilter] = useState({
    contentType: '作品', 
    auditStatus: '全部',
    timeRange: '全部' 
  })

  // 核心数据状态
  const [tableData, setTableData] = useState([])
  // totalCount 仅用于展示，实际分页依赖 usePagination 的 total
  const [totalCount, setTotalCount] = useState(0)

  // 删除弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentDeleteItem, setCurrentDeleteItem] = useState(null)
  const [deleteForm, setDeleteForm] = useState({ reason: '', remark: '' })
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 详情弹窗状态
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentDetailItem, setCurrentDetailItem] = useState(null)

  const filterRef = useRef(filter)
  useEffect(() => {
    filterRef.current = filter
  }, [filter])

  // 分页 Hook
  const {
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    reloadCurrentPage
  } = usePagination({
    itemsPerPage: 10,
    fetchData: fetchContentList,
    // 筛选条件变化时，自动重置到第一页
    dependencies: [filter.contentType, filter.auditStatus, filter.timeRange]
  })

  // 筛选条件变化时 不再手动重置页码 只清空旧数据
  useEffect(() => {
    console.log('筛选条件变化，清空旧数据', filter)
    setTableData([])
    setTotalCount(0)
  }, [filter.contentType, filter.auditStatus, filter.timeRange])

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      console.log('页码超过总页数，自动重置到第1页')
      setCurrentPage(1)
    }
  }, [currentPage, totalPages, setCurrentPage])

  // 接口请求函数 
  async function fetchContentList(page, itemsPerPage) {
    try {
      const { contentType } = filterRef.current
      const config = CONTENT_TYPE_CONFIG[contentType]
      
      // 构建请求参数
      const requestParams = {
        [config.pageParamName]: page,
        [config.pageSizeParamName]: itemsPerPage,
        _t: Date.now() // 防缓存
      }
      
      console.log(`【${contentType}】请求第 ${page} 页，参数：`, requestParams)

      const res = await request.get(config.api, requestParams)
      console.log(`【${contentType}】接口返回：`, res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        const { list = [], total = list.length, currentPage: respPage } = res.data || {}
        
        // 如果后端返回了当前页码 可校验是否与请求一致
        if (respPage !== undefined && respPage !== page) {
          console.warn(`1111后端返回的页码(${respPage})与请求页码(${page})不一致，可能参数名错误或后端分页逻辑异常`)
        }

        setTotalCount(total)
        console.log(`【${contentType}】本次返回 ${list.length} 条，总条数：${total}，总页数：${Math.ceil(total / itemsPerPage)}`)

        const formattedList = list.map(config.formatItem)
        setTableData(formattedList)
        
        return { total } // 返回 total 供 usePagination 更新内部 total
      } else {
        throw new Error(res.msg || `获取${contentType}列表失败`)
      }
    } catch (err) {
      console.error('❌ 获取内容列表失败：', err)
      setTableData([])
      setTotalCount(0)
      throw err
    }
  }

  // 查看详情逻辑 
  const handleViewDetail = (item) => {
    console.log('👀点击查看详情，完整item：', item)
    setCurrentDetailItem(item)
    setShowDetailModal(true)
  }

  // 删除逻辑 
  const handleDeleteClick = (item) => {
    if (item.status === '已删除') return
    console.log('打开删除弹窗，当前item：', item)
    setCurrentDeleteItem(item)
    setShowDeleteModal(true)
  }

  const handleFormChange = (key, value) => {
    setDeleteForm(prev => ({ ...prev, [key]: value }))
  }

  const handleDeleteSubmit = async () => {
    if (!deleteForm.reason) {
      toast.error('请选择删除原因')
      return
    }
    if (!currentDeleteItem) return
    if (deleteLoading) return

    setDeleteLoading(true)
    try {
      const { type, id } = currentDeleteItem
      console.log(`开始删除${type}，ID：${id}，删除原因：`, deleteForm)
      
      const deleteApi = `${CONTENT_TYPE_CONFIG[type].deleteApiPrefix}${id}`
      const res = await request.delete(deleteApi)
      console.log('√删除接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        setTableData(prev => prev.map(item => {
          if (item.id === id) return { ...item, status: '已删除' }
          return item
        }))

        toast.success(res.msg || `${type}删除成功`)
        handleDeleteModalClose()
        reloadCurrentPage() // 重新加载当前页数据
      } else {
        throw new Error(res.msg || '删除失败，请重试')
      }
    } catch (err) {
      console.error('❌ 删除失败：', err)
      toast.error(err.message || '删除失败，请检查网络后重试')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteModalClose = () => {
    if (deleteLoading) return
    setShowDeleteModal(false)
    setCurrentDeleteItem(null)
    setDeleteForm({ reason: '', remark: '' })
  }

  const handleDetailModalClose = () => {
    setShowDetailModal(false)
    setCurrentDetailItem(null)
  }

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }))
  }

  // 前端筛选 
  const filteredTableData = useMemo(() => {
    return tableData.filter(item => {
      const matchStatus = filter.auditStatus === '全部' || item.status === filter.auditStatus
      let matchTime = true
      if (filter.timeRange === '最近7天') {
        matchTime = isTimeInRange(item.fullPublishTime, 7)
      } else if (filter.timeRange === '最近30天') {
        matchTime = isTimeInRange(item.fullPublishTime, 30)
      }
      return matchStatus && matchTime
    })
  }, [tableData, filter])

  return (
    <div className={styles['content-audit-page']}>
      {/* 顶部筛选栏 */}
      <div className={styles['filter-bar']}>
        <div className={styles['filter-item']}>
          <span>内容类型：</span>
          <select 
            value={filter.contentType}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
          >
            <option value="作品">作品（帖子）</option>
            <option value="客单">客单</option>
            <option value="评论">评论</option>
          </select>
        </div>

        <div className={styles['filter-item']}>
          <span>内容状态：</span>
          <select 
            value={filter.auditStatus}
            onChange={(e) => handleFilterChange('auditStatus', e.target.value)}
          >
            <option value="全部">全部</option>
            <option value="正常">正常</option>
            <option value="已删除">已删除</option>
          </select>
        </div>

        <div className={styles['filter-item']}>
          <span>时间范围：</span>
          <select 
            value={filter.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          >
            <option value="全部">全部</option>
            <option value="最近7天">最近7天</option>
            <option value="最近30天">最近30天</option>
          </select>
        </div>
      </div>

      {/* 加载/错误提示 */}
      {loading && <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px' }}>正在加载数据...</div>}
      {error && <div style={{ textAlign: 'center', padding: '20px', color: 'red', fontSize: '16px' }}>{error}</div>}

      {/* 核心表格 */}
      <div className={styles['table-container']}>
        <table className={styles['audit-table']}>
          <thead>
            <tr>
              <th>缩略图/预览</th>
              <th>发布者</th>
              <th>发布时间</th>
              <th>内容状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredTableData.map((item) => (
              <tr key={item.id}>
                <td className={styles['img-cell']}>
                  <div className={styles['thumbnail-placeholder']}>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="内容缩略图" />
                    ) : (
                      <span>{item.type === '客单' ? '📋' : '📷'}</span>
                    )}
                  </div>
                  <div title={item.content} style={{ fontSize: '12px', marginTop: '4px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.content.split('\n')[0]}
                  </div>
                </td>
                <td>{item.publisherName}（ID：{item.publisherId}）</td>
                <td>{item.publishTime}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: item.status === '已删除' ? '#fee2e2' : '#ecfdf5',
                    color: item.status === '已删除' ? '#dc2626' : '#059669'
                  }}>
                    {item.status}
                  </span>
                </td>
                
                <td className={styles['btn-cell']}>
                  <div className={styles['btn-group']}>
                    <button 
                      className={styles['btn-detail']}
                      onClick={() => handleViewDetail(item)}
                    >
                      查看详情
                    </button>
                    <button 
                      className={styles['btn-reject']}
                      onClick={() => handleDeleteClick(item)}
                      disabled={item.status === '已删除' || deleteLoading}
                      style={{ opacity: (item.status === '已删除' || deleteLoading) ? 0.5 : 1 }}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* 空数据状态 */}
            {!loading && !error && filteredTableData.length === 0 && (
              <tr>
                <td colSpan={5} className={styles['empty-row']}>暂无匹配的内容</td>
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

      {/* 内容详情弹窗 */}
      {showDetailModal && currentDetailItem && (
        <div className={styles['modal-mask']} onClick={handleDetailModalClose}>
          <div className={styles['detail-modal']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2 className={styles['modal-title']}>{currentDetailItem.type}详情</h2>
              <button className={styles['modal-close-btn']} onClick={handleDetailModalClose}>×</button>
            </div>

            <div className={styles['modal-body']}>
              {/* 通用基础信息 */}
              <div className={styles['detail-row']}>
                <span className={styles['detail-label']}>内容ID：</span>
                <span className={styles['detail-value']}>{currentDetailItem.id}</span>
              </div>
              <div className={styles['detail-row']}>
                <span className={styles['detail-label']}>发布者：</span>
                <span className={styles['detail-value']}>{currentDetailItem.publisherName}（ID：{currentDetailItem.publisherId}）</span>
              </div>
              <div className={styles['detail-row']}>
                <span className={styles['detail-label']}>发布时间：</span>
                <span className={styles['detail-value']}>{currentDetailItem.publishTime}</span>
              </div>
              <div className={styles['detail-row']}>
                <span className={styles['detail-label']}>内容状态：</span>
                <span className={styles['detail-value']}>{currentDetailItem.status}</span>
              </div>

              <div className={styles['divider']}></div>

              {/* 作品（帖子）专属详情 */}
              {currentDetailItem.type === '作品' && (
                <>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>帖子标题：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.title || '无标题'}</span>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>帖子内容：</span>
                    <div className={styles['detail-content-box']}>{currentDetailItem.rawData?.content || '无内容'}</div>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>帖子类型：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.type || '未分类'}</span>
                  </div>
                  {/* 帖子图片渲染 */}
                  {currentDetailItem.rawData?.images?.length > 0 ? (
                    <div className={styles['detail-row']}>
                      <span className={styles['detail-label']}>帖子图片：</span>
                      <div className={styles['image-grid']}>
                        {currentDetailItem.rawData.images.map((img, index) => (
                          <img key={index} src={img} alt={`帖子图片${index+1}`} className={styles['detail-img']} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles['detail-row']}>
                      <span className={styles['detail-label']}>帖子图片：</span>
                      <span className={styles['detail-value']}>无图片</span>
                    </div>
                  )}
                </>
              )}

              {/* 评论专属详情 */}
              {currentDetailItem.type === '评论' && (
                <>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>关联帖子：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.postTitle || '无'}（ID：{currentDetailItem.rawData?.postId || '无'}）</span>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>评论内容：</span>
                    <div className={styles['detail-content-box']}>{currentDetailItem.rawData?.content || '无内容'}</div>
                  </div>
                </>
              )}

              {/* 客单专属详情 */}
              {currentDetailItem.type === '客单' && (
                <>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>订单类型：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.type || '无'}</span>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>客户姓名：</span>
                    <span className={styles['detail-value']}>{getDisplayCustomer(currentDetailItem.rawData)}</span>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>拍摄时长：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.duration || '无'}</span>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>拍摄地点：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.location || '无'}</span>
                  </div>
                  <div className={styles['detail-row']}>
                    <span className={styles['detail-label']}>订单备注：</span>
                    <span className={styles['detail-value']}>{currentDetailItem.rawData?.remark || '无'}</span>
                  </div>
                </>
              )}
            </div>

            <div className={styles['modal-footer']}>
              <button className={styles['modal-confirm-btn']} onClick={handleDetailModalClose}>关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteModal && currentDeleteItem && (
        <div className={styles['modal-mask']} onClick={handleDeleteModalClose}>
          <div className={styles['reject-modal']} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles['modal-title']}>确认删除{currentDeleteItem.type}</h2>

            <div className={styles['form-item']}>
              <label>删除原因：</label>
              <select
                className={styles['reject-select']}
                value={deleteForm.reason}
                onChange={(e) => handleFormChange('reason', e.target.value)}
                disabled={deleteLoading}
              >
                <option value="" disabled>请选择</option>
                <option value="内容违规">内容违规</option>
                <option value="画质不达标">画质不达标</option>
                <option value="标题不符合规范">标题不符合规范</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div className={`${styles['form-item']} ${styles['remark-item']}`}>
              <label>补充说明（可选）</label>
              <input
                type="text"
                className={styles['remark-input']}
                value={deleteForm.remark}
                onChange={(e) => handleFormChange('remark', e.target.value)}
                disabled={deleteLoading}
              />
            </div>

            <div className={styles['modal-btn-group']}>
              <button 
                className={styles['modal-btn']} 
                onClick={handleDeleteSubmit}
                disabled={deleteLoading}
              >
                {deleteLoading ? '删除中...' : '确认删除'}
              </button>
              <button 
                className={styles['modal-btn']} 
                onClick={handleDeleteModalClose} 
                disabled={deleteLoading}
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