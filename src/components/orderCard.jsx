import { MoreHorizontal, MessageCircle, Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';

export function OrderCard({ order, onCheck, checked = false ,readOnly = true }) {
  
  const {goto} = useNavigation();

  // 订单状态映射
  const getOrderStatus = (status) => {
    const statusMap = {
      0: '待接单',
      1: '已接单',
      2: '已支付',
      3: '已完成',
      4: '已评价',
      '-1': '已取消',
      '-2': '已拒绝',
      '-3': '草稿'
    };
    return statusMap[status] || '未知状态';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 3: // 已完成
        return {
          bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
          text: 'text-green-700',
          badge: 'bg-green-200 text-green-800',
          dot: 'bg-green-500',
          label: '已完成'
        };
      case 1: // 已接单
      case 2: // 支付中
        return {
          bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
          text: 'text-blue-700',
          badge: 'bg-blue-200 text-blue-800',
          dot: 'bg-blue-500',
          label: status === 1 ? '已接单' : '已支付'
        };
      case 0: // 待接单
        return {
          bg: 'bg-gradient-to-r from-orange-100 to-amber-100',
          text: 'text-orange-700',
          badge: 'bg-orange-200 text-orange-800',
          dot: 'bg-orange-500',
          label: '待接单'
        };
      case -1: // 已取消
      case -2: // 已拒绝
        return {
          bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
          text: 'text-gray-700',
          badge: 'bg-gray-200 text-gray-800',
          dot: 'bg-gray-500',
          label: status === -1 ? '已取消' : '已拒绝'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
          text: 'text-gray-700',
          badge: 'bg-gray-200 text-gray-800',
          dot: 'bg-gray-500',
          label: '未知状态'
        };
    }
  };

  const statusMinus3Fn = () => {
    goto(`/launch?draft_id=${order.order_id}`); // 跳转到订单编辑页，传递草稿ID
  }

  const statusStyle = getStatusStyle(order.status);
  const orderStatus = getOrderStatus(order.status);

  // 格式化拍摄时间
  const formatShootTime = (dateString) => {
    if (!dateString) return '暂无';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div
    onClick={readOnly?()=>{}:()=>{
      goto(`/orderaction/${order.order_id}`)
    }}
     className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        {/* 顶部：复选框和用户信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {onCheck && (
              <div
                onClick={() => onCheck?.(order.order_id, !checked)}
                className={`w-5 h-5 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
                  checked 
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 border-orange-400 shadow-md' 
                    : 'border-gray-300 hover:border-orange-400 bg-white'
                }`}
              >
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800">{order.targetName || order.customerName}</span>
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.badge}`}>
                  {orderStatus}
                </span>
              </div>
              
              {/* 订单基本信息 */}
              <div className="grid grid-cols-3 gap-2 mt-2">
              {/* 左边 - 占2列 */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>拍摄: {formatShootTime(order.shoot_time)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{order.location}</span>
                </div>
              </div>
              
              {/* 右边 - 占1列 */}
              <div className="col-span-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{order.duration || '待定'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{order.subject_count || 1}人</span>
                </div>
              </div>
            </div>
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 订单备注 */}
        {order.remark && order.remark !== '无' && (
          <div className="mb-4">
            <p className="text-sm text-start text-gray-600 bg-gray-50/50 p-3 rounded-xl">
              <span className="font-medium text-gray-700">备注：</span>
              {order.remark}
            </p>
          </div>
        )}

        {/* 底部：订单类型、价格和操作按钮 */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {order.need_equipment && (
              <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700">
                需设备
              </span>
            )}
            <div className="flex items-center gap-1 text-orange-500 font-semibold">
              <DollarSign className="w-4 h-4" />
              <span>¥{order.price?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
          {order.status === 3 ? ( // 已完成
            <>
              <button 
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                去评价
              </button>
            </>
          ) : order.status === 0 ? ( // 待接单
            <button
              className="px-6 py-1.5 disabled:opacity-50 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              等待接单
            </button>
          ) : order.status === 1 ? ( // 已接单
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} hover:shadow-md`}
            >
              去支付
            </button>
          ) : order.status === 2 ? ( // 已支付
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 hover:from-blue-200 hover:to-cyan-200 transition-all duration-200 flex items-center gap-1 shadow-sm border border-blue-200">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              去评价
            </button>
          ) : order.status === 4 ? ( // 已评价
            <button className="px-6 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-green-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              评价成功
            </button>
          ) : order.status === -1 ? ( // 已取消
            <button 
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 cursor-not-allowed opacity-60">
              已取消
            </button>
          ) : order.status === -2 ? ( // 已拒绝
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-600 cursor-not-allowed opacity-60 border border-red-200">
              已拒绝
            </button>
          ) : order.status === -3 ? ( // 草稿
            <button
            onClick={statusMinus3Fn} 
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
              去发布
            </button>
          ) : (
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600">
              未知状态
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}