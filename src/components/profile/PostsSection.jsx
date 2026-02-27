// components/profile/PostsSection.jsx
import { Image, Trash2 } from 'lucide-react';
import PhotoCard from '../photoCard';

export function PostsSection({ posts, loading, isOwnProfile, selectedPosts = new Set(),
  onPostCheck, onPostClick, onDeletePost, onNewPost, emptyMessage }) {
  
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative min-h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.post_id} className="relative group">
            <PhotoCard photo={post} onSelect={(post_id) => onPostClick(post_id)} />
            {isOwnProfile && (
              <>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(post.post_id)}
                    onChange={(e) => onPostCheck(post.post_id, e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => onDeletePost(post, e)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-3xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      )}
    </div>
  );
}