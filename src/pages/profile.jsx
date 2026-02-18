import { useState } from 'react';
import { ProfileHeader } from '../components/profileHeader';
import { OrderCard } from '../components/orderCard';
import { PostCard } from '../components/postCard';
import { Pagination } from '../components/pagination';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import ProfileEditModal from '../components/profileEditor';
import { Camera, User, Phone, MapPin, Calendar, Award, Settings, LogOut, FileText, Image, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Edit } from 'lucide-react';

function Profile() {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'myOrders', 'receivedOrders'
  const [orderType, setOrderType] = useState('my'); // 'my' 或 'received'，用于区分订单类型
  const { goto } = useNavigation();
  
  // 模拟用户身份（实际应从后端获取）
  const [isPhotographer, setIsPhotographer] = useState(false); // 是否是摄影师

  const mockProfile = {
    id: '1',
    username: '叮咚鸡',
    user_id: '101010',
    avatar_url: null
  };

  // 用户个人信息 - 添加了用户类型和简介
  const [userProfile, setUserProfile] = useState({
    nickname: "析阳",
    avatarUrl: "https://avatars.githubusercontent.com/u/68357909",
    sex: 1,
    phone: "42654087011",
    bio: "热爱摄影，擅长人像和风景摄影，希望能记录下每一个美好瞬间", // 个人简介
    detail: "sed",
    joinDate: "2024-01-15",
    location: "北京",
    userType: "photographer", // 'photographer' 或 'normal'
    stats: {
      totalOrders: 128,      // 总订单数
      completedOrders: 96,   // 已完成订单数
      satisfaction: 98,      // 满意度
      totalPosts: 15,        // 总发帖数
      followers: 234,        // 粉丝数
      following: 89          // 关注数
    },
    photographer: {
      style: "人像摄影、风景摄影",
      equipment: "Sony A7M4, 24-70mm F2.8, 70-200mm F4",
      type: "职业摄影师"
    }
  });

  // 处理保存个人信息
  const handleSaveProfile = (newProfile) => {
    setUserProfile(newProfile);
    console.log('Saving profile:', newProfile);
  };

  // 模拟我的发帖数据
  const fetchPosts = async (pageNum, pageSize) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const allData = [
      { 
        id: '1', 
        title: '毕业季摄影作品集',
        content: '又是一年毕业季，记录下校园里的美好瞬间。有需要毕业照的同学可以联系我~',
        cover_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
        likes_count: 45,
        views_count: 234,
        comments_count: 12,
        created_at: '2026-02-15T10:30:00',
        photographers: {
          name: userProfile.nickname,
          avatar_url: userProfile.avatarUrl,
          bio: userProfile.bio
        }
      },
      { 
        id: '2', 
        title: '城市夜景拍摄',
        content: '分享一组城市夜景照片，拍摄于济南泉城广场。',
        cover_image_url: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb',
        likes_count: 32,
        views_count: 156,
        comments_count: 8,
        created_at: '2026-02-10T20:15:00',
        photographers: {
          name: userProfile.nickname,
          avatar_url: userProfile.avatarUrl,
          bio: userProfile.bio
        }
      },
      { 
        id: '3', 
        title: '人像摄影技巧分享',
        content: '分享一些人像摄影的小技巧，包括构图、光线运用等。',
        cover_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        likes_count: 67,
        views_count: 412,
        comments_count: 23,
        created_at: '2026-02-05T14:20:00',
        photographers: {
          name: userProfile.nickname,
          avatar_url: userProfile.avatarUrl,
          bio: userProfile.bio
        }
      },
      { 
        id: '4', 
        title: '校园风光摄影',
        content: '记录山东大学软件园校区的四季美景。',
        cover_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
        likes_count: 28,
        views_count: 134,
        comments_count: 5,
        created_at: '2026-02-01T09:45:00',
        photographers: {
          name: userProfile.nickname,
          avatar_url: userProfile.avatarUrl,
          bio: userProfile.bio
        }
      },
      { 
        id: '5', 
        title: '活动跟拍案例',
        content: '公司年会、婚礼跟拍等活动现场记录。',
        cover_image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        likes_count: 19,
        views_count: 98,
        comments_count: 3,
        created_at: '2026-01-28T16:30:00',
        photographers: {
          name: userProfile.nickname,
          avatar_url: userProfile.avatarUrl,
          bio: userProfile.bio
        }
      }
    ];
    
    return {
      data: {
        total: allData.length,
        list: allData.slice(start, end)
      }
    };
  };

  // 模拟我发起的订单（作为客户）
  const fetchMyOrders = async (pageNum, pageSize) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const allData = [
      { id: '1', user_name: '摄影师小明', status: '对接中', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 1, nickname: '小明摄影', created_at: '2026-02-08T15:18:42', type: 1, role: 'customer' },
      { id: '2', user_name: '摄影师小红', status: '已完成', description: '情侣写真拍摄', has_budget: true, post_id: 2, nickname: '小红工作室', created_at: '2026-02-10T01:34:18', type: 2, role: 'customer' },
      { id: '3', user_name: '摄影师小李', status: '待接单', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 3, nickname: '小李摄影', created_at: '2026-02-11T17:42:46', type: 2, role: 'customer' },
      { id: '4', user_name: '摄影师小王', status: '对接中', description: '产品拍摄需求', has_budget: true, post_id: 4, nickname: '王老师', created_at: '2026-02-12T10:00:00', type: 1, role: 'customer' },
      { id: '5', user_name: '摄影师小张', status: '已完成', description: '家庭写真', has_budget: true, post_id: 5, nickname: '小张摄影', created_at: '2026-02-12T11:00:00', type: 3, role: 'customer' }
    ];
    
    return {
      data: {
        total: allData.length,
        list: allData.slice(start, end)
      }
    };
  };

  // 模拟我接收的订单（作为摄影师）
  const fetchReceivedOrders = async (pageNum, pageSize) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const allData = [
      { id: '101', user_name: '客户小赵', status: '对接中', description: '毕业照拍摄需求', has_budget: true, post_id: 101, nickname: '赵同学', created_at: '2026-02-09T14:20:00', type: 1, role: 'photographer' },
      { id: '102', user_name: '客户小钱', status: '已完成', description: '婚礼跟拍', has_budget: true, post_id: 102, nickname: '钱女士', created_at: '2026-02-07T09:30:00', type: 2, role: 'photographer' },
      { id: '103', user_name: '客户小孙', status: '待接单', description: '产品拍摄', has_budget: true, post_id: 103, nickname: '孙先生', created_at: '2026-02-13T11:15:00', type: 2, role: 'photographer' },
      { id: '104', user_name: '客户小李', status: '对接中', description: '活动跟拍', has_budget: true, post_id: 104, nickname: '李经理', created_at: '2026-02-12T16:40:00', type: 1, role: 'photographer' },
      { id: '105', user_name: '客户小周', status: '已完成', description: '宠物摄影', has_budget: true, post_id: 105, nickname: '周女士', created_at: '2026-02-05T13:25:00', type: 3, role: 'photographer' }
    ];
    
    return {
      data: {
        total: allData.length,
        list: allData.slice(start, end)
      }
    };
  };

  // 使用不同的分页hook
  const { 
    currentPage: postsPage, 
    totalPages: postsTotalPages, 
    paginatedData: postsData,
    loading: postsLoading,
    // error: postsError,
    setCurrentPage: setPostsPage,
    refresh: refreshPosts
  } = usePagination({
    fetchData: fetchPosts,
    itemsPerPage: 6,
    initialPage: 1,
  });

  const { 
    currentPage: myOrdersPage, 
    totalPages: myOrdersTotalPages, 
    paginatedData: myOrdersData,
    loading: myOrdersLoading,
    error: myOrdersError,
    setCurrentPage: setMyOrdersPage,
    refresh: refreshMyOrders
  } = usePagination({
    fetchData: fetchMyOrders,
    itemsPerPage: 9,
    initialPage: 1,
  });

  const { 
    currentPage: receivedOrdersPage, 
    totalPages: receivedOrdersTotalPages, 
    paginatedData: receivedOrdersData,
    loading: receivedOrdersLoading,
    error: receivedOrdersError,
    setCurrentPage: setReceivedOrdersPage,
    refresh: refreshReceivedOrders
  } = usePagination({
    fetchData: fetchReceivedOrders,
    itemsPerPage: 9,
    initialPage: 1,
  });

  const handleOrderCheck = (id, checked) => {
    setSelectedOrders(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  const handlePostCheck = (id, checked) => {
    setSelectedPosts(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  // 批量删除帖子
  const handleBatchDeletePosts = async () => {
    if (selectedPosts.size === 0) return;
    
    if (window.confirm(`确定要删除选中的 ${selectedPosts.size} 篇帖子吗？`)) {
      try {
        // 这里调用删除API
        console.log('Deleting posts:', Array.from(selectedPosts));
        // 删除成功后刷新列表
        await refreshPosts();
        setSelectedPosts(new Set());
      } catch (error) {
        console.error('Failed to delete posts:', error);
      }
    }
  };

  // 批量删除订单
  const handleBatchDeleteOrders = async () => {
    if (selectedOrders.size === 0) return;
    
    if (window.confirm(`确定要删除选中的 ${selectedOrders.size} 个订单吗？`)) {
      try {
        // 这里调用删除API
        console.log('Deleting orders:', Array.from(selectedOrders));
        // 删除成功后刷新对应的列表
        if (activeTab === 'myOrders') {
          await refreshMyOrders();
        } else if (activeTab === 'receivedOrders') {
          await refreshReceivedOrders();
        }
        setSelectedOrders(new Set());
      } catch (error) {
        console.error('Failed to delete orders:', error);
      }
    }
  };

  const handlePostClick = (post) => {
    goto(`/post/${post.id}`);
  };

  const handleEditPost = (post, e) => {
    e.stopPropagation();
    goto(`/edit-post/${post.id}`);
  };

  const handleDeletePost = async (post, e) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除帖子 "${post.title}" 吗？`)) {
      try {
        // 这里调用删除API
        console.log('Deleting post:', post.id);
        await refreshPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  // 获取当前显示的订单数据
  const getCurrentOrders = () => {
    if (orderType === 'my') {
      return {
        data: myOrdersData,
        loading: myOrdersLoading,
        error: myOrdersError,
        page: myOrdersPage,
        totalPages: myOrdersTotalPages,
        setPage: setMyOrdersPage,
        refresh: refreshMyOrders
      };
    } else {
      return {
        data: receivedOrdersData,
        loading: receivedOrdersLoading,
        error: receivedOrdersError,
        page: receivedOrdersPage,
        totalPages: receivedOrdersTotalPages,
        setPage: setReceivedOrdersPage,
        refresh: refreshReceivedOrders
      };
    }
  };

  // const currentOrders = getCurrentOrders();

  // 加载状态显示
  const showLoading = (postsLoading && activeTab === 'posts') || 
                      (myOrdersLoading && activeTab === 'myOrders') || 
                      (receivedOrdersLoading && activeTab === 'receivedOrders');

  if (showLoading && 
      ((activeTab === 'posts' && postsData.length === 0) ||
       (activeTab === 'myOrders' && myOrdersData.length === 0) ||
       (activeTab === 'receivedOrders' && receivedOrdersData.length === 0))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <Camera className="w-8 h-8 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-lg text-gray-600 mt-4">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <ProfileHeader
          profile={mockProfile}
          onBack={() => goto('/')}
          onEdit={() => setIsEditModalOpen(true)}
          onAvatarClick={() => console.log('Avatar clicked')}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 选项卡 */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              <Image className="w-4 h-4" />
              我的发帖
            </button>
            
            {isPhotographer ? (
              // 摄影师：区分我的发起和我的接收
              <>
                <button
                  onClick={() => {
                    setActiveTab('myOrders');
                    setOrderType('my');
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'myOrders' && orderType === 'my'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                      : 'bg-white/70 text-gray-600 hover:bg-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  我的发起
                </button>
                <button
                  onClick={() => {
                    setActiveTab('receivedOrders');
                    setOrderType('received');
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'receivedOrders' && orderType === 'received'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                      : 'bg-white/70 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  我的接收
                </button>
              </>
            ) : (
              // 普通用户：只显示我的订单
              <button
                onClick={() => setActiveTab('myOrders')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'myOrders'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                我的订单
              </button>
            )}
          </div>

          {/* 批量操作栏 */}
          {(activeTab === 'posts' && selectedPosts.size > 0) && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 <span className="font-bold text-orange-600">{selectedPosts.size}</span> 项
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBatchDeletePosts}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  批量删除
                </button>
                <button
                  onClick={() => setSelectedPosts(new Set())}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  取消选择
                </button>
              </div>
            </div>
          )}

          {(activeTab !== 'posts' && selectedOrders.size > 0) && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 <span className="font-bold text-orange-600">{selectedOrders.size}</span> 项
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBatchDeleteOrders}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  批量删除
                </button>
                <button
                  onClick={() => setSelectedOrders(new Set())}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  取消选择
                </button>
              </div>
            </div>
          )}

          {/* 内容区域 */}
          {activeTab === 'posts' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsData.map((post) => (
                  <div key={post.id} className="relative group">
                    <PostCard
                      post={post}
                      onClick={() => handlePostClick(post)}
                    />
                    {/* 复选框 */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post.id)}
                        onChange={(e) => handlePostCheck(post.id, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    {/* 操作按钮 */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => handleEditPost(post, e)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePost(post, e)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 加载中的覆盖层 */}
              {postsLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-3xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-gray-600">加载中...</span>
                  </div>
                </div>
              )}

              {/* 空状态 */}
              {postsData.length === 0 && !postsLoading && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                    <Image className="w-10 h-10 text-orange-400" />
                  </div>
                  <p className="text-gray-500 mb-2">暂无发帖</p>
                  <button 
                    onClick={() => goto('/create-post')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                  >
                    发布第一篇帖子
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'myOrders' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOrdersData.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    checked={selectedOrders.has(order.id)}
                    onCheck={handleOrderCheck}
                    onStatusClick={(order) => console.log('Status clicked', order)}
                  />
                ))}
              </div>
              
              {/* 加载中的覆盖层 */}
              {myOrdersLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-3xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-gray-600">加载中...</span>
                  </div>
                </div>
              )}

              {/* 空状态 */}
              {myOrdersData.length === 0 && !myOrdersLoading && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-orange-400" />
                  </div>
                  <p className="text-gray-500 mb-2">暂无发起的订单</p>
                  <button 
                    onClick={() => goto('/create-order')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                  >
                    发布新订单
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'receivedOrders' && isPhotographer && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receivedOrdersData.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    checked={selectedOrders.has(order.id)}
                    onCheck={handleOrderCheck}
                    onStatusClick={(order) => console.log('Status clicked', order)}
                  />
                ))}
              </div>
              
              {/* 加载中的覆盖层 */}
              {receivedOrdersLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-3xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <span className="text-gray-600">加载中...</span>
                  </div>
                </div>
              )}

              {/* 空状态 */}
              {receivedOrdersData.length === 0 && !receivedOrdersLoading && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                    <Clock className="w-10 h-10 text-orange-400" />
                  </div>
                  <p className="text-gray-500 mb-2">暂无接收的订单</p>
                  <p className="text-xs text-gray-400">前往接单广场接单吧</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 分页 */}
        {activeTab === 'posts' && postsData.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Pagination
              currentPage={postsPage}
              totalPages={postsTotalPages}
              onPageChange={setPostsPage}
            />
          </div>
        )}
        
        {activeTab === 'myOrders' && myOrdersData.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Pagination
              currentPage={myOrdersPage}
              totalPages={myOrdersTotalPages}
              onPageChange={setMyOrdersPage}
            />
          </div>
        )}
        
        {activeTab === 'receivedOrders' && receivedOrdersData.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Pagination
              currentPage={receivedOrdersPage}
              totalPages={receivedOrdersTotalPages}
              onPageChange={setReceivedOrdersPage}
            />
          </div>
        )}
      </div>

      {/* 编辑个人信息弹窗 */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={userProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

export default Profile;