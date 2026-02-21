import { ThumbsUp, Camera, MapPin, Star } from "lucide-react";

// 照片卡片组件
function PhotoCard({ photo ,onSelect }) {
  
  return (
    <div
    onClick={()=>onSelect(photo.post_id)} 
    className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] group">
      {/* 作品图片 */}
      <div className="relative h-56 bg-orange-100 overflow-hidden">
        <img
          src={photo.images} // 修改：从 images 字段获取
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* 作品标题浮层 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
        </div>
      </div>
      
      {/* 摄影师信息 */}
      <div className="p-5 pt-0">
        <div className="flex flex-col items-start gap-4">
          <div className="flex w-full">
            {/* 摄影师头像 */}
            <div className="relative mt-[20px]">
              <img
                src={photo.avatar_url} // 修改：从 avatar_url 字段获取
                alt={photo.nickname}
                className="w-12 h-12 rounded-full object-cover border-3 border-orange-200"
              />

            </div>
            {/* 摄影师详情 */}
            <div className="flex-1 pt-[20px] ml-[10px]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-start text-lg">{photo.nickname}</h4>
                  <p className="text-xs text-start text-gray-500">ID: {photo.user_id}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-orange-600">
                    <Camera className="w-4 h-4" />
                    {/* 如果没有 completedOrders 字段，可以暂时隐藏或使用默认值 */}
                    <span>0单</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 地点和作品点赞 */}
          <div className="flex items-center justify-between w-full pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{photo.location || '未知地点'}</span>
            </div>
  
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500"></div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <ThumbsUp className={`w-4 h-4 ${photo.isLiked ? 'fill-orange-400 text-orange-400' : 'text-orange-400'}`} />
                <span>{photo.totalLikes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 星级评分组件
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <Star className="w-4 h-4 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          );
        } else {
          return <Star key={i} className="w-4 h-4 text-gray-300" />;
        }
      })}
      <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

export default PhotoCard;