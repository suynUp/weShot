// Gallery.jsx
import { useCallback, useEffect, useState } from 'react';
import { OrderDisplayCard } from '../components/orderDisplayCard';
import { PostDetail } from '../components/postDetail';
import { Camera, Sparkles, ArrowLeft } from 'lucide-react';
import { Pagination } from '../components/pagination';
import { OrderDisplayStore } from '../store/orderDisplayStore';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import { useGetCompletedOrders } from '../hooks/useOrder'; // 假设有这个 hook

function Gallery() {
  const { goBack } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const orders = OrderDisplayStore(state => state.orderList);
  const totalOrdersNum = OrderDisplayStore(state => state.totalOrders);
  console.log('Gallery render, orders:', orders);

  const getCompletedOrders = useGetCompletedOrders();

  // 分页逻辑
  // 使用 useCallback 包装
  const fetchOrders = useCallback(async (pageNum, pageSize) => {
    return getCompletedOrders.mutateAsync({pageNum, pageSize});
  }, [getCompletedOrders]);

  const {
    currentPage,
    totalPages,
    setCurrentPage,
  } = usePagination({
    itemsPerPage: 12,
    fetchData: fetchOrders,
    initialPage: 1,
    total: totalOrdersNum,
  });

  // 监听 orders 变化
  useEffect(() => {
    console.log('orders 更新了:', orders);
  }, [orders]);

  const handleGoBack = () => {
    goBack();
  };

  // 加载状态
  if (loading && !orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <Camera className="w-8 h-8 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-lg text-gray-600 mt-4">加载精彩作品...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 装饰性背景元素 */}
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
                    onClick={() => setSelectedPost(order)}
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
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
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