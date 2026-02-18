import { 
  Calendar, Clock, MapPin, Users, DollarSign, 
  Camera, Phone, MessageSquare, User,
  CheckCircle, XCircle, AlertCircle, Filter,
  Search, Star, ChevronDown, Package, Wrench, Image, BookOpen
} from 'lucide-react';

// 订单卡片组件
function OrderCard({ order }) {
  // 格式化日期时间
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    };
  };

  const shootTime = formatDate(order.shoot_time);
  const createTime = formatDate(order.created_at);

  // 获取状态标签样式
  const getStatusBadge = (status) => {
    const statusMap = {
      0: { text: '待接单', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      1: { text: '已接单', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      2: { text: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      3: { text: '已取消', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    return statusMap[status] || statusMap[0];
  };

  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="bg-white rounded-xl h-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* 订单头部 - 简洁状态和订单号 */}
      <div className="px-6 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">#{order.order_id}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* 订单主体内容 - 模块化布局 */}
      <div className="p-6">
        {/* 模块1: 客户信息 */}
        <div className="mb-6">
          <h3 className="text-start text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">客户信息</h3>
          <div className="flex items-center gap-3">
            <img
              src={order.customerAvatar}
              alt={order.customerName}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{order.customerName}</span>
                <span className="text-xs text-gray-500">ID: {order.customer_id}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-xs">
                  {order.photographer_id ? '指定摄影师' : '平台分配'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 模块2: 拍摄信息 - 三列布局 */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-start">拍摄信息</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-start text-gray-500">拍摄日期</p>
                <p className="text-sm text-start font-medium">{shootTime.date}</p>
                <p className="text-xs text-start text-gray-600">{shootTime.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-start text-gray-500">拍摄时长</p>
                <p className="text-sm text-start font-medium">{order.duration}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-start text-gray-500">拍摄地点</p>
                <p className="text-start text-sm font-medium truncate max-w-[120px]" title={order.location}>
                  {order.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-start text-gray-500">拍摄人数</p>
                <p className="text-start text-sm font-medium">{order.subject_count} 人</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Image className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-start text-gray-500">拍摄类型</p>
                <p className="text-start text-sm font-medium">{order.type}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Wrench className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">专业设备</p>
                <p className="text-start text-sm font-medium">
                  {order.need_equipment ? (
                    <span className="text-start text-green-600">需要</span>
                  ) : (
                    <span className="text-start text-gray-500">不需要</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 模块3: 报酬与联系方式 - 两列布局 */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-start text-gray-400 uppercase tracking-wider mb-3">报酬与联系</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">报酬</p>
                <p className="text-lg font-bold text-orange-600">¥ {order.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">联系方式</p>
                <p className="text-base font-medium">{order.contact_info}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 模块4: 备注信息 - 如果有的话 */}
        {order.remark && order.remark !== '无' && (
          <div className="mb-4">
            <h3 className="text-xs text-start font-semibold text-gray-400 uppercase tracking-wider mb-2">备注</h3>
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{order.remark}</p>
            </div>
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <BookOpen className="w-3 h-3" />
            <span>发布时间: {createTime.date} {createTime.time}</span>
          </div>
          
          {/* 支付状态标签 */}
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full ${
              order.payment_status === 0 ? 'bg-orange-100 text-orange-700' :
              order.payment_status === 1 ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {order.payment_status === 0 ? '待支付' :
               order.payment_status === 1 ? '已支付' : '已退款'}
            </span>
            
            {order.status === 0 && (
              <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow">
                立即接单
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard