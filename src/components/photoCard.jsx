import { Camera, MapPin, User, Image as ImageIcon, Heart, Edit3 } from "lucide-react";
import { useState } from "react";

// 照片卡片组件
function PhotoCard({ photo, onSelect, onEditDraft }) {
  // 添加本地状态来追踪图片加载错误
  const [mainImageError, setMainImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  // 判断是否为草稿 (status = -1)
  const isDraft = photo.status === -1;

  // 处理主图加载错误
  const handleMainImageError = () => {
    setMainImageError(true);
  };

  // 处理头像加载错误
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // 处理卡片点击
  const handleCardClick = (e) => {
    if (isDraft) {
      // 草稿状态：触发编辑方法，不触发原onSelect
      if (onEditDraft) {
        onEditDraft(photo, e);
      }
    } else {
      // 非草稿：正常触发onSelect
      onSelect(photo.post_id);
    }
  };

  const getFirstImage = (images) => {
    if (!images) return null;
    
    // 如果是字符串，尝试解析
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed[0] : null;
      } catch {
        // 如果不是JSON，可能是逗号分隔
        return images.split(',')[0];
      }
    }
    
    // 如果是数组
    if (Array.isArray(images)) {
      return images[0];
    }
    
    return null;
  };

  // 渲染主图区域
  const renderMainImage = () => {
    // 如果有图片URL且没有加载错误
    if (photo.images && !mainImageError) {
      return (
        <img
          src={getFirstImage(photo.images)}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={handleMainImageError}
          loading="lazy"
        />
      );
    }

    // 显示默认占位图
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
        <ImageIcon className="w-16 h-16 text-orange-300 mb-2" />
        <span className="text-sm text-gray-500">图片加载失败</span>
      </div>
    );
  };

  // 渲染头像
  const renderAvatar = () => {
    // 如果有头像且没有加载错误
    if (photo.avatar_url && !avatarError) {
      return (
        <img
          src={photo.avatar_url}
          alt={photo.nickname}
          className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 group-hover:border-orange-400 transition-colors duration-300"
          onError={handleAvatarError}
          loading="lazy"
        />
      );
    }

    // 显示默认头像
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center border-2 border-orange-200 group-hover:border-orange-400 transition-colors duration-300">
        <User className="w-5 h-5 text-white" />
      </div>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border ${
        isDraft 
          ? 'border-orange-300/70 hover:border-orange-400' 
          : 'border-orange-100/50 hover:border-orange-200'
      } relative aspect-[4/5]`}
    >
      {/* 图片区域 - 占满整个卡片 */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
        {renderMainImage()}
        
        {/* 草稿遮罩 - 半透明效果 */}
        {isDraft && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        )}
      </div>

      {/* 点赞数标签 - 非草稿才显示 */}
      {!isDraft && (
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-20 border border-white/20 shadow-xl">
          <Heart className={`w-4 h-4 ${photo.isLiked ? 'fill-orange-400 text-orange-400' : 'text-white'}`} />
          <span className="font-semibold">{photo.totalLikes || photo.likeCount || 0}</span>
        </div>
      )}

      {/* 摄影师标签 - 左上方 */}
      <div className={`absolute top-4 left-4 bg-gradient-to-r ${!isDraft ? 'from-orange-500 to-pink-500 text-white' : 'bg-gray-300'}  px-4 py-1.5 rounded-full text-xs font-medium shadow-lg z-20 border border-white/20 backdrop-blur-sm`}>
        <span className="flex items-center gap-1">
          <Camera className="w-3 h-3" />
          {isDraft ? '草稿' : '摄影作品'}
        </span>
      </div>

      {/* 草稿标识 - 在摄影师信息区域右侧 */}
      {isDraft && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1 border border-white/20 backdrop-blur-sm">
            <Edit3 className="w-3 h-3" />
            草稿
          </div>
        </div>
      )}

      {/* 内容区域 - 从下到上渐变透明 */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t ${
        isDraft 
          ? 'from-orange-50/95 via-orange-50/90 to-transparent' 
          : 'from-white via-white/95 to-transparent'
      }`}>
        {/* 作品标题 */}
        <h5 className={`font-bold mb-2 drop-shadow-lg line-clamp-2 ${
          isDraft ? 'text-gray-500' : 'text-gray-800'
        }`}>
          {photo.title}
          {isDraft && <span className="ml-2 text-xs font-normal text-gray-600">(未发布)</span>}
        </h5>
        
        {/* 摄影师信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              {renderAvatar()}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h4 className={`text-start font-semibold text-sm transition-colors duration-300 ${
                isDraft 
                  ? 'text-gray-800 group-hover:text-gray-900' 
                  : 'text-gray-800 group-hover:text-orange-600'
              }`}>
                {photo.nickname}
              </h4>
              <p className="text-xs text-start text-gray-500">
                ID: {photo.user_id || photo.casId}
              </p>
            </div>
          </div>
          
          {/* 专业标签 */}
          {photo.isProfessional && !isDraft && (
            <span className="text-xs bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-full font-medium shadow-lg whitespace-nowrap flex items-center gap-1">
              <Camera className="w-3 h-3" />
              专业
            </span>
          )}
        </div>
      </div>

      {/* 草稿hover提示 - 去发布 */}
      {isDraft && (
        <div className="absolute inset-0 bg-orange-500/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
          <div className="text-white text-center transform scale-90 group-hover:scale-100 transition-transform">
            <Edit3 className="w-12 h-12 mx-auto mb-3" />
            <p className="text-lg font-bold mb-1">去发布</p>
            <p className="text-sm opacity-90">点击编辑草稿</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoCard;