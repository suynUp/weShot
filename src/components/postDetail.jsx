import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Eye, MessageCircle, Send } from 'lucide-react';
import postStore from '../store/postStore';
import { useComment, useGetPostComments, usePostAction } from '../hooks/usePost';
import { usePagination } from '../hooks/usePagination';
import { UserStore } from '../store/userStore';
import { useToast } from '../hooks/useToast';

// 评论项组件
function CommentItem({ comment }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <img
        src={comment.avatar_url || '/default-avatar.png'}
        alt={comment.nickname}
        className="w-8 h-8 rounded-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/default-avatar.png';
        }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{comment.nickname}</span>
          <span className="text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleDateString('zh-CN', {
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <p className="text-left text-sm text-gray-700 break-words">{comment.content}</p>
      </div>
    </div>
  );
}

// 评论列表组件
function CommentList({ comments, hasMore, onLoadMore, loading }) {
  const observerRef = useRef();
  const lastCommentRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  if (comments.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        暂无评论，来说两句吧～
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          ref={index === comments.length - 1 ? lastCommentRef : null}
        >
          <CommentItem comment={comment} />
        </div>
      ))}
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
        </div>
      )}
      
      {!hasMore && comments.length > 0 && (
        <div className="text-center py-4 text-xs text-gray-400">
          没有更多评论了
        </div>
      )}
    </div>
  );
}

