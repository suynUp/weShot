import { MoreHorizontal, MessageCircle, Star } from 'lucide-react';

export function OrderCard({ order, onCheck, checked = false, onStatusClick }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case '已完成':
        return {
          bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
          text: 'text-green-700',
          badge: 'bg-green-200 text-green-800',
          dot: 'bg-green-500'
        };
      case '对接中':
        return {
          bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
          text: 'text-blue-700',
          badge: 'bg-blue-200 text-blue-800',
          dot: 'bg-blue-500'
        };
      case '待接单':
        return {
          bg: 'bg-gradient-to-r from-orange-100 to-amber-100',
          text: 'text-orange-700',
          badge: 'bg-orange-200 text-orange-800',
          dot: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
          text: 'text-gray-700',
          badge: 'bg-gray-200 text-gray-800',
          dot: 'bg-gray-500'
        };
    }
  };

  const statusStyle = getStatusStyle(order.status);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        {/* 顶部：复选框和用户信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div
              onClick={() => onCheck?.(order.id, !checked)}
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
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{order.user_name}</span>
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.badge}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400">
                  {formatDate(order.created_at)}
                </span>
                {order.has_budget && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      含预算
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 订单描述 */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px] bg-gray-50/50 p-3 rounded-xl">
          {order.description}
        </p>

        {/* 底部：订单类型和操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-lg ${order.type === 1 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {order.type === 1 ? '拍摄订单' : '后期订单'}
            </span>
            {order.nickname && (
              <span className="text-xs text-gray-400">
                发布者: {order.nickname}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {order.status === '已完成' ? (
              <>
                <button
                  onClick={() => onStatusClick?.(order)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5" />
                  已完成
                </button>
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  去评价
                </button>
              </>
            ) : (
              <button
                onClick={() => onStatusClick?.(order)}
                className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} hover:shadow-md`}
              >
                {order.status === '对接中' && '💬'}
                {order.status === '待接单' && '📋'}
                {order.status}
              </button>
            )}
          </div>
        </div>

        {/* 进度条 - 如果是进行中的订单 */}
        {order.status === '对接中' && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-gradient-to-r from-orange-400 to-pink-400 rounded-full" />
              </div>
              <span className="text-xs text-gray-500">对接进度 66%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}