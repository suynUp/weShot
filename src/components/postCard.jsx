import { Heart } from 'lucide-react';
import { useMemo } from 'react';

// 在 postCard.jsx 中
export function PostCard({ post, onClick }) {

  const trans = useMemo(()=>{
    const str = post.photographers?.bio
  })

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 h-full flex flex-col"
    >
      {/* 图片区域 - 增加高度 */}
      <div className="relative h-64 bg-orange-100 overflow-hidden flex-shrink-0">
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* 内容区域 - 弹性填充 */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {post.content}
        </p>
        
        {/* 摄影师信息 */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
        <div className='flex'>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {post.photographers?.avatar_url && (
              <img
                src={post.photographers.avatar_url}
                alt={post.photographers.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="ml-[6px] flex-1 min-w-0">
            <p className="text-sm font-medium text-start text-gray-800 truncate">
              {post.photographers?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {post.photographers?.bio}
            </p>
          </div>
        </div>
          
          {/* 右侧：点赞 */}
          <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-orange-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{post.likes_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}