import { useEffect, useState } from 'react';
import { PostCard } from '../components/postCard';
import { PostDetail } from '../components/postDetail';
import { Camera, Sparkles, ArrowLeft } from 'lucide-react';
import SearchInput from '../components/searchInput';
import { squarePostConfig, useGetPost, usePostAction, useSearch, useSearchHistory, useSearchSuggestWithDebounce } from '../hooks/usePost';
import postStore from '../store/postStore';

// 模拟数据
const MOCK_POSTS = [
  {
    images: "https://images.unsplash.com/photo-1453227588063-bb302b62f50b",
    role: false,
    post_id: 6,
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    user_id: 202300106,
    nickname: "周小萌",
    created_at: "2024-02-10T16:30:00Z",
    type: 1,
    title: "宠物摄影抓拍技巧",
    content: "如何拍出活泼可爱的宠物照片，分享一些抓拍心得。",
    status: 1
  }
];
export function Feed() {
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const [inputValue, setInputValue] = useState('')

  const searchHistory = postStore(state=>state.history)
  const postList = postStore(state => state.postList)
  const searchResults = postStore(state=>state.searchResults)

  const currentPost = postStore(state=>state.currentPost)

  //获取历史
  const searchHistoryMutation = useSearchHistory()

  //搜索，传入keyword
  const searchMutation = useSearch()

  //获取所有
  const {getAllPost} = useGetPost()

  const {
    fetchDebouncedSuggest,
    suggestions
  } = useSearchSuggestWithDebounce()

  const {
    like,
    dislike,
    comment,
    getComments
  } = usePostAction()

  useEffect(()=>{
    fetchDebouncedSuggest(inputValue) 
    //将自动setSuggestions
  },[inputValue,fetchDebouncedSuggest])

  useEffect(() => {
    getAllPost(null,squarePostConfig.pageNum,squarePostConfig.pageSize) //所有获取列表
    searchHistoryMutation.mutate() //获取历史
  }, []);

  const handlePostLike = (postId) => {
    like(postId)
  };

  const handlePostdisLike = (postId) => {
    dislike(postId)
  }

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
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

        <SearchInput
        searchHistory={searchHistory}
        suggest={suggestions}
        searchFn={searchMutation}
        value={inputValue}
        setValue={setInputValue}
        />

        {/* 帖子网格 */}
        {postList.length > 0 ? (
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
            ) : (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
                <Camera className="w-12 h-12 text-orange-400" />
                </div>
                <p className="text-xl text-gray-500">暂无作品</p>
                <p className="text-gray-400 mt-2">敬请期待摄影师们的精彩作品</p>
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