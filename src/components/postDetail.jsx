import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Eye, MessageCircle, Share2 } from 'lucide-react';

// 模拟图片数据
const MOCK_IMAGES = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1494790108777-466ef34e0a6f',
    display_order: 1
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    display_order: 2
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    display_order: 3
  },
  {
    id: '4',
    image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    display_order: 4
  }
];

export function PostDetail({ post, onClose, onLike }) {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 模拟已点赞的帖子ID（实际应用中应该从本地存储或后端获取）
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // 模拟加载图片
    const loadImages = async () => {
      setLoading(true);
      try {
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 根据帖子ID返回不同的模拟图片
        // 这里简单处理，实际应用中可以根据post.id返回不同的图片集
        setImages(MOCK_IMAGES);
        
        // 检查是否已点赞
        setIsLiked(likedPosts.includes(post.id));
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [post.id]);

  // 保存点赞状态到本地存储
  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  const handleLike = async () => {
    if (isLiked) return;

    try {
      // 模拟点赞请求延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 更新本地点赞状态
      setLikedPosts(prev => [...prev, post.id]);
      setIsLiked(true);
      
      // 调用父组件的onLike回调
      onLike(post.id);
      
      console.log('点赞成功:', post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (images.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (images.length || 1)) % (images.length || 1));
  };

  const author = post.photographers;
  const displayImages = images.length > 0 ? images : [{ image_url: post.cover_image_url }];

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex shadow-2xl">
        {/* Left side - Image carousel */}
        <div className="flex-1 bg-black relative flex flex-col justify-center">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="relative aspect-square flex items-center justify-center">
                <img
                  src={displayImages[currentImageIndex]?.image_url || post.cover_image_url}
                  alt="Post image"
                  className="w-full h-full object-contain"
                />
              </div>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 z-10 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 z-10 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>

                  {/* 图片指示器 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`transition-all ${
                          idx === currentImageIndex 
                            ? 'w-6 h-2 bg-white rounded-full' 
                            : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Right side - Post details */}
        <div className="w-96 bg-white flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
            <h2 className="text-lg font-bold text-gray-900 truncate flex-1">{post.title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Author info */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden shadow-md">
              {author?.avatar_url ? (
                <img 
                  src={author.avatar_url} 
                  alt={author.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">{author?.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{author?.name || '未知作者'}</h3>
              <p className="text-xs text-gray-500">摄影师</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105">
              关注
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            
            {/* 图片数量统计 */}
            {displayImages.length > 1 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 text-center">
                <span className="text-xs text-orange-600 font-medium">
                  共 {displayImages.length} 张图片 · 当前第 {currentImageIndex + 1} 张
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/50">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleLike}
                disabled={isLiked}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                  isLiked
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{post.likes_count}</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-medium">评论</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-medium">分享</span>
              </button>
              
              <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="text-xs font-medium">{post.views_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}