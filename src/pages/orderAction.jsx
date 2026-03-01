import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, User, DollarSign,
  Camera, Package, CheckCircle, XCircle,
  Clock as ClockIcon, AlertCircle, Download,
  Star, 
  ChevronLeft, Upload, Image as ImageIcon,
  Users, Video, Loader
} from 'lucide-react';
import { UserStore } from '../store/userStore';
import useActionOrder from '../hooks/useActionOrder'; 
import { imgUpload } from '../api/imgUpload';
import { toast } from '../hooks/useToast';
import { useGetOrderDetail } from '../hooks/useOrder';
import { OrderDisplayStore } from '../store/orderDisplayStore';

// 状态映射
const statusMap = {
  0: { text: '待接单', color: 'bg-orange-500', icon: Clock, textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  1: { text: '已接单', color: 'bg-blue-500', icon: CheckCircle, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  2: { text: '已支付', color: 'bg-purple-500', icon: Package, textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
  3: { text: '已完成', color: 'bg-green-500', icon: CheckCircle, textColor: 'text-green-600', bgColor: 'bg-green-50' },
  4: { text: '已评价', color: 'bg-emerald-500', icon: Star, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  '-1': { text: '已取消', color: 'bg-gray-500', icon: XCircle, textColor: 'text-gray-600', bgColor: 'bg-gray-50' },
  '-2': { text: '已拒绝', color: 'bg-red-500', icon: XCircle, textColor: 'text-red-600', bgColor: 'bg-red-50' },
  '-3': { text: '草稿', color: 'bg-gray-400', icon: AlertCircle, textColor: 'text-gray-500', bgColor: 'bg-gray-50' }
};

// 按钮样式类
const buttonClasses = {
  primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
  secondary: 'bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
  danger: 'bg-white border-2 border-red-500 text-red-500 px-6 py-3 rounded-xl font-medium hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
  info: 'bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 flex items-center justify-center gap-2',
  success: 'bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 flex items-center justify-center gap-2',
  warning: 'bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700',
  purple: 'bg-purple-50 border border-purple-200 rounded-xl p-4 text-purple-700 flex items-center justify-center gap-2',
  gray: 'bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-600 flex items-center gap-2'
};

// 评价组件
const RatingStars = ({ value, onChange, readonly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          className={`focus:outline-none transition-transform hover:scale-110 ${
            readonly ? 'cursor-default' : 'cursor-pointer'
          }`}
          disabled={readonly}
        >
          <Star
            className={`w-8 h-8 ${
              star <= value
                ? 'fill-orange-400 text-orange-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// 评价卡片组件
const ReviewCard = ({ review }) => {
  if (!review) return null;
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={review.avatar || '/default-avatar.png'}
          alt={review.nickname || '用户'}
          className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png';
          }}
        />
        <div>
          <h4 className="font-semibold text-gray-900">{review.nickname}</h4>
          <p className="text-sm text-gray-500">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">摄影质量</span>
          <RatingStars value={review.photoScore} readonly />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">准时程度</span>
          <RatingStars value={review.timeScore} readonly />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">沟通效率</span>
          <RatingStars value={review.commScore} readonly />
        </div>
      </div>
      
      {review.content && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-orange-100">
          <p className="text-gray-700">{review.content}</p>
        </div>
      )}
    </div>
  );
};

// 主组件
const OrderActionPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'photographer' 或 'customer'
  const currentUserId = Number(UserStore(state=>state.user.casId)); // 当前登录用户ID
  const [actionLoading, setActionLoading] = useState(false);
  
  const {
    useGetCurrentUser,
    useManageMutation,

    commentError,
    commentSuccess,
    commentLoading,

    handlePay,
    handleAccept,
    handleReject,
    handleDeliver,
    handleCancel,
    handleComment
  } = useActionOrder();

  const getCurrentOrder = useGetOrderDetail()
  const order = OrderDisplayStore(state => state.currentOrder)

  // 评价相关状态
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({
    photoScore: 0,
    timeScore: 0,
    commScore: 0,
    content: ''
  });
  
  // 交付相关状态
  const [deliverImages, setDeliverImages] = useState([]);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  
  // 支付相关
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const MAX_IMAGES = 20; // 最大上传图片数量

  useEffect(()=>{
    useGetCurrentUser.mutate();
  }, []);

  useEffect(() => {
    if (currentUserId&&orderId) {
      fetchOrderDetail();
    }
  }, [orderId, currentUserId]);

  useEffect(()=>{
    // 根据当前用户ID与订单中的ID比较来设置角色
      if (currentUserId === order?.photographer_id) {
        setUserRole('photographer');
      } else if (currentUserId === order?.customer_id) {
        setUserRole('customer');
      } else {
        setUserRole('other');
      }
      
  },[order])

  // 监听操作结果
  useEffect(() => {
    if (useManageMutation.isSuccess) {
      setActionLoading(false);
      setShowDeliverModal(false);
      setShowPaymentModal(false);
      fetchOrderDetail(); // 刷新订单详情
    }
    if (useManageMutation.isError) {
      setActionLoading(false);
    }
  }, [useManageMutation.isSuccess, useManageMutation.isError]);

  useEffect(() => {
    if (commentSuccess) {
      setActionLoading(false);
      setShowReviewModal(false);
      setReview({ photoScore: 0, timeScore: 0, commScore: 0, content: '' });
      fetchOrderDetail(); // 刷新订单详情
    }
    if (commentError) {
      setActionLoading(false);
    }
  }, [commentError,commentSuccess]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      
      getCurrentOrder.mutate(orderId)
      
    } catch (error) {
      console.error('获取订单详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    var deliverUrls 
    switch (action) {
      case 'pay':
        handlePay(order?.order_id);
        break;
      case 'accept':
        handleAccept(order?.order_id);
        break;
      case 'reject':
        handleReject(order?.order_id);
        break;
      case 'deliver':
        // 上传图片到服务器获取URL
        deliverUrls = await uploadImagesToServer();
        if (deliverUrls && deliverUrls.length > 0) {
          handleDeliver(order?.order_id, deliverUrls);
        } else {
          setActionLoading(false);
          toast.warning('请上传交付的作品')
        }
        break;
      case 'cancel':
        handleCancel(order?.order_id);
        break;
      default:
        setActionLoading(false);
    }
  };

  const uploadImagesToServer = async () => {
     const uploadedResults = [];
  
    // 使用 for...of 循环顺序执行
    for (const img of deliverImages) {
      const result = await imgUpload(img.file);
      uploadedResults.push(result);
    }
    
    return uploadedResults;
  };

  const handleSubmitReview = async () => {
    if (review.photoScore === 0 || review.timeScore === 0 || review.commScore === 0) {
      toast.warning('请完成所有评分')
      return;
    }
    
    setActionLoading(true);
    handleComment(
      order?.order_id,
      review.photoScore,
      review.timeScore,
      review.commScore,
      review.content
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (deliverImages.length + files.length > MAX_IMAGES) {
      toast.warning(`最多只能上传 ${MAX_IMAGES} 张图片`);
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setDeliverImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setDeliverImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getActionButtons = () => {
    if (!order || !userRole) return null;
    
    const status = order?.status;
    const isNegative = status < 0;
    const statusInfo = statusMap[status];
    
    // 非摄影师也非客户（如管理员）- 只读视图
    if (userRole === 'other') {
      return (
        <div className={buttonClasses.info}>
          <AlertCircle className="w-5 h-5" />
          <span>您无权操作此订单</span>
        </div>
      );
    }
    
    // 负数状态统一显示
    if (isNegative) {
      return (
        <div className={buttonClasses.gray}>
          <statusInfo.icon className="w-5 h-5" />
          <span>订单{statusInfo.text}</span>
        </div>
      );
    }
    
    // 摄影师视角
    if (userRole === 'photographer') {
      switch (status) {
        case 0:
          return (
            <div className="flex gap-3">
              <button
                onClick={() => handleAction('accept')}
                disabled={actionLoading || useManageMutation.isLoading}
                className={buttonClasses.primary}
              >
                {useManageMutation.isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {useManageMutation.isLoading ? '处理中...' : '接受订单'}
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={actionLoading || useManageMutation.isLoading}
                className={buttonClasses.danger}
              >
                {useManageMutation.isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {useManageMutation.isLoading ? '处理中...' : '拒绝订单'}
              </button>
            </div>
          );
        case 1:
          return (
            <div className={buttonClasses.info}>
              <ClockIcon className="w-5 h-5" />
              <p className="font-medium">等待用户支付</p>
            </div>
          );
        case 2:
          return (
            <button
              onClick={() => setShowDeliverModal(true)}
              disabled={actionLoading}
              className={buttonClasses.primary}
            >
              <Upload className="w-5 h-5" />
              上传交付作品
            </button>
          );
        case 3:
          return (
            <div className={buttonClasses.success}>
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">等待用户评价</p>
            </div>
          );
        case 4:
          return (
            <div className="space-y-4">
              {order?.rating_content ? (
                <ReviewCard review={{
                  content: order?.rating_content,
                  photoScore: order?.photo_score,
                  timeScore: order?.time_score,
                  commScore: order?.comm_score,
                  avatar: order?.customer_avatar,
                  nickname: order?.customer_name,
                  createdAt: order?.rating_time
                }} />
              ) : (
                <div className={buttonClasses.warning}>
                  <Star className="w-5 h-5" />
                  <span>暂无评价</span>
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    }
    
    // 用户视角
    else {
      switch (status) {
        case 0:
          return (
            <button
              onClick={() => handleAction('cancel')}
              disabled={actionLoading || useManageMutation.isLoading}
              className={buttonClasses.primary}
            >
              {useManageMutation.isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {useManageMutation.isLoading ? '处理中...' : '取消订单'}
            </button>
          );
        case 1:
          return (
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(true)}
                className={buttonClasses.primary}
              >
                <DollarSign className="w-5 h-5" />
                立即支付
              </button>
              <button
                onClick={() => handleAction('cancel')}
                disabled={actionLoading || useManageMutation.isLoading}
                className={buttonClasses.secondary}
              >
                {useManageMutation.isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {useManageMutation.isLoading ? '处理中...' : '取消订单'}
              </button>
            </div>
          );
        case 2:
          return (
            <div className={buttonClasses.purple}>
              <Package className="w-5 h-5" />
              <p className="font-medium">等待摄影师交付</p>
            </div>
          );
         case 3: // 已完成状态 - 显示评价按钮
      return (
        <div className="space-y-4">
          {/* 显示评价按钮 - 当用户还未评价时 */}
          {!order.rating_content && (
            <button
              onClick={() => setShowReviewModal(true)}
              disabled={actionLoading || commentLoading}
              className={buttonClasses.primary}
            >
              {commentLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Star className="w-5 h-5" />
              )}
              {commentLoading ? '提交中...' : '去评价'}
            </button>
          )}
          
          {/* 显示交付作品 */}
          {order.deliver_url && order.deliver_url.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-500" />
                交付作品
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {order.deliver_url.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-orange-100 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  >
                    <img src={url} alt={`作品${index + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    case 4: // 已评价状态 - 显示评价内容
      return (
        <div className="space-y-4">
          {/* 显示交付作品 */}
          {order.deliver_url && order.deliver_url.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-500" />
                交付作品
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {order.deliver_url.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-orange-100 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  >
                    <img src={url} alt={`作品${index + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* 显示评价内容 */}
          {order.rating_content && (
            <ReviewCard review={{
              content: order.rating_content,
              photoScore: order.photo_score,
              timeScore: order.time_score,
              commScore: order.comm_score,
              avatar: order.photographer_avatar,
              nickname: order.photographer_name,
              createdAt: order.rating_time
            }} />
          )}
        </div>
      );
        default:
          return null;
      }
    }
  };

  if (loading || !userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">订单不存在</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusMap[order.status]?.icon || AlertCircle;
  const isNegative = order.status < 0;
  
  const pageBgColor = isNegative 
    ? 'bg-gradient-to-br from-gray-50 to-gray-100' 
    : 'bg-gradient-to-br from-orange-50 to-white';
  
  const cardBorderColor = isNegative ? 'border-gray-300' : 'border-orange-400';
  const iconBgColor = isNegative ? 'bg-gray-200' : 'bg-orange-100';
  const iconColor = isNegative ? 'text-gray-600' : 'text-orange-600';

  return (
    <div className={`min-h-screen ${pageBgColor} pb-20 transition-colors duration-300`}>
      {/* 返回按钮 */}
      <div className={`sticky top-0 z-10 backdrop-blur-md border-b ${
        isNegative ? 'bg-gray-100/80 border-gray-200' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-3xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 py-4 transition-colors ${
              isNegative ? 'text-gray-600 hover:text-gray-800' : 'text-gray-600 hover:text-orange-500'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        </div>
      </div>
      

      <div className="max-w-3xl mx-auto px-4 py-6">
        
        {/* 订单状态卡片 */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 ${cardBorderColor} ${
          isNegative ? 'shadow-gray-200' : ''
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${iconBgColor}`}>
                <StatusIcon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  订单 #{order.order_id}
                </h1>
                <p className="text-sm text-gray-500">
                  创建于 {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
              statusMap[order.status]?.color || 'bg-gray-500'
            }`}>
              {statusMap[order.status]?.text || '未知状态'}
            </span>
          </div>
          {console.log('当前角色',userRole === 'photographer' ? '摄影师' : userRole === 'customer' ? '客户' : '其他')}
        </div>
        
        {/* 客户/摄影师信息卡片 */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 ${
          isNegative ? 'shadow-gray-200' : ''
        }`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            isNegative ? 'text-gray-700' : 'text-gray-900'
          }`}>
            <User className={`w-5 h-5 ${isNegative ? 'text-gray-500' : 'text-orange-500'}`} />
            {userRole === 'photographer' ? '客户信息' : '摄影师信息'}
          </h2>
          
          <div className="flex items-center gap-4">
            <img
              src={userRole === 'photographer' ? order.customer_avatar : order.photographer_avatar}
              alt={userRole === 'photographer' ? order.customer_name : order.photographer_name}
              className={`w-16 h-16 rounded-full object-cover border-3 ${
                isNegative ? 'border-gray-300' : 'border-orange-200'
              }`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg text-start font-semibold text-gray-900">
                {userRole === 'photographer' ? order.customer_name : order.photographer_name}
              </h3>
              <p className="text-sm text-gray-500 text-start">
                ID: {userRole === 'photographer' ? order.customer_id : order.photographer_id}
              </p>
              {order.contact_info && (
                <p className="text-sm text-gray-500 text-start mt-1">
                  联系方式: {order.contact_info}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 订单信息卡片 */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 ${
          isNegative ? 'shadow-gray-200' : ''
        }`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            isNegative ? 'text-gray-700' : 'text-gray-900'
          }`}>
            <Package className={`w-5 h-5 ${isNegative ? 'text-gray-500' : 'text-orange-500'}`} />
            订单信息
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Camera className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className="text-sm">类型: {order.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className="text-sm">{order.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className="text-sm">拍摄时间: {formatDate(order.shoot_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className="text-sm">拍摄时长: {order.duration}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className="text-sm">拍摄人数: {order.subject_count}人</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className={`text-sm font-semibold ${
                  isNegative ? 'text-gray-600' : 'text-orange-600'
                }`}>
                  总价: ¥{order?.price?.toFixed(2)||'0.00'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Video className={`w-4 h-4 ${isNegative ? 'text-gray-400' : 'text-orange-400'}`} />
                <span className="text-sm">
                  专业设备: {order.need_equipment ? '需要' : '不需要'}
                </span>
              </div>
            </div>
          </div>

          {order.remark && order.remark !== '无' && (
            <div className={`mt-4 p-4 rounded-xl ${
              isNegative ? 'bg-gray-50' : 'bg-orange-50'
            }`}>
              <p className="text-sm text-gray-700">
                <span className={`font-medium ${
                  isNegative ? 'text-gray-700' : 'text-orange-700'
                }`}>备注：</span>
                {order.remark}
              </p>
            </div>
          )}
        </div>

        {/* 操作按钮区域 */}
        <div className="bottom-6 z-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200">
            {getActionButtons()}
          </div>
        </div>
      </div>

      {/* 支付模态框 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">确认支付</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">订单金额</span>
                <span className="text-2xl font-bold text-orange-600">
                  ¥{order.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                请确认订单信息无误后完成支付
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleAction('pay')}
                disabled={actionLoading || useManageMutation.isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {useManageMutation.isLoading ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  '确认支付'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 交付上传模态框 */}
      {showDeliverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">上传交付作品</h3>
            
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                已选择 {deliverImages.length} / {MAX_IMAGES} 张
              </p>
              {deliverImages.length >= MAX_IMAGES && (
                <p className="text-sm text-orange-500 font-medium">
                  已达到上传上限
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className={`block w-full aspect-video border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                deliverImages.length >= MAX_IMAGES
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-orange-300 hover:border-orange-500 bg-orange-50/50'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={deliverImages.length >= MAX_IMAGES}
                />
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Upload className={`w-12 h-12 mb-2 ${
                    deliverImages.length >= MAX_IMAGES ? 'text-gray-400' : 'text-orange-400'
                  }`} />
                  <p className={`font-medium ${
                    deliverImages.length >= MAX_IMAGES ? 'text-gray-400' : 'text-orange-600'
                  }`}>
                    {deliverImages.length >= MAX_IMAGES 
                      ? '已达到上传上限' 
                      : '点击或拖拽上传图片'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    支持多张图片上传，最多 {MAX_IMAGES} 张
                  </p>
                </div>
              </label>
            </div>

            {deliverImages.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">已选择 {deliverImages.length} 张图片</h4>
                <div className="grid grid-cols-4 gap-3">
                  {deliverImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full aspect-square rounded-lg object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeliverModal(false);
                  deliverImages.forEach(img => URL.revokeObjectURL(img.preview));
                  setDeliverImages([]);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleAction('deliver')}
                disabled={actionLoading || useManageMutation.isLoading || deliverImages.length === 0}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {useManageMutation.isLoading ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  `确认交付 (${deliverImages.length}张)`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 评价模态框 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">评价订单</h3>
            
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  摄影质量
                </label>
                <RatingStars
                  value={review.photoScore}
                  onChange={(value) => setReview(prev => ({ ...prev, photoScore: value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  准时程度
                </label>
                <RatingStars
                  value={review.timeScore}
                  onChange={(value) => setReview(prev => ({ ...prev, timeScore: value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  沟通效率
                </label>
                <RatingStars
                  value={review.commScore}
                  onChange={(value) => setReview(prev => ({ ...prev, commScore: value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评价内容
                </label>
                <textarea
                  value={review.content}
                  onChange={(e) => setReview(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="分享您的拍摄体验..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReview({ photoScore: 0, timeScore: 0, commScore: 0, content: '' });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={actionLoading || commentLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {commentLoading ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  '提交评价'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActionPage;