import { useEffect, useState } from 'react';
import { PostCard } from '../components/postCard';
import { PostDetail } from '../components/postDetail';
import { Camera, Sparkles, ArrowLeft } from 'lucide-react';
import SearchInput from '../components/searchInput';
import { Pagination } from '../components/pagination'; // 导入分页组件
import { useGetPost, usePostAction, useSearchHistory, useSearchSuggestWithDebounce } from '../hooks/usePost';
import postStore from '../store/postStore';
import { usePagination } from '../hooks/usePagination';

function Gallery() {
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const searchHistory = postStore(state => state.history);
  const postList = postStore(state => state.postList);
  const postTotal = postStore(state => state.totalposts);
  const currentPost = postStore(state => state.currentPost);

  // 获取历史
  const searchHistoryMutation = useSearchHistory()

  // 获取所有帖子
  const { getAllPost } = useGetPost();

  const {
    fetchDebouncedSuggest,
    suggestions
  } = useSearchSuggestWithDebounce();

  const {
    like,
    dislike,
    comment,
    getComments
  } = usePostAction();

  // 使用分页 hook
  const {
    currentPage,
    totalPages,
    loading: paginationLoading,
    setCurrentPage
  } = usePagination({
    fetchData: async (page, size) => {
      const result = await getAllPost(null, page, size, inputValue);
      return result; // 确保返回结果以便分页组件获取总数
    },
    itemsPerPage: 12,
    initialPage: 1,
    dependencies: [inputValue], // 添加依赖，当搜索词变化时重新加载
    total: postTotal, // 传入外部的 total
  });

  // 获取历史记录
  useEffect(() => {
    searchHistoryMutation.mutate();
  }, []);

  // 处理搜索
  const handleSearch = async (keyword) => {
    setInputValue(keyword);
    // 分页 hook 会自动处理搜索，因为 dependencies 包含 inputValue
    // 并且会自动重置到第一页
  };

  // 处理建议搜索
  useEffect(() => {
    fetchDebouncedSuggest(inputValue);
  }, [inputValue, fetchDebouncedSuggest]);

  // 处理点赞
  const handlePostLike = (postId) => {
    like(postId);
  };

  // 处理取消点赞
  const handlePostdisLike = (postId) => {
    dislike(postId);
  };

  // 返回上一页
  const handleGoBack = () => {
    window.history.back();
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 加载状态
  if (loading && paginationLoading) {
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
      {/* 装饰性背景元素 - 柔和风格 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-full blur-3xl" />
        {/* 装饰性相机图标 */}
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

        {/* 搜索组件 */}
        <SearchInput
          searchHistory={searchHistory}
          suggest={suggestions}
          searchFn={handleSearch}
          value={inputValue}
          setValue={setInputValue}
          placeholder="搜索作品、作者或标签..."
        />

        {/* 帖子网格 */}
        {postList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {postList.map((post, index) => (
                <div
                  key={post.post_id}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <PostCard
                    post={post}
                    onClick={() => setSelectedPost(post)}
                  />
                </div>
              ))}
            </div>

            {/* 使用 Pagination 组件替代原有的分页控件 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* 显示总条数（可选，因为 Pagination 组件没有包含总条数显示） */}
            {totalPages > 0 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                共 {postTotal || 0} 条作品
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
              <Camera className="w-12 h-12 text-orange-400" />
            </div>
            <p className="text-xl text-gray-500">暂无作品</p>
            <p className="text-gray-400 mt-2">
              {inputValue ? '没有找到相关作品，试试其他关键词' : '敬请期待摄影师们的精彩作品'}
            </p>
          </div>
        )}

        {/* 加载更多指示器 */}
        {paginationLoading && (
          <div className="fixed bottom-8 right-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">加载中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 帖子详情弹窗 */}
      {selectedPost && (
        <PostDetail
          post={currentPost}
          onClose={() => setSelectedPost(null)}
          onLike={handlePostLike}
          onDislike={handlePostdisLike}
        />
      )}

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