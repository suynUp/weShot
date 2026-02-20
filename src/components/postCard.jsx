import { Heart,BadgeCheck } from 'lucide-react';
import { useMemo } from 'react';

// 在 postCard.jsx 中
export function PostCard({ post, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 h-full flex flex-col"
    >
      {/* 图片区域 */}
      <div className="relative h-64 bg-orange-100 overflow-hidden flex-shrink-0">
        <img
          src={post.images}  // 直接使用 images 字段
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
          }}
        />
        {post.type === 2 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            精选
          </span>
        )}
      </div>
      
      {/* 内容区域 */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        {/* 摄影师信息 */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
          <div className='flex items-center flex-1 min-w-0'>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {post.avatar_url && (
                <img
                  src={post.avatar_url}
                  alt={post.nickname}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="ml-2 flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-start text-gray-800 truncate">
                  {post.nickname}
                </p>
                {/* 认证摄影师标识 */}
                {post.role && (
                  <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" title="认证摄影师" />
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {post.role ? '认证摄影师' : '摄影爱好者'}
              </p>
            </div>
          </div>
          
          {/* 点赞 */}
          <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-orange-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}