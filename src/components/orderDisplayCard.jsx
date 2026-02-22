// components/orderDisplayCard.jsx
import { MapPin, Clock, User, Calendar, DollarSign, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export const OrderDisplayCard = ({ post, onClick }) => {
    // 添加本地状态来追踪图片加载错误
    const [mainImageError, setMainImageError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    // 格式化日期
    const formatDate = (dateString) => {
        if (!dateString) return '未指定';
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 获取状态标签
    const getStatusBadge = () => 
    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1 z-20">
        <CheckCircle className="w-3 h-3" />
        已完成
    </div>
            


    // 处理主图加载错误
    const handleMainImageError = () => {
        setMainImageError(true);
    };

    // 处理头像加载错误
    const handleAvatarError = () => {
        setAvatarError(true);
    };

    // 渲染主图区域
    const renderMainImage = () => {
        // 如果有图片URL且没有加载错误
        if (post.deliver_url && !mainImageError) {
            return (
                <img 
                    src={"https://image.foofish.work/i/2026/02/21/699982ed0f0e5-1771668205.jpg"} 
                    alt={`作品-${post.type || '摄影'}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={handleMainImageError}
                    loading="lazy"
                />
            );
        }

        // 显示默认占位图
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ImageIcon className="w-16 h-16 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">图片加载失败</span>
            </div>
        );
    };

    // 渲染头像
    const renderAvatar = () => {
        // 如果有头像且没有加载错误
        if (post.photographerAvatar && !avatarError) {
            return (
                <img 
                    src={post.photographerAvatar}
                    alt={post.photographerName || '摄影师'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                    onError={handleAvatarError}
                    loading="lazy"
                />
            );
        }

        // 显示默认头像
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
        );
    };

    return (
        <div 
            onClick={onClick}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-orange-100/50 hover:border-orange-200 relative"
        >
            {/* 图片区域 - 从1:1改为4:5比例，高度增加为原来的1.25倍 */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
                {renderMainImage()}
                
                {/* 状态标签 */}
                {getStatusBadge()}
                
                {/* 拍摄类型标签 */}
            </div>

            {/* 内容区域 - 紧凑布局，带从下到上的渐变透明效果 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
                {/* 摄影师信息 - 带专业设备标签 */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                            {renderAvatar()}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h3 className="text-start font-semibold text-gray-800 text-sm">
                                {post.photographerName || '未知摄影师'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                ID: {post.photographer_id || '未知'}
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                         {/* 专业设备标签 - 移到摄影师旁边 */}
                        {post.need_equipment && (
                            <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                                专业设备
                            </span>
                        )}
                        <div className="bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium z-20">
                            {post.type || '未分类'}
                        </div>
                    </div>
                   
                </div>

                {/* 精简信息 - 只保留地点、花费和拍摄时间 */}
                <div className="space-y-1.5">
                    {/* 地点 */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <span className="truncate text-xs" title={post.location}>
                            {post.location || '未指定地点'}
                        </span>
                    </div>

                    {/* 花费和拍摄时间 - 左右布局 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="font-semibold text-green-600 text-sm">
                                ¥{post.price ? Number(post.price).toFixed(2) : '0'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-pink-400" />
                            <span className="text-xs">
                                {post.shoot_time ? formatDate(post.shoot_time) : '未指定'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};