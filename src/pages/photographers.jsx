import React, { useRef, useState } from 'react';
import { 
  Search, 
  Star, 
  Camera, 
  Film, 
  Award, 
  ChevronRight,
  TrendingUp,
  Medal,
  Crown,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';
import { SmartTag } from '../components/tags';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/pagination';
import { useNavigation } from '../hooks/navigation';

// Mock数据 - 摄影师列表
const mockPhotographers = [
  {
    id: 'P001',
    nickname: '光影行者',
    avatar: 'https://images.unsplash.com/photo-1494790108777-9f8e60874d8f?w=150',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    rating: 4.9,
    completedOrders: 328,
    type: ['职业摄影师', '摄影工作室'],
    style: ['人像摄影', '商业摄影', '婚礼摄影'],
    equipment: ['索尼 A7M4', '佳能 R5'],
    location: '上海市',
    joinDate: '2023-01',
    featuredWorks: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
    ]
  },
  {
    id: 'P002',
    nickname: '时光记录者',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    rating: 4.8,
    completedOrders: 256,
    type: ['自由摄影师'],
    style: ['风光摄影', '纪实摄影'],
    equipment: ['尼康 Z9', '富士 X-T5'],
    location: '北京市',
    joinDate: '2023-03',
    featuredWorks: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      'https://images.unsplash.com/photo-1426604966841-d7cdacd1bebc?w=400'
    ]
  },
  {
    id: 'P003',
    nickname: '城市猎人',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    rating: 5.0,
    completedOrders: 189,
    type: ['街拍摄影师'],
    style: ['街拍摄影', '纪实摄影'],
    equipment: ['徕卡 M11', '富士 X100V'],
    location: '广州市',
    joinDate: '2023-06',
    featuredWorks: [
      'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400'
    ]
  },
  {
    id: 'P004',
    nickname: '婚礼诗人',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    rating: 4.9,
    completedOrders: 412,
    type: ['婚礼摄影师'],
    style: ['婚礼摄影', '人像摄影'],
    equipment: ['佳能 R5', '索尼 A7M4'],
    location: '杭州市',
    joinDate: '2022-08',
    featuredWorks: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400'
    ]
  },
  {
    id: 'P005',
    nickname: '山川影者',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    coverImage: 'https://images.unsplash.com/photo-1682686580391-6f5b9c5b8b5a?w=800',
    rating: 4.7,
    completedOrders: 156,
    type: ['风光摄影师'],
    style: ['风光摄影', '航拍摄影'],
    equipment: ['大疆 Mavic 3', '索尼 A7R5'],
    location: '成都市',
    joinDate: '2023-09',
    featuredWorks: [
      'https://images.unsplash.com/photo-1682686580186-b55d2a91053c?w=400',
      'https://images.unsplash.com/photo-1682686581484-a220ece3f4b4?w=400',
      'https://images.unsplash.com/photo-1682686581484-a220ece3f4b4?w=400'
    ]
  },
  {
    id: 'P006',
    nickname: '商业视界',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    rating: 4.8,
    completedOrders: 298,
    type: ['商业摄影师'],
    style: ['商业摄影', '产品摄影'],
    equipment: ['哈苏 X1D II', '佳能 R5'],
    location: '深圳市',
    joinDate: '2022-11',
    featuredWorks: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400'
    ]
  }
];

// 排行榜数据
const rankingData = {
  byOrders: [...mockPhotographers].sort((a, b) => b.completedOrders - a.completedOrders),
  byRating: [...mockPhotographers].sort((a, b) => b.rating - a.rating)
}

