import { useEffect, useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Eye, MessageCircle, Share2 } from 'lucide-react';

export function PostDetail({ post, onClose, onLike, onDislike }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 使用useMemo处理图片数据，避免不必要的重计算
  const images = useMemo(() => {
    if (!post) return [];
    
    const imageList = post.images || post.data?.images || [];
    return imageList.map((url, index) => ({
      id: `${post.post_id || post.id}-${index}`,
      image_url: url,
      display_order: index + 1
    }));
  }, [post]);

  // 使用useMemo处理作者信息
  const author = useMemo(() => {
    if (!post) return { name: '未知作者', avatar_url: null, user_id: null };
    
    // 如果post直接包含作者信息
    if (post.nickname || post.user_id) {
      return {
        name: post.nickname || '未知作者',
        avatar_url: post.avatar_url,
        user_id: post.user_id
      };
    }
    // 如果作者信息在data字段中
    else if (post.data?.nickname || post.data?.user_id) {
      return {
        name: post.data.nickname || '未知作者',
        avatar_url: post.data.avatar_url,
        user_id: post.data.user_id
      };
    }
    // 默认值
    return {
      name: '未知作者',
      avatar_url: null,
      user_id: null
    };
  }, [post]);

  // 使用useMemo处理其他派生数据
  const metadata = useMemo(() => {
    if (!post) return { title: '无标题', content: '暂无描述', createdAt: '', type: '其他作品' };
    
    const title = post.title || post.data?.title || '无标题';
    const content = post.content || post.data?.content || '暂无描述';
    const type = (post.type || post.data?.type) === '1' ? '摄影作品' : '其他作品';
    
    const dateStr = post.created_at || post.data?.created_at;
    const createdAt = dateStr 
      ? new Date(dateStr).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';
    
    return { title, content, createdAt, type };
  }, [post]);

  // 分离加载状态的effect
  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // 只在组件挂载时执行一次

  // 分离点赞状态的effect
  useEffect(() => {
    if (post) {
      // 使用微任务避免同步状态更新
      queueMicrotask(() => {
        setIsLiked(post.isLiked === 1 || post.data?.isLiked === 1);
        setLikeCount(post.totalLikes || post.data?.totalLikes || 0);
      });
    }
  }, [post]);

  const handleLike = async () => {
    if (isLiked) return;

    try {
      // 乐观更新UI
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      
      // 调用点赞API
      if (onLike) {
        await onLike(post.post_id || post.id);
      }
      
      console.log('点赞成功:', post.post_id || post.id);
    } catch (error) {
      // 失败回滚
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async () => {
    if (!isLiked) return;

    try {
      // 乐观更新UI
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      
      // 调用取消点赞API
      if (onDislike) {
        await onDislike(post.post_id || post.id);
      }
      
      console.log('取消点赞成功:', post.post_id || post.id);
    } catch (error) {
      // 失败回滚
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      console.error('Error disliking post:', error);
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

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
                {images.length > 0 ? (
                  <img
                    key={images[currentImageIndex]?.id} // 添加key强制重新渲染
                    src={images[currentImageIndex]?.image_url}
                    alt={`作品图片 ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-white/50 text-center">
                    暂无图片
                  </div>
                )}
              </div>

              {images.length > 1 && (
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
                    {images.map((_, idx) => (
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
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 truncate">{metadata.title}</h2>
              <p className="text-xs text-gray-400 mt-1">{metadata.createdAt} · {metadata.type}</p>
            </div>
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
              {author.avatar_url ? (
                <img 
                  src={author.avatar_url} 
                  alt={author.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = author.name.charAt(0);
                  }}
                />
              ) : (
                <span className="text-lg">{author.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className='flex'>
                <h3 className="text-start font-semibold text-gray-900 truncate">{author.name}</h3>
                {post.role && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full text-xs">
                    认证摄影师
                  </span>
                )}
              </div>
              <p className="text-start text-xs text-gray-500">摄影师 · ID: {author.user_id}</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105">
              关注
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div>
              <p className="text-start mb-2">
                简介：
              </p>
              <p className="text-start text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {metadata.content}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/50">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={isLiked ? handleDislike : handleLike}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                  isLiked
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{likeCount}</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-medium">评论</span>
              </button>
              
              <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="text-xs font-medium">{post?.views_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}