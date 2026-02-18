import { useEffect, useState } from 'react';
import { PostCard } from '../components/postCard';
import { PostDetail } from '../components/postDetail';
import { Camera, Sparkles, ArrowLeft } from 'lucide-react';

// 模拟数据
const MOCK_POSTS = [
  {
    id: '1',
    title: '春日人像摄影精选',
    content: '分享一组最近拍摄的春日人像作品，阳光正好，微风不燥。',
    cover_image_url: 'https://images.unsplash.com/photo-1494790108777-466ef34e0a6f',
    likes_count: 128,
    views_count: 1240,
    created_at: '2024-02-15T10:00:00Z',
    photographers: {
      id: '101',
      name: '王小明',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      bio: '资深人像摄影师'
    }
  },
  {
    id: '2',
    title: '城市夜景拍摄技巧',
    content: '分享一些城市夜景拍摄的心得，包括参数设置和构图技巧。',
    cover_image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    likes_count: 89,
    views_count: 856,
    created_at: '2024-02-14T15:30:00Z',
    photographers: {
      id: '102',
      name: '李小华',
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      bio: '城市风光摄影师'
    }
  },
  {
    id: '3',
    title: '毕业季拍摄指南',
    content: '又到一年毕业季，分享一些毕业照拍摄的小技巧和注意事项。',
    cover_image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    likes_count: 256,
    views_count: 2100,
    created_at: '2024-02-13T09:15:00Z',
    photographers: {
      id: '103',
      name: '张小雅',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      bio: '纪实摄影师'
    }
  },
  {
    id: '4',
    title: '美食摄影布光技巧',
    content: '学会这些布光技巧，让你的美食照片看起来更诱人。',
    cover_image_url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    likes_count: 67,
    views_count: 543,
    created_at: '2024-02-12T14:20:00Z',
    photographers: {
      id: '104',
      name: '陈大厨',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      bio: '美食摄影师'
    }
  },
  {
    id: '5',
    title: '风光摄影必备滤镜',
    content: '摄影师常用的几种滤镜及其使用场景介绍。',
    cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    likes_count: 192,
    views_count: 1560,
    created_at: '2024-02-11T11:45:00Z',
    photographers: {
      id: '105',
      name: '赵山河',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      bio: '风光摄影师'
    }
  },
  {
    id: '6',
    title: '宠物摄影抓拍技巧',
    content: '如何拍出活泼可爱的宠物照片，分享一些抓拍心得。',
    cover_image_url: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b',
    likes_count: 145,
    views_count: 987,
    created_at: '2024-02-10T16:30:00Z',
    photographers: {
      id: '106',
      name: '周小萌',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      bio: '宠物摄影师'
    }
  }
];

export function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(MOCK_POSTS);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePostLike = (postId) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
      )
    );
  };

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
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-orange-100 text-gray-600 hover:text-orange-500 hover:border-orange-200 transition-all duration-300 group"
                aria-label="返回"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">返回</span>
              </button>
              <div>
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
        {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                {posts.map((post, index) => (
                <div
                    key={post.id}
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
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handlePostLike}
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