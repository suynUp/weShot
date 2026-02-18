import { ChevronLeft, Camera, Pencil, Camera as CameraIcon, Film, Settings, Award, CheckCircle, Package, Star } from 'lucide-react';

// Mock数据 - 认证摄影师
const mockPhotographerData = {
  profile: {
    user_id: 'PHOTO_2024001',
    username: '光影行者',
    avatar_url: 'https://images.unsplash.com/photo-1494790108777-9f8e60874d8f?w=150',
  },
  userProfile: {
    nickname: '光影行者',
    detail: '专注人像摄影八年 | 捕捉光影，记录美好瞬间 | 擅长情绪人像、商业摄影',
    photographer: {
      verified: false,
      style: ['人像摄影', '商业摄影', '婚礼摄影'],
      type: ['职业摄影师', '摄影工作室'],
      equipment: ['索尼 A7M4', '佳能 R5', '富士 X-T5'],
      completedOrders: 328,
      totalOrders: 356,
      rating: 4.9,
      reviewCount: 312
    }
  }
};

export function ProfileHeader({ 
  profile = mockPhotographerData.profile, 
  userProfile = mockPhotographerData.userProfile, 
  onBack, 
  onEdit, 
  onAvatarClick 
}) {
  // 摄影风格标签颜色映射
  const getStyleColor = (style) => {
    const colors = {
      '人像摄影': 'bg-pink-100 text-pink-700 border-pink-200',
      '风光摄影': 'bg-green-100 text-green-700 border-green-200',
      '街拍摄影': 'bg-purple-100 text-purple-700 border-purple-200',
      '商业摄影': 'bg-blue-100 text-blue-700 border-blue-200',
      '婚礼摄影': 'bg-rose-100 text-rose-700 border-rose-200',
      '纪实摄影': 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return colors[style] || 'bg-orange-100 text-orange-700 border-orange-200';
  };

  // 设备类型标签颜色映射
  const getEquipmentColor = (equipment) => {
    const colors = {
      '索尼 A7M4': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      '佳能 R5': 'bg-red-100 text-red-700 border-red-200',
      '尼康 Z9': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      '富士 X-T5': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      '徕卡 M11': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[equipment] || 'bg-purple-100 text-purple-700 border-purple-200';
  };

  // 摄影类型标签颜色映射
  const getTypeColor = (type) => {
    const colors = {
      '职业摄影师': 'bg-blue-100 text-blue-700 border-blue-200',
      '摄影爱好者': 'bg-teal-100 text-teal-700 border-teal-200',
      '摄影工作室': 'bg-violet-100 text-violet-700 border-violet-200',
      '自由摄影师': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    };
    return colors[type] || 'bg-blue-100 text-blue-700 border-blue-200';
  };

  // 判断是否是认证摄影师
  const isVerifiedPhotographer = userProfile?.photographer?.verified || false;

  // 获取摄影风格数组（支持字符串或数组格式）
  const getPhotographyStyles = () => {
    if (!userProfile?.photographer?.style) return [];
    
    if (Array.isArray(userProfile.photographer.style)) {
      return userProfile.photographer.style;
    }
    
    if (typeof userProfile.photographer.style === 'string') {
      return userProfile.photographer.style.split(',').map(s => s.trim());
    }
    
    return [];
  };

  // 获取摄影设备数组
  const getPhotographyEquipment = () => {
    if (!userProfile?.photographer?.equipment) return [];
    
    if (Array.isArray(userProfile.photographer.equipment)) {
      return userProfile.photographer.equipment;
    }
    
    if (typeof userProfile.photographer.equipment === 'string') {
      return userProfile.photographer.equipment.split(',').map(e => e.trim());
    }
    
    return [];
  };

  // 获取摄影类型数组
  const getPhotographyTypes = () => {
    if (!userProfile?.photographer?.type) return [];
    
    if (Array.isArray(userProfile.photographer.type)) {
      return userProfile.photographer.type;
    }
    
    if (typeof userProfile.photographer.type === 'string') {
      return userProfile.photographer.type.split(',').map(t => t.trim());
    }
    
    return [];
  };

  // 订单量数据 - 无论是否认证都显示
  const orderStats = {
    completed: userProfile?.photographer?.completedOrders || 0,
    total: userProfile?.photographer?.totalOrders || 0,
    rating: userProfile?.photographer?.rating || 0,
    reviewCount: userProfile?.photographer?.reviewCount || 0
  };

  const photographyStyles = getPhotographyStyles();
  const photographyEquipment = getPhotographyEquipment();
  const photographyTypes = getPhotographyTypes();

  return (
    <div className="relative">
      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex justify-center pt-8 pb-6 px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-xl border border-orange-100 w-full max-w-3xl">
          <div className="flex items-start gap-6">
            {/* 头像区域 */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-orange-500" />
                  </div>
                )}
              </div>
              
              {/* 认证摄影师徽章 */}
              {isVerifiedPhotographer && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full p-1.5 border-2 border-white shadow-md">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* 编辑头像按钮 */}
              <button
                onClick={onAvatarClick}
                className="absolute -bottom-1 -left-1 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
              >
                <Camera className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>

            {/* 用户信息区域 */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.username || userProfile?.nickname || '光影行者'}
                    </h1>
                    
                    {/* 认证标签 */}
                    {isVerifiedPhotographer && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-50 to-pink-50 rounded-full border border-orange-200">
                        <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-medium text-orange-600">认证摄影师</span>
                      </div>
                    )}
                  </div>
                  
                  {/* ID - 左对齐 */}
                  <p className="text-sm text-gray-500 mb-3 text-left">
                    ID: {profile?.user_id || 'PHOTO_2024001'}
                  </p>
                  
                  {/* 摄影师信息标签区域 - 仅认证摄影师显示 */}
                  {isVerifiedPhotographer && (
                    <div className="space-y-2 mb-3 flex flex-wrap gap-2">
                      {/* 摄影类型标签 */}
                      {photographyTypes.length > 0 && (
                          photographyTypes.map((type, index) => (
                            <span 
                              key={`type-${index}`}
                              className={`text-xs px-3 mt-2 py-1 rounded-full border ${getTypeColor(type)}`}
                            >
                              {type}
                            </span>
                          ))
                      )}
                      
                      {/* 摄影风格标签 */}
                      {photographyStyles.length > 0 && (
                          photographyStyles.map((style, index) => (
                            <span 
                              key={`style-${index}`}
                              className={`text-xs px-3 py-1 rounded-full border ${getStyleColor(style)}`}
                            >
                              {style}
                            </span>
                          ))
                      )}
                      
                      {/* 摄影设备标签 */}
                      {photographyEquipment.length > 0 && (
                          photographyEquipment.map((equipment, index) => (
                            <span 
                              key={`equipment-${index}`}
                              className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getEquipmentColor(equipment)}`}
                            >
                              <Film className="w-3 h-3" />
                              {equipment}
                            </span>
                          ))
                      )}
                    </div>
                  )}
                  
                  {/* 订单量统计卡片 - 所有用户都显示，但非认证用户可能为0 */}
                  <div className="flex items-center gap-4 mt-3 p-3 bg-gray-50 rounded-xl">
                    {/* 已完成订单 */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Package className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">已完成订单</div>
                        <div className="font-semibold text-gray-900">{orderStats.completed}</div>
                      </div>
                    </div>
                    
                    {/* 总订单量 */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">总订单量</div>
                        <div className="font-semibold text-gray-900">{orderStats.total}</div>
                      </div>
                    </div>
                    
                    {/* 评分 - 只有在有评分时才显示 */}
                    {orderStats.rating > 0 &&isVerifiedPhotographer && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-100 rounded-lg">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">评分</div>
                          <div className="font-semibold text-gray-900">
                            {orderStats.rating} {orderStats.reviewCount > 0 && <span className="text-xs text-gray-500">({orderStats.reviewCount}条)</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 个人简介 - 所有用户都显示 */}
                  {userProfile?.detail && (
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-md mt-3 text-left">
                      {userProfile.detail}
                    </p>
                  )}
                </div>
                
                {/* 编辑按钮 */}
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                  title="编辑资料"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}