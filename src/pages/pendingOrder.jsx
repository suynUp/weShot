import { useEffect, useState } from 'react';
import { 
  Camera, AlertCircle, Package, Grid3X3, List, 
  Clock, TrendingUp, Star, ChevronLeft
} from 'lucide-react';

import OrderCard from '../components/orderSquareCard';
import { Pagination } from '../components/pagination'; // 导入页码组件
import { usePagination } from '../hooks/usePagination';
import { useNavigation } from '../hooks/navigation';
import { UserStore } from '../store/userStore';
import { useGetOrder, useTakeOrderMutation } from '../hooks/useOrder';
import { OrderStore } from '../store/orderStore';

// 主页面组件 - 接单广场
function PhotographerOrderSquare() {
  // 模拟订单数据（扩大数据量用于测试分页）

  // 状态
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' 或 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price', 'popular'
  const [showSortMenu, setShowSortMenu] = useState(false);

  const isVerFied = UserStore(state => state.isVerFied)
  
  const {getAllLobbys} = useGetOrder()
  const allPendingOrders = OrderStore(state => state.allPendingOrders)

  const takeOrder = useTakeOrderMutation()
  
  const { goto } = useNavigation();

  useEffect(()=>{
    getAllLobbys()
  },[])

  // 使用分页 Hook
  const {
    currentPage,
    totalPages,
    paginatedData: currentOrders,
    setCurrentPage
  } = usePagination({
    data: allPendingOrders,
    itemsPerPage: 9, // 每页显示6个订单
    initialPage: 1
  });

  const handleTakeOrder = (postId) => {
    takeOrder.mutate(postId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* 头部导航 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => goto('/')}
              className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">返回</span>
            </button>
            
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="relative">
                <Camera className="w-8 h-8 text-orange-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  接单广场
                </h1>
                <p className="text-xs text-gray-500">发现适合你的拍摄订单</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 rounded-full border border-orange-200">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-700 font-medium">
                <span className="text-lg font-bold">{allPendingOrders.length}</span> 个订单可接
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              找到 <span className="font-semibold text-orange-600">{allPendingOrders.length}</span> 个订单
            </span>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              >
                清除搜索
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* 排序下拉菜单 */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-orange-300 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {sortBy === 'newest' && '最新发布'}
                  {sortBy === 'price' && '价格最高'}
                  {sortBy === 'popular' && '最受欢迎'}
                </span>
              </button>
              
              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSortMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-40">
                    {[
                      { value: 'newest', label: '最新发布', icon: Clock },
                      { value: 'price', label: '价格最高', icon: TrendingUp },
                      { value: 'popular', label: '最受欢迎', icon: Star },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${
                          sortBy === option.value ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 视图切换 */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        {currentOrders.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {currentOrders.map((order) => (
                <OrderCard 
                  key={order.order_id} 
                  order={order}
                  takeOrder={handleTakeOrder} 
                  viewMode={viewMode}
                  isVerfied = {isVerFied}
                />
              ))}
            </div>

            {/* 分页组件 */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
            <div className="relative inline-block">
              <Package className="w-20 h-20 text-orange-200 mx-auto mb-4" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">0</span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">暂无符合条件的订单</h3>
            <p className="text-gray-500 mb-6">试试其他搜索词，或稍后再来看看</p>
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
              >
                清除搜索
              </button>
            )}
          </div>
        )}

        {/* 返回顶部按钮 */}
        {currentOrders.length > 0 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all transform hover:scale-110 z-50"
          >
            <ChevronLeft className="w-5 h-5 rotate-90" />
          </button>
        )}
      </main>
    </div>
  );
}

export default PhotographerOrderSquare;