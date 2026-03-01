// Gallery.jsx - 修改 loading 部分
import { useCallback, useEffect, useState } from 'react';
import { OrderDisplayCard } from '../components/orderDisplayCard';
import { OrderDetail } from '../components/orderDetailCard';
import { Camera, Sparkles, ArrowLeft, MapPin, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { Pagination } from '../components/pagination';
import { OrderDisplayStore } from '../store/orderDisplayStore';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import { useGetCompletedOrders, useGetOrderDetail } from '../hooks/useOrder';

function Gallery() {
  const { goBack } = useNavigation();
  const [loading,] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = OrderDisplayStore(state => state.orderList);
  const totalOrdersNum = OrderDisplayStore(state => state.totalOrders);
  const currentOrder = OrderDisplayStore(state => state.currentOrder);

  const getCompletedOrders = useGetCompletedOrders();
  const useGetOrderDetailMutation = useGetOrderDetail();

  useEffect(() => {
    if (selectedOrder?.order_id) {
      useGetOrderDetailMutation.mutate(selectedOrder?.order_id);
    }
  }, [selectedOrder]);

  // 分页逻辑
  const fetchOrders = useCallback(async (pageNum, pageSize) => {
    return getCompletedOrders.mutateAsync({pageNum, pageSize});
  }, [getCompletedOrders]);

  const {
    currentPage,
    totalPages,
    setCurrentPage,
    loading: paginationLoading, // 添加分页加载状态
  } = usePagination({
    itemsPerPage: 12,
    fetchData: fetchOrders,
    initialPage: 1,
    total: totalOrdersNum,
  });

  const handleGoBack = () => {
    goBack();
  };

  // 组合加载状态
  const isLoading = loading || paginationLoading;

  // 加载状态骨架屏 - 与 OrderDisplayCard 完全一致
  if (isLoading && !orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
        {/* 装饰性背景元素保持不变 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-full blur-3xl" />
          <Camera className="absolute top-20 left-10 w-12 h-12 text-orange-200/20 rotate-12" />
          <Camera className="absolute bottom-20 right-10 w-16 h-16 text-pink-200/20 -rotate-12" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题和返回按钮 - 与真实页面一致 */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-28 w-full">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-orange-100 text-gray-600 hover:text-orange-500 hover:border-orange-200 transition-all duration-300 group"
                  aria-label="返回"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">返回</span>
                </button>
                <div className='ml-[20px]'>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                    作品广场
                    <Sparkles className="w-8 h-8 text-orange-400" />
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">发现优秀的摄影作品，灵感从这里开始</p>
                </div>
              </div>
            </div>
          </div>

          {/* 骨架屏网格 - 与 OrderDisplayCard 完全一致的尺寸和布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="animate-pulse bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-orange-100/50 relative"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                {/* 图片区域 - 4:5比例，与 OrderDisplayCard 一致 */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                  {/* 状态标签骨架 - 右上角 */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="w-16 h-6 bg-gray-300/70 rounded-full" />
                  </div>
                  
                  {/* 类型标签骨架 - 右下角（在图片区域内） */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <div className="w-14 h-6 bg-gray-300/70 rounded-full" />
                  </div>
                </div>

                {/* 内容区域 - 绝对定位底部，与 OrderDisplayCard 完全一致 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
                  {/* 摄影师信息区域 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* 头像骨架 */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        {/* 在线状态点 */}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white" />
                      </div>
                      
                      {/* 昵称和ID骨架 */}
                      <div className="space-y-1.5">
                        <div className="h-4 bg-gray-300 rounded w-20" />
                        <div className="h-3 bg-gray-300 rounded w-24" />
                      </div>
                    </div>
                    
                    {/* 专业设备标签骨架 */}
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-gray-300 rounded-full" />
                    </div>
                  </div>

                  {/* 地点和拍摄时间骨架 */}
                  <div className="flex items-center justify-between">
                    {/* 地点骨架 */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-300" />
                      <div className="h-3 bg-gray-300 rounded w-16" />
                    </div>

                    {/* 时间骨架 */}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-300" />
                      <div className="h-3 bg-gray-300 rounded w-14" />
                    </div>
                  </div>
                </div>

                {/* 添加微光动画效果 */}
                <div 
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                  }}
                />
              </div>
            ))}
          </div>

          {/* 分页骨架 - 当总页数>1时显示 */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 添加 shimmer 动画 */}
        <style>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }

  // 正常渲染
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 装饰性背景元素 - 保持不变 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-full blur-3xl" />
        <Camera className="absolute top-20 left-10 w-12 h-12 text-orange-200/20 rotate-12" />
        <Camera className="absolute bottom-20 right-10 w-16 h-16 text-pink-200/20 -rotate-12" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-28 w-full">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-orange-100 text-gray-600 hover:text-orange-500 hover:border-orange-200 transition-all duration-300 group"
                aria-label="返回"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">返回</span>
              </button>
              <div className='ml-[20px]'>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                  作品广场
                  <Sparkles className="w-8 h-8 text-orange-400" />
                </h1>
                <p className="text-gray-600 mt-2 text-lg">发现优秀的摄影作品，灵感从这里开始</p>
              </div>
            </div>
          </div>
        </div>

        {/* 帖子网格 */}
        {orders && orders.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {orders.map((order, index) => (
                <div
                  key={order?.order_id ?? index}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <OrderDisplayCard
                    post={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                </div>
              ))}
            </div>

            {/* 分页组件 */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* 显示统计信息 */}
            <div className="text-center mt-6 text-sm text-gray-500">
              共 {totalOrdersNum || 0} 条作品
              {totalPages > 1 && `，第 ${currentPage} / ${totalPages} 页`}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
              <Camera className="w-12 h-12 text-orange-400" />
            </div>
            <p className="text-xl text-gray-500">暂无已完成的作品</p>
            <p className="text-gray-400 mt-2">
              等待摄影师完成订单后，作品会在这里展示
            </p>
          </div>
        )}

        {/* 作品详情弹窗 */}
        {selectedOrder && (
          <OrderDetail
            orderData={currentOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>

      {/* 内联样式动画 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Gallery;