// 轮播图组件
function PhotographerCarousel({ photographers }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl">
      {/* 背景轮播 */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          display: 'flex',
          width: `${photographers.length * 100}%`
        }}
      >
        {photographers.map((photographer, idx) => (
          <div
            key={photographer.id}
            className="relative w-full h-full flex-shrink-0"
            style={{ width: `${100 / photographers.length}%` }}
          >
            <img
              src={photographer.coverImage}
              alt={photographer.nickname}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* 摄影师信息浮层 */}
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={photographer.avatar}
                  alt={photographer.nickname}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold">{photographer.nickname}</h3>
                  <p className="text-white/90">ID: {photographer.id}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{photographer.rating}</span>
                    <span className="text-white/70 ml-2">· {photographer.completedOrders}单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 轮播指示器 */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {photographers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 摄影师卡片组件
function PhotographerCard({ photographer }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex gap-4">
        {/* 头像 */}
        <img
          src={photographer.avatar}
          alt={photographer.nickname}
          className="w-20 h-20 rounded-full object-cover border-2 border-orange-200"
        />
        
        {/* 信息 */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{photographer.nickname}</h4>
              <p className="text-xs text-gray-500">ID: {photographer.id}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{photographer.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{photographer.completedOrders}单</p>
            </div>
          </div>

          {/* 标签区域 */}
          <div className="mt-2 space-y-1">
            <div className="flex flex-wrap gap-1">
              {photographer.type.map((type, idx) => (
                <SmartTag
                key={idx}
                tag={type}
                ></SmartTag>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {photographer.style.map((style, idx) => (
                <SmartTag
                key={idx}
                tag={style}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {photographer.equipment.map((eq, idx) => (
                <SmartTag
                key={idx}
                tag={eq}
                />
              ))}
            </div>
          </div>

          {/* 地点和加入时间 */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {photographer.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              加入于 {photographer.joinDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 排行榜组件
function RankingSidebar({ rankingByOrders, rankingByRating }) {
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
        {currentRanking.slice(0, 8).map((photographer, index) => (
          <div
            key={photographer.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
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
              src={photographer.avatar}
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
              <p className="text-xs text-gray-500 truncate">ID: {photographer.id}</p>
            </div>

            {/* 数据 */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold">
                {activeTab === 'orders' ? (
                  <>
                    <Camera className="w-3 h-3 text-gray-400" />
                    {photographer.completedOrders}
                  </>
                ) : (
                  <>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {photographer.rating}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 查看更多 */}
      <button className="w-full mt-4 py-2 text-sm text-orange-500 hover:text-orange-600 flex items-center justify-center gap-1">
        查看更多
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// 主页面组件
export default function PhotographersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null)
  const [isFocused,setIsFocused] = useState(false)
  const [searchHistory,setSearchHistory] = useState('')

  const {
    paginatedData,
    total,
    totalPages,
    currentPage,
    setCurrentPage
  } = usePagination({
    data:mockPhotographers,
    initialPage:1,
    itemsPerPage:5
  })
  const {goto} = useNavigation()

  const removeHistoryItem = () => {

  }

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false)

  return (
    <div className="min-h-screen bg-gray-50 pt-5">
        <div className='justify-between'>
            <ChevronLeft onClick={()=>goto('/')} className=' ml-5 h-10 w-10'></ChevronLeft>
        </div>
      {/* 搜索栏 */}
      <div className="max-w-5xl mx-auto py-5 relative z-20" ref={searchRef}>
                        <div className={`relative bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                            isFocused ? 'rounded-t-2xl shadow-xl' : 'rounded-2xl hover:shadow-xl'
                        }`}>
                            <div className="flex items-center px-4 py-3">
                                <Search className="w-5 h-5 text-orange-400 mr-3" />
                                <input 
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                                    placeholder="查找摄影师、作品或灵感..."
                                />
                            </div>
                            
                            {/* 搜索历史下拉框 */}
                            <div className={`absolute bg-white/95 backdrop-blur-sm rounded-b-2xl w-full top-full shadow-xl transition-all duration-300 overflow-hidden z-50 ${
                                isFocused ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                                <div className="p-4 border-t border-orange-100">
                                    <div className="flex justify-between items-center mb-3 px-2">
                                        <span className="text-sm font-medium text-orange-600">最近搜索</span>
                                        {searchHistory.length > 0 && (
                                            <button 
                                                onClick={() => setSearchHistory([])}
                                                className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
                                            >
                                                清除全部
                                            </button>
                                        )}
                                    </div>
                                    {searchHistory.length > 0 ? (
                                        <div className="space-y-1">
                                            {searchHistory.map((history) => (
                                                <div 
                                                    key={history} 
                                                    className="flex justify-between items-center px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors group cursor-pointer"
                                                    onClick={() => console.log('搜索:', history)}
                                                >
                                                    <span className="text-gray-600 text-sm">{history}</span>
                                                    <button 
                                                        onClick={(e) => removeHistoryItem(history, e)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-orange-200 rounded-full"
                                                    >
                                                        <X className="w-3.5 h-3.5 text-gray-400 hover:text-orange-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-400 text-sm">
                                            暂无搜索历史
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 轮播图 */}
        <PhotographerCarousel photographers={mockPhotographers.slice(0, 4)} />

        {/* 内容网格 */}
        <div className="flex gap-6 mt-8">
          {/* 摄影师列表 */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              推荐摄影师 ({total})
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {total > 0 ? (
                paginatedData.map(photographer => (
                    <PhotographerCard key={photographer.id} photographer={photographer} />
                ))
                ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">暂无匹配的摄影师</p>
                </div>
                )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* 排行榜侧边栏 */}
          <div className="w-80 flex-shrink-0">
            <RankingSidebar 
              rankingByOrders={rankingData.byOrders}
              rankingByRating={rankingData.byRating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}