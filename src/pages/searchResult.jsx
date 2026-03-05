// pages/SearchResults.jsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, Camera, Image as ImageIcon, Users, Search } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';
import { useGetPost } from '../hooks/usePost';
import { useGetPhgList } from '../hooks/usePhotographer';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/pagination';
import { PostDetail } from '../components/postDetail';
import PhotoCard from '../components/photoCard';
import { PhotographerCard } from './photographers';
import postStore from '../store/postStore';
import photographerStore from '../store/photographerStore';

export default function SearchResults() {
  const { goto } = useNavigation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [loadingPostDetail, setLoadingPostDetail] = useState(false); // 新增加载状态

  // 从store获取数据
  const { postList, totalposts, currentPost } = postStore();
  const { phgList, phgTotal } = photographerStore();

  // API hooks
  const { getAllPost, getPostDetail } = useGetPost();
  const getPhgList = useGetPhgList();

  // 获取帖子列表
  const fetchPosts = async (pageNum, pageSize) => {
    return await getAllPost(null, pageNum, pageSize, keyword);
  };

  // 获取摄影师列表
  const fetchPhotographers = async (pageNum, pageSize) => {
    return await getPhgList.mutateAsync({
      pageNum,
      pageSize,
      keyword
    });
  };

  // 帖子分页
  const {
    currentPage: postPage,
    totalPages: postTotalPages,
    loading: postLoading,
    setCurrentPage: setPostPage
  } = usePagination({
    itemsPerPage: 12,
    fetchData: fetchPosts,
    initialPage: 1,
    total: totalposts,
    dependencies: [keyword]
  });

  // 摄影师分页
  const {
    currentPage: phgPage,
    totalPages: phgTotalPages,
    loading: phgLoading,
    setCurrentPage: setPhgPage
  } = usePagination({
    itemsPerPage: 12,
    fetchData: fetchPhotographers,
    initialPage: 1,
    total: phgTotal,
    dependencies: [keyword]
  });

  // 获取帖子详情
  const handlePostClick = async (postId) => {
    setLoadingPostDetail(true);
    try {
      await getPostDetail(postId);
      setShowPostDetail(true);
    } catch (error) {
      console.error('Failed to fetch post detail:', error);
    } finally {
      setLoadingPostDetail(false);
    }
  };

  const handlePhotographerClick = (casId) => {
    goto(`/profile?casId=${casId}`);
  };

  const handleCloseDetail = () => {
    setShowPostDetail(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-emerald-50/30">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => goto('/')}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-500">
              <Search className="w-5 h-5" />
              <span>搜索关键词：</span>
              <span className="font-semibold text-orange-600">"{keyword}"</span>
            </div>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="flex gap-1 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            作品 ({totalposts})
          </button>
          <button
            onClick={() => setActiveTab('photographers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'photographers'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Users className="w-4 h-4" />
            摄影师 ({phgTotal})
          </button>
        </div>

        {/* 搜索结果 */}
        <div className="mt-6">
          {/* 帖子列表 */}
          {activeTab === 'posts' && (
            <div>
              {postLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg aspect-[4/5]">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    </div>
                  ))}
                </div>
              ) : postList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {postList.map((photo, index) => (
                      <div
                        key={photo.post_id}
                        className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                        style={{
                          animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <PhotoCard photo={photo} onSelect={handlePostClick} />
                      </div>
                    ))}
                  </div>
                  {postTotalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-2">
                        <Pagination
                          currentPage={postPage}
                          totalPages={postTotalPages}
                          onPageChange={setPostPage}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">没有找到相关的作品</p>
                  <p className="text-sm text-gray-400 mt-2">试试其他关键词</p>
                </div>
              )}
            </div>
          )}

          {/* 摄影师列表 */}
          {activeTab === 'photographers' && (
            <div>
              {phgLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 animate-pulse">
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
              ) : phgList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phgList.map((photographer, index) => (
                      <div
                        key={photographer.cas_id}
                        style={{
                          animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <PhotographerCard
                          photographer={photographer}
                          onClick={() => handlePhotographerClick(photographer.cas_id)}
                        />
                      </div>
                    ))}
                  </div>
                  {phgTotalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={phgPage}
                        totalPages={phgTotalPages}
                        onPageChange={setPhgPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">没有找到相关的摄影师</p>
                  <p className="text-sm text-gray-400 mt-2">试试其他关键词</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 帖子详情弹窗 */}
        {showPostDetail && currentPost && (
          <PostDetail
            listItem={currentPost}
            onClose={handleCloseDetail}
          />
        )}

        {/* 加载中遮罩 */}
        {loadingPostDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">加载中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 添加动画样式 */}
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