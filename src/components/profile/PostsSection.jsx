// components/profile/PostsSection.jsx
import { Image, Trash2 } from 'lucide-react';
import PhotoCard from '../photoCard';
import { useState } from 'react';

// 删除确认弹窗组件
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, postCount = 1 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            确认删除
          </h3>
          
          <p className="text-gray-500 mb-6">
            {postCount > 1 
              ? `确定要删除选中的 ${postCount} 篇帖子吗？此操作不可恢复。`
              : '确定要删除这篇帖子吗？此操作不可恢复。'}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function PostsSection({ 
  posts, 
  loading, 
  isOwnProfile, 
  selectedPosts = new Set(),
  onPostCheck, 
  onPostClick, 
  onDeletePost, 
  onNewPost, 
  emptyMessage 
}) {
  // 删除确认弹窗状态
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 处理删除点击
  const handleDeleteClick = (postId, e) => {
    e?.stopPropagation(); // 阻止事件冒泡
    setPostToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  // 处理确认删除
  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDeletePost(postToDelete);
    } catch (error) {
      console.error('删除失败:', error);
      // 这里可以添加错误提示，比如使用 toast
      // toast.error('删除失败，请重试');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedPosts.size === 0) return;
    setPostToDelete('batch');
    setDeleteConfirmOpen(true);
  };

  // 处理确认批量删除
  const handleConfirmBatchDelete = async () => {
    if (!postToDelete || postToDelete !== 'batch') return;
    
    setIsDeleting(true);
    try {
      // 遍历选中的帖子并删除
      for (const postId of selectedPosts) {
        await onDeletePost(postId);
      }
      // 清空选中状态（如果父组件有提供清除方法的话）
      if (onPostCheck && typeof onPostCheck === 'function') {
        // 这里可能需要父组件提供批量清除的方法
        // 暂时只清除单个选中状态
        selectedPosts.clear();
      }
    } catch (error) {
      console.error('批量删除失败:', error);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <Image className="w-10 h-10 text-orange-400" />
          </div>
          <p className="text-gray-500 mb-2">{emptyMessage}</p>
          {isOwnProfile && onNewPost && (
            <button 
              onClick={onNewPost}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
            >
              发布第一篇帖子
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative min-h-[400px]">
        {/* 批量操作栏 - 当选中帖子时显示 */}
        {isOwnProfile && selectedPosts.size > 0 && (
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-between">
            <span className="text-sm text-orange-700">
              已选中 <span className="font-bold">{selectedPosts.size}</span> 篇帖子
            </span>
            <button
              onClick={handleBatchDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>删除中...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>批量删除</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.post_id} className="relative group">
              <PhotoCard photo={post} onSelect={(post_id) => onPostClick(post_id)} />
              
              {isOwnProfile && (
                <>
                  {/* 复选框 - 悬停显示 */}
                  <div 
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.post_id)}
                      onChange={(e) => onPostCheck(post.post_id, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                  </div>
                  
                  {/* 删除按钮 - 悬停显示 */}
                  <div 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => handleDeleteClick(post.post_id, e)}
                      disabled={isDeleting && postToDelete === post.post_id}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="删除帖子"
                    >
                      {isDeleting && postToDelete === post.post_id ? (
                        <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* 加载遮罩 */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-3xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <span className="text-gray-600">加载中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 删除确认弹窗 - 单个删除 */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen && postToDelete && postToDelete !== 'batch'}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        postCount={1}
      />

      {/* 删除确认弹窗 - 批量删除 */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen && postToDelete === 'batch'}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmBatchDelete}
        postCount={selectedPosts.size}
      />
    </>
  );
}