// components/profile/OrdersSection.jsx
import { FileText } from 'lucide-react';
import { OrderCard } from '../orderCard';

export function OrdersSection({ 
  orders, 
  loading, 
  emptyMessage, 
  emptyHint, 
  emptyAction, 
  readOnly = false, 
  filter = false,
  selectedStatus = 'all',  // 从父组件传入选中的状态
  setStatus                // 设置筛选状态的函数
}) {
  // 状态映射 - 按顺序排列，all 在最前面
  const statusMap = {
    'all': '全部',
    0: '待接单',
    1: '已接单',
    2: '已支付',
    3: '已完成',
    4: '已评价',
    '-1': '已取消',
    '-2': '已拒绝',
    '-3': '草稿'
  };

  // 状态样式映射
  const getStatusStyle = (status) => {
    if (status === 'all') return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    
    switch (Number(status)) {
      case 3:
      case 4:
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 1:
      case 2:
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 0:
        return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case -1:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case -2:
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case -3:
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  // 判断当前状态是否选中（统一转为字符串比较）
  const isSelected = (status) => {
    return String(selectedStatus) === String(status);
  };

  const handleStatusChange = (status) => {
    if (setStatus) {
      // 保持传入的状态类型一致
      setStatus(status);
    }
  };

  // 空状态显示
  if (orders.length === 0 && !loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
        {filter && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 mr-2">筛选：</span>
              <button
                key="all"
                onClick={() => handleStatusChange('all')}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isSelected('all')
                    ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                    : `${getStatusStyle('all')} hover:shadow-sm`
                  }
                `}
              >
                全部
              </button>
              {Object.entries(statusMap)
                .filter(([status]) => status !== 'all')
                .map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isSelected(status)
                        ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                        : `${getStatusStyle(status)} hover:shadow-sm`
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
            </div>
          </div>
        )}
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <FileText className="w-10 h-10 text-orange-400" />
          </div>
          <p className="text-gray-500 mb-2">{emptyMessage}</p>
          {emptyHint && <p className="text-xs text-gray-400">{emptyHint}</p>}
          {emptyAction}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative min-h-[400px]">
      {/* 筛选栏 */}
      {filter && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-100">
            <span className="text-sm text-gray-500 mr-2">筛选：</span>
            <button
              key="all"
              onClick={() => handleStatusChange('all')}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isSelected('all')
                  ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                  : `${getStatusStyle('all')} hover:shadow-sm`
                }
              `}
            >
              全部
            </button>
            {Object.entries(statusMap)
              .filter(([status]) => status !== 'all')
              .map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected(status)
                      ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                      : `${getStatusStyle(status)} hover:shadow-sm`
                    }
                  `}
                >
                  {label}
                </button>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order.order_id}
            order={order}
            readOnly={readOnly}
          />
        ))}
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-3xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      )}
    </div>
  );
}