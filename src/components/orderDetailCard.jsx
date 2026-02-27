import { useEffect, useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Star, MapPin, Calendar, Clock, DollarSign, User, Camera, Image as ImageIcon, CheckCircle, MessageCircle } from 'lucide-react';

// 评分星星组件
function RatingStars({ score, size = 'w-4 h-4' }) {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className={`${size} fill-orange-400 text-orange-400`} />;
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <Star className={`${size} text-gray-300`} />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star className={`${size} fill-orange-400 text-orange-400`} />
              </div>
            </div>
          );
        } else {
          return <Star key={i} className={`${size} text-gray-300`} />;
        }
      })}
      <span className="ml-1 text-sm font-medium text-gray-700">{score.toFixed(1)}</span>
    </div>
  );
}

// 评价项组件
function RatingItem({ label, score }) {
  return (
    <div className="flex items-center pl-3">
      <span className="text-xs text-gray-500 mr-10">{label}</span>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < score ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function OrderDetail({ orderData, onClose }) {
  console.log(orderData)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 处理图片数据
  const images = useMemo(() => {
    if (!orderData?.deliver_url) return [];
    const imageList = Array.isArray(orderData.deliver_url) 
      ? orderData.deliver_url 
      : [orderData.deliver_url];
    return imageList.map((url, index) => ({
      id: `${orderData.order_id}-${index}`,
      url: url,
      index: index
    }));
  }, [orderData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!orderData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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

   if (!orderData) {
    return (
      <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
                    src={images[currentImageIndex]?.url}
                    alt={`作品图片 ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-white/50 text-center flex flex-col items-center gap-2">
                    <ImageIcon className="w-12 h-12 opacity-50" />
                    <span>暂无交付图片</span>
                  </div>
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

              {/* 订单状态标签 */}
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 z-20">
                <CheckCircle className="w-4 h-4" />
                已完成
              </div>
            </>
          )}
        </div>

        {/* 右侧详情区域 */}
        <div className="w-[400px] bg-white flex flex-col h-[90vh]">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">订单详情</h2>
              <p className="text-xs text-gray-400 mt-1">#{orderData.order_id} · {orderData.type || '未分类'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 滚动内容区域 - 分块展示 */}
          <div className="flex-1 overflow-y-auto">
            {/* 模块1：摄影师信息 */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden shadow-md">
                  {orderData.photographer_avatar ? (
                    <img 
                      src={orderData.photographer_avatar} 
                      alt={orderData.photographer_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = orderData.photographer_name?.charAt(0) || '摄';
                      }}
                    />
                  ) : (
                    <span className="text-lg">{orderData.photographer_name?.charAt(0) || '摄'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className='flex items-center gap-2'>
                    <h3 className="text-start font-semibold text-gray-900 truncate">
                      {orderData.photographer_name || '未知摄影师'}
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full whitespace-nowrap flex-shrink-0">
                      摄影师
                    </span>
                  </div>
                  <p className="text-start text-xs text-gray-500">ID: {orderData.photographer_id || '未知'}</p>
                </div>
              </div>
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-100"></div>

            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">订单信息</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm">拍摄时间：{formatDate(orderData.shoot_time)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm">拍摄时长：{orderData.duration || '未指定'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm">地点：{orderData.location || '未指定'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm">拍摄人数：{orderData.subject_count || 0}人</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <DollarSign className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-600">报酬：¥{orderData.price ? Number(orderData.price).toFixed(2) : '0'}</span>
                  {orderData.need_equipment && (
                    <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      专业设备
                    </span>
                  )}
                </div>
                {orderData.remark && orderData.remark !== '无' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">备注：{orderData.remark}</p>
                  </div>
                )}
              </div>
            </div>


            {/* 分割线 */}
            <div className="border-t border-gray-100"></div>

            {/* 模块3：客户评价区域（包含客户信息和评价） */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">客户评价</h3>
              
              {/* 客户信息 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                  {orderData.customer_avatar ? (
                    <img 
                      src={orderData.customer_avatar} 
                      alt={orderData.customer_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = orderData.customer_name?.charAt(0) || '客';
                      }}
                    />
                  ) : (
                    <span className="text-lg">{orderData.customer_name?.charAt(0) || '客'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className='flex items-center gap-2'>
                    <h4 className="text-start font-medium text-gray-900 truncate">
                      {orderData.customer_name || '未知客户'}
                    </h4>
                  </div>
                  <p className="text-start text-xs text-gray-500">ID: {orderData.customer_id || '未知'}</p>
                </div>
              </div>

              {/* 评价内容 - 如果有评价才显示 */}
              {orderData.rating_content ? (
                <>
                  {/* 总体评分 */}
                  <div className="flex bg-gray-50  p-2 rounded-lg items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 ml-2">综合评分</span>
                      <RatingStars score={orderData.score || 0} size="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(orderData.rating_time).split(' ')[0]}
                    </span>
                  </div>

                   {/* 分项评分 */}
                <div className="space-y-3 mb-4 p-4 bg-orange-50/50 rounded-xl">
                  <RatingItem label="沟通态度" score={orderData.comm_score || 0} />
                  <RatingItem label="守时情况" score={orderData.time_score || 0} />
                  <RatingItem label="作品质量" score={orderData.photo_score || 0} />
                  
                  {/* 评价内容 */}
                  <div className="mt-4 pt-3 border-t border-orange-100">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{orderData.rating_content}</p>
                    </div>
                  </div>
                </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-lg">
                  暂无评价
                </div>
              )}
            </div>

            {/* 底部留白 */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}