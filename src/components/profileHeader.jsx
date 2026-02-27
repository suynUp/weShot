import { ChevronLeft, Camera, Pencil,LogOut, Camera as CameraIcon, Film, Settings, Award, CheckCircle, Package, Star } from 'lucide-react';
import { SmartTag } from './tags';

// Mock数据 - 认证摄影师

export function ProfileHeader({ 
  profile , 
  onBack, 
  onEdit, 
  onAvatarClick,
  logOut,
  isOwnProfile
}) {
  // 判断是否是认证摄影师
  const isVerifiedPhotographer = profile?.role === 2 ;
  const getPhotographyStyles = () => {
    if(!profile?.style) return []
    return profile.style
  }
  // 获取摄影设备数组
  const getPhotographyEquipment = () => {
    if (!profile?.equipment) return [];
    return profile.equipment;
  };

  // 获取摄影类型数组
  const getPhotographyTypes = () => {
    if (!profile?.photographerType) return [];
      return profile.photographerType
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
                {profile?.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
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
                      { profile ?.nickname || '光影行者'}
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
                    ID: {profile?.casId || 'PHOTO'}
                  </p>
                  
                  {/* 摄影师信息标签区域 - 仅认证摄影师显示 */}
                  {isVerifiedPhotographer && (
                    <div className="flex flex-wrap gap-2">
                      {/* 摄影类型标签 */}
                      {photographyTypes.length > 0 && (
                          photographyTypes.map((type) => (
                           <SmartTag
                           key={type}
                           tag={type}
                           />
                          ))
                      )}
                      
                      {/* 摄影风格标签 */}
                      {photographyStyles.length > 0 && (
                          photographyStyles.map((style) => (
                            <SmartTag
                            key={style}
                            tag={style}
                            />
                          ))
                      )}
                      
                      {/* 摄影设备标签 */}
                      {photographyEquipment.length > 0 && (
                          photographyEquipment.map((equipment) => (
                            <SmartTag
                            icon={Film}
                            key={equipment}
                            tag={equipment}
                            />
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
                        <div className="font-semibold text-gray-900">{profile.completedOrders}</div>
                      </div>
                    </div>
                    
                    {/* 总订单量 */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">总订单量</div>
                        <div className="font-semibold text-gray-900">{profile.totalOrders}</div>
                      </div>
                    </div>
                    
                    {/* 评分 - 只有在有评分时才显示 */}
                    {profile.rating&&profile.rating>0 &&isVerifiedPhotographer && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-100 rounded-lg">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">评分</div>
                          <div className="font-semibold text-gray-900">
                            {profile.rating} 
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 个人简介 - 所有用户都显示 */}
                  {profile?.detail && (
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-md mt-3 text-left">
                      {profile.detail}
                    </p>
                  )}
                </div>
                
                {/* 编辑按钮 */}
                {isOwnProfile&&
                <><button
                  onClick={()=>onEdit()}
                  className="flex p-2 items-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                  title="编辑资料"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={()=>logOut()}
                  className="flex p-2 items-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                  title="登出"
                >
                  <LogOut className="w-5 h-5"/>
                </button>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}