export function PostDetail({ listItem, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentInputRef = useRef(null);

  const [isLogin, setIsLogin] = useState(false);

  const { commentList, totalComments, clearComments } = postStore();
  const userInfo = UserStore(state => state.user);

  const { like, dislike } = usePostAction();
  const commentMutation = useComment();

  useEffect(() => {
    setIsLogin(userInfo?.casId ? true : false);
  }, [userInfo]);

  const toast = useToast();
  const getCommentsMutation = useGetPostComments();

  // 评论分页加载函数
  const fetchComments = async (pageNum, pageSize) => {
    if (!listItem?.post_id) return { list: [], total: 0 };
    await getCommentsMutation.mutateAsync({
      postId: listItem.post_id,
      pageNum,
      pageSize
    });
  };

  useEffect(() => {
    fetchComments(1, 10);
    return () => {
      clearComments();
    };
  }, [listItem?.post_id]);

  // 使用 usePagination 管理评论分页
  const {
    currentPage,
    totalPages,
    total,
    loading: commentsLoading,
    setCurrentPage,
  } = usePagination({
    itemsPerPage: 10,
    fetchData: fetchComments,
    dependencies: [listItem?.post_id],
    total: totalComments,
  });

  // 加载更多评论
  const loadMoreComments = () => {
    if (currentPage < totalPages && !commentsLoading) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 处理评论提交
  const handleSubmitComment = async () => {
    if (!isLogin) {
      toast.show('请先登录后再评论', 'warning');
      return;
    }

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      toast.show('评论内容不能为空', 'warning');
      return;
    }

    if (trimmedComment.length > 500) {
      toast.show('评论内容不能超过500个字符', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      await commentMutation.mutateAsync({
        postId: listItem.post_id,
        content: trimmedComment
      });

      setCommentText('');
      toast.show('评论发布成功', 'success');
      await fetchComments(1, 10);
    } catch (error) {
      console.error('评论发布失败:', error);
      toast.show(error?.message || '评论发布失败，请稍后重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  // 聚焦评论输入框
  const focusCommentInput = () => {
    if (!isLogin) {
      toast.show('请先登录后再评论', 'warning');
      return;
    }
    commentInputRef.current?.focus();
  };

  const postData = useMemo(() => listItem || {}, [listItem]);

  // 处理图片数据
  const images = useMemo(() => {
    if (!postData) return [];
    const imageList = postData.images || [];
    return imageList.map((url, index) => ({
      id: `${postData.post_id || postData.id}-${index}`,
      image_url: url,
      display_order: index + 1
    }));
  }, [postData]);

  // 处理作者信息
  const author = useMemo(() => {
    if (!postData) return { name: '未知作者', avatar_url: null, user_id: null };
    return {
      name: postData.nickname || '未知作者',
      avatar_url: postData.avatar_url,
      user_id: postData.user_id
    };
  }, [postData]);

  // 处理其他派生数据
  const metadata = useMemo(() => {
    if (!postData) return { title: '无标题', content: '暂无描述', createdAt: '', type: '其他作品' };
    const title = postData.title || '无标题';
    const content = postData.content || '暂无描述';
    const type = postData.type === '1' ? '摄影作品' : '其他作品';
    const createdAt = postData.created_at 
      ? new Date(postData.created_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';
    return { title, content, createdAt, type };
  }, [postData]);

  // 统计信息
  const stats = useMemo(() => {
    if (!postData) return { totalLikes: 0, viewsCount: 0 };
    return {
      totalLikes: postData.totalLikes || 0,
      viewsCount: 0
    };
  }, [postData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (postData) {
      setIsLiked(postData.isLiked === 1);
      setLikeCount(postData.totalLikes || 0);
    }
  }, [postData]);

  const handleLike = async () => {
    if (isLiked) return;
    try {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      await like(postData.post_id);
      toast.success('感谢你的喜欢！');
    } catch (error) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      toast.error('点赞失败，请稍后重试');
    }
  };

  const handleDislike = async () => {
    if (!isLiked) return;
    try {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      await dislike(postData.post_id);
      toast.show('已取消点赞');
    } catch (error) {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      toast.error('取消点赞失败，请稍后重试');
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

  if (!postData) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl overflow-hidden max-w-7xl w-full max-h-[90vh] flex shadow-2xl">
        {/* 左侧图片区域 */}
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
                    key={images[currentImageIndex]?.id}
                    src={images[currentImageIndex]?.image_url}
                    alt={`作品图片 ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-white/50 text-center">暂无图片</div>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-10 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-10 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>

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

        {/* 右侧详情区域 - 使用flex列布局，固定高度 */}
        <div className="w-[400px] bg-white flex flex-col h-[90vh]">
          {/* 头部 - 固定高度 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 truncate">{metadata.title}</h2>
              <p className="text-xs text-gray-400 mt-1">{metadata.createdAt} · {metadata.type}</p>
            </div>
            <button
              onClick={() => {
                clearComments();
                onClose()}
              }
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 作者信息 - 固定高度 */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 flex-shrink-0">
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
              <div className='flex items-center gap-2'>
                <h3 className="text-start font-semibold text-gray-900 truncate">{author.name}</h3>
                {postData.role && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full whitespace-nowrap flex-shrink-0">
                    认证摄影师
                  </span>
                )}
              </div>
              <p className="text-start text-xs text-gray-500">ID: {author.user_id}</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105 flex-shrink-0">
              关注
            </button>
          </div>

          {/* 作品描述 - 固定高度 */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <p className="text-start text-sm font-medium text-gray-700 mb-2">作品描述：</p>
            <p className="text-start text-gray-600 text-sm leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
              {metadata.content}
            </p>
          </div>

          {/* 评论区域 - 使用flex列布局，固定高度 */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* 评论标题 - 固定 */}
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
              <h3 className="text-sm font-semibold text-gray-900">
                评论 ({total || 0})
              </h3>
              {!isLogin && (
                <button 
                  onClick={() => toast.show('请先登录后再评论', 'warning')}
                  className="text-xs text-orange-500 hover:text-orange-600"
                >
                  登录后评论
                </button>
              )}
            </div>
            
            {/* 评论列表 - 固定高度滚动区域 */}
            <div className="flex-1 overflow-y-auto px-4 min-h-0">
              <CommentList
                comments={commentList}
                loading={commentsLoading}
                hasMore={currentPage < totalPages}
                onLoadMore={loadMoreComments}
              />
            </div>
          </div>

          {/* 评论输入区域 - 固定高度 */}
          <div className="border-t border-gray-100 bg-white flex-shrink-0">
            <div className="p-3">
              <div className="flex flex-col">
                <textarea
                  ref={commentInputRef}
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={isLogin ? "写下你的评论... (Ctrl+Enter 发送)" : "登录后参与评论"}
                  disabled={!isLogin || isSubmitting}
                  rows={1}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  style={{
                    minHeight: '36px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                />
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`${commentText.length >= 500 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {commentText.length}/500
                    </span>
                    <span className="text-gray-400 hidden sm:inline">
                      Ctrl+Enter 发送
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSubmitComment}
                    disabled={!isLogin || !commentText.trim() || isSubmitting}
                    className={`px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-sm ${
                      !isLogin || !commentText.trim() || isSubmitting
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>发送中</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>发送</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action区域 - 固定高度，始终显示 */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex-shrink-0">
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
              
              <button 
                onClick={focusCommentInput}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-medium">{total || 0}</span>
              </button>
              
              <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="text-xs font-medium">{stats.viewsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}