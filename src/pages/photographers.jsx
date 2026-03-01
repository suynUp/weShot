import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Camera, 
  TrendingUp,
  Medal,
  Crown,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SmartTag } from '../components/tags';
import { Pagination } from '../components/pagination';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import photographerStore from '../store/photographerStore';
import SearchInput from '../components/searchInput';
import { 
  useGetPhgList, 
  useGetSuggestions, 
  useGetHistory,
  useGetOrderRanking,
  useGetRatingRanking 
} from '../hooks/usePhotographer';
import { toast } from '../hooks/useToast';
function PhotographerCarousel({ photographers }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photographers || photographers.length === 0) {
    return null;
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl group">
      {/* 轮播容器 */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {photographers.map((photographer, idx) => (
          <div
            key={photographer.cas_id || idx}
            className="relative w-full h-full flex-shrink-0"
            style={{ minWidth: '100%' }}
          >
            {/* 背景图片 */}
            <img
              src={photographer.coverImage || photographer.avatar_url}
              alt={photographer.nickname}
              className="w-full h-full object-cover"
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* 摄影师信息 */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <div className="flex items-center gap-4">
                <img
                  src={photographer.avatar_url}
                  alt={photographer.nickname}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold">{photographer.nickname}</h3>
                  <p className="text-white/90">ID: {photographer.cas_id}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{photographer.avgScore?.toFixed(1) || '5.0'}</span>
                    <span className="text-white/70 ml-2">· {photographer.orderCount || 0}单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 左侧箭头 */}
      <button
        onClick={() => goToSlide(currentIndex - 1)}
        disabled={currentIndex === 0}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all z-20 ${
          currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* 右侧箭头 */}
      <button
        onClick={() => goToSlide(currentIndex + 1)}
        disabled={currentIndex === photographers.length - 1}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all z-20 ${
          currentIndex === photographers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 轮播指示器 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {photographers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer hover:scale-125 ${
              idx === currentIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
// 摄影师卡片组件
function PhotographerCard({ photographer, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex gap-4">
        {/* 头像 */}
        <img
          src={photographer.avatar_url}
          alt={photographer.nickname}
          className="w-20 h-20 rounded-full object-cover border-2 border-orange-200"
        />
        
        {/* 信息 */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{photographer.nickname}</h4>
              <p className="text-xs text-gray-500">ID: {photographer.cas_id}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{photographer.avgScore?.toFixed(1) || '5.0'}</span>
              </div>
              <p className="text-xs text-gray-500">{photographer.orderCount || 0}单</p>
            </div>
          </div>

          {/* 标签区域 */}
          <div className="mt-2 flex flex-wrap gap-1">
            <div>
              {photographer.type && (photographer.type.map((t, idx) => 
                <SmartTag key={idx} tag={t} />
              ))}
            </div>
            <div>
              {photographer.style && (photographer.style.map((s, idx) => 
                 <SmartTag key={idx} tag={s} />
              ))}
            </div>
            <div>
              {photographer.equipment && (photographer.equipment.map((e, idx) => 
                 <SmartTag key={idx} tag={e} />
              ))}
            </div>
          </div>

          {/* 地点和加入时间 - 如果没有对应字段，暂时隐藏 */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {photographer.location || '未知'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              加入于 {photographer.joinDate || '2024-01'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 排行榜组件
function RankingSidebar({ rankingByOrders, rankingByRating, onClick }) {
  const [activeTab, setActiveTab] = useState('orders');

  const getRankingIcon = (index) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getAvatarSize = (index) => {
    if (index === 0) return 'w-12 h-12';
    if (index === 1) return 'w-10 h-10';
    if (index === 2) return 'w-9 h-9';
    return 'w-8 h-8';
  };

  const currentRanking = activeTab === 'orders' ? rankingByOrders : rankingByRating;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        摄影师排行榜
      </h3>

      {/* 标签切换 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          单量排行
        </button>
        <button
          onClick={() => setActiveTab('rating')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'rating'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          评分排行
        </button>
      </div>

      {/* 排行榜列表 */}
      <div className="space-y-3">
        {(currentRanking || []).slice(0, 8).map((photographer, index) => (
          <div
            onClick={()=>onClick(photographer)}
            key={photographer.cas_id}
            className="cursor-pointer flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* 排名 */}
            <div className="w-6 text-center font-bold text-gray-400">
              {index < 3 ? (
                getRankingIcon(index)
              ) : (
                <span className="text-sm">#{index + 1}</span>
              )}
            </div>

            {/* 头像 */}
            <img
              src={photographer.avatar_url}
              alt={photographer.nickname}
              className={`${getAvatarSize(index)} rounded-full object-cover border-2 ${
                index === 0 ? 'border-yellow-400' : 
                index === 1 ? 'border-gray-400' : 
                index === 2 ? 'border-amber-600' : 'border-gray-200'
              }`}
            />

            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{photographer.nickname}</p>
              <p className="text-xs text-gray-500 truncate">ID: {photographer.cas_id}</p>
            </div>

            {/* 数据 */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold">
                {activeTab === 'orders' ? (
                  <>
                    <Camera className="w-3 h-3 text-gray-400" />
                    {photographer.orderCount || photographer.order_count || 0}
                  </>
                ) : (
                  <>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {photographer.avgScore?.toFixed(1) || '5.0'}
                    {photographer.ratingCount && (
                      <span className="text-xs text-gray-400 ml-1">({photographer.ratingCount})</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 主页面组件
export default function PhotographersPage() {
  const { goto } = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const [changed,setChange] = useState(true)

  // 从store获取状态
  const { 
    phgList, 
    phgTotal, 
    phgSuggestions, 
    phgSearchHistory,
    phgOrderRanking,
    phgRatingRanking,
    removePhgSearchHistory 
  } = photographerStore();
  
  // 获取hooks
  const getPhgList = useGetPhgList();
  const getSuggestions = useGetSuggestions();
  const getHistory = useGetHistory();
  const getOrderRanking = useGetOrderRanking();
  const getRatingRanking = useGetRatingRanking();

  // 获取摄影师列表的函数
  const fetchPhotographers = async (pageNum, pageSize) => {
    return await getPhgList.mutateAsync({
      pageNum,
      pageSize,
      keyword:searchValue
    });
  };

  // 使用分页hook
  const {
    currentPage,
    totalPages,
    loading: paginationLoading,
    setCurrentPage
  } = usePagination({
    itemsPerPage: 12,
    fetchData: fetchPhotographers,
    initialPage: 1,
    total: phgTotal,
    dependencies:[changed]
  });

  // 初始化数据
  useEffect(() => {
    try {
    Promise.all([
      getHistory.mutateAsync(),
      getOrderRanking.mutateAsync(5),
      getRatingRanking.mutateAsync(5)
    ]);
    } catch (E) {
      toast.error(E.message );
    }
  }, []);

  // 搜索建议
  useEffect(() => {
    if (searchValue.trim()) {
      const debounceTimer = setTimeout(() => {
        getSuggestions.mutate(searchValue);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchValue]);

  // 处理搜索
  const handleSearch = async (pageNum,pageSize) => {
      setChange(!changed)
      setCurrentPage(1);
      getHistory.mutate()
      await fetchPhotographers(pageNum, pageSize ,searchValue);
  };

  // 处理清空所有历史记录
  const handleClearAllHistory = () => {
    photographerStore.getState().setPhgSearchHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-5">
      <div className='flex items-center mb-4'>
        <ChevronLeft 
          onClick={() => goto('/')} 
          className='ml-5 h-10 w-10 cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors'
        />
        <h1 className="text-2xl font-bold text-gray-800 ml-2">摄影师社区</h1>
      </div>

      {/* 使用SearchInput组件替换原有的搜索栏 */}
      <SearchInput
        searchHistory={phgSearchHistory}
        suggest={phgSuggestions}
        searchFn={handleSearch}
        clearAll={handleClearAllHistory}
        deleteOne={removePhgSearchHistory}
        placeholder="查找摄影师吧..."
        value={searchValue}
        setValue={setSearchValue}
        initialPageNum={1}
        initialPageSize={12}
      />

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 轮播图 - 使用排行榜数据 */}
        <PhotographerCarousel photographers={phgOrderRanking?.slice(0, 4)} />

        {/* 内容网格 */}
        <div className="flex gap-6 mt-8">
          {/* 摄影师列表 */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              推荐摄影师 ({phgTotal})
            </h2>
            
            {paginationLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {phgList && phgList.length > 0 ? (
                    phgList.map(photographer => (
                      <PhotographerCard onClick={()=>goto(`/profile?casId=${photographer.cas_id}`)} key={photographer.cas_id} photographer={photographer} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-white rounded-xl">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">暂无匹配的摄影师</p>
                    </div>
                  )}
                </div>
                
                {/* 分页组件 */}
                {phgTotal > 12 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>

          {/* 排行榜侧边栏 */}
          <div className="w-80 flex-shrink-0">
            <RankingSidebar 
              rankingByOrders={phgOrderRanking}
              rankingByRating={phgRatingRanking}
              onClick={(photographer)=>goto(`/profile?casId=${photographer.cas_id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}