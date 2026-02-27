import { useEffect, useState } from 'react';
import { ChevronLeft, Camera, Image as ImageIcon } from 'lucide-react';
import PhotoCard from '../components/photoCard';
import SearchInput from '../components/searchInput';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/pagination';
import postStore from '../store/postStore';
import { useGetPost, useSearchSuggestWithDebounce } from '../hooks/usePost';
import { PostDetail } from '../components/postDetail';
import { toast } from '../hooks/useToast';

export function Feed() {
  const { goto } = useNavigation();
  
  const { 
    history, 
    suggestions, 
    postList,
    totalposts,
    currentPost
  } = postStore();

  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { getAllPost, getPostDetail } = useGetPost();
  const useSearchSuggest = useSearchSuggestWithDebounce();
  
  const getPosts = async (pageNum, pageSize) => {
    try {
      const res = await getAllPost(null, pageNum, pageSize, searchValue);
      return res;
    } catch (E) {
      toast.error(E.message || '获取帖子列表失败');
    }
  };

  const {
    currentPage,
    totalPages,
    loading: paginationLoading,
    setCurrentPage,
  } = usePagination({
    itemsPerPage: 12,
    fetchData: getPosts,
    initialPage: 1,
    total: totalposts,
  });

  useEffect(() => {
    useSearchSuggest.mutate(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (selectedPostId) {
      getPostDetail(selectedPostId);
    }
  }, [selectedPostId]);

  const isEmpty = !paginationLoading && (!postList || postList.length === 0);

  const handleCardClick = (postId) => {
    setSelectedPostId(postId);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-emerald-50/30">
      {/* 装饰性背景元素 - 降低z-index确保不干扰交互 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => goto('/')}
              className="group p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              aria-label="返回首页"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-emerald-700 bg-clip-text text-transparent">
              灵感画廊 · 社区
            </h1>
          </div>
          <div
            onClick={() => goto('/postpublish')}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-orange-500 border flex items-center gap-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>分享瞬间</span>
          </div>
        </div>

        {/* 搜索组件 - 使用较高的z-index确保下拉框浮在卡片上方 */}
        <div 
          className="relative z-30 mb-10"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        >
          <SearchInput
            searchHistory={history}
            suggest={suggestions}
            searchFn={getPosts}
            placeholder="搜索摄影师或作品..."
            value={searchValue}
            setValue={setSearchValue}
            initialPageSize={12}
          />
        </div>

        {/* 作品网格区域 - 使用较低的z-index */}
        <div className={`relative transition-opacity duration-300 ${isSearchFocused ? 'opacity-40' : 'opacity-100'}`}>
          {paginationLoading ? (
            // 加载状态...
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/50 rounded-3xl overflow-hidden shadow-md">
                    <div className="aspect-[4/5] bg-gray-200/60" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200/80 rounded-full w-3/4" />
                      <div className="h-3 bg-gray-200/60 rounded-full w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200/70 rounded-full" />
                        <div className="h-8 w-8 bg-gray-200/70 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            // 空状态...
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-full p-6 mb-6 shadow-lg">
                <ImageIcon className="w-16 h-16 text-amber-400/70" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">还没有作品</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                试试其他关键词，或者上传你的第一张摄影作品，与社区分享灵感
              </p>
              <button 
                onClick={() => goto('/postpublish')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                立即上传作品
              </button>
            </div>
          ) : (
            <>
              {/* 作品网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
                {postList.map((photo, index) => (
                  <div
                    key={photo.post_id}
                    className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <PhotoCard photo={photo} onSelect={handleCardClick}/>
                  </div>
                ))}
              </div>

              {/* 分页组件 */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-2">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}

              {/* 统计信息 */}
              <div className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>共 {postList.length} 个作品</span>
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                <span>第 {currentPage} / {totalPages} 页</span>
              </div>
            </>
          )}
        </div>
        {showDetails && (
          <PostDetail
            listItem={currentPost}
            onClose={() => setShowDetails(false)}
          />
        )}
      </div>

      {/* 添加全局样式 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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

export default Feed;