// components/profile/OrdersSection.jsx
import { FileText } from 'lucide-react';
import { OrderCard } from '../orderCard';

export function OrdersSection({ orders, loading, emptyMessage, emptyHint, emptyAction, readOnly = false }) {
  if (orders.length === 0 && !loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order.order_id }
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