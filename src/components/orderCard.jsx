export function OrderCard({ order, onCheck, checked = false, onStatusClick }) {
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case '已完成':
        return 'bg-white/60 text-gray-800 hover:bg-white/80';
      case '对接中':
        return 'bg-white/60 text-gray-800 hover:bg-white/80';
      case '待接单':
        return 'bg-white/60 text-gray-800 hover:bg-white/80';
      default:
        return 'bg-white/60 text-gray-800 hover:bg-white/80';
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-800 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            onClick={() => onCheck?.(order.id, !checked)}
            className={`w-6 h-6 rounded border-2 border-gray-800 cursor-pointer flex items-center justify-center transition-colors ${
              checked ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {checked && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-gray-900 font-medium">{order.user_name}</span>
        </div>
        {order.has_budget && (
          <span className="text-sm text-gray-700">预算</span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-6 min-h-[20px]">
        {order.description}
      </p>

      <div className="flex justify-center gap-3">
        {order.status === '已完成' ? (
          <>
            <button
              onClick={() => onStatusClick?.(order)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${getStatusButtonStyle('已完成')}`}
            >
              已完成
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${getStatusButtonStyle('去评价')}`}
            >
              去评价
            </button>
          </>
        ) : (
          <button
            onClick={() => onStatusClick?.(order)}
            className={`w-full py-2 rounded-full text-sm font-medium transition-colors ${getStatusButtonStyle(order.status)}`}
          >
            {order.status}
          </button>
        )}
      </div>
    </div>
  );
}