// Profile.jsx
import { useEffect, useState } from 'react';
import { ProfileHeader } from '../components/profileHeader';
import { OrderCard } from '../components/orderCard';
import { PostCard } from '../components/postCard';
import { Pagination } from '../components/pagination';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import ProfileEditModal from '../components/profileEditor';
import { Camera, FileText, Image, Clock, Trash2, Edit } from 'lucide-react';
import { useGetMyOrder, useGetMyPost, useUserMutation, useUserUpdate } from '../hooks/useUser';
import { UserStore } from '../store/userStore';

function Profile() {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [orderType, setOrderType] = useState('my');
  const { goto } = useNavigation();
  
  // 数据状态
  const postsData = UserStore(state => state.myPosts)
  const totalPostNum = UserStore(state=>state.totalPost)

  const myOrdersData = UserStore(state => state.myOrders)
  const totalOrdersNum = UserStore(state=>state.totalOrders)

  const receivedOrdersData = UserStore(state => state.myReceivedOrders)
  const totalReceivedNum = UserStore(state => state.totalReceived)
  
  const isPhotographer = UserStore(state=>state.isVerFied)
  const profileData = UserStore(state => state.user)

  //操作方法
  const useGetMyOrderMutation = useGetMyOrder()//获取订单
  const useGetPostsMutation = useGetMyPost()//获取帖子
  const getUserMutation = useUserMutation()//获取基础信息
  const userUpdateFn = useUserUpdate()//更新基础信息

  useEffect(()=>{
    getUserMutation.mutate()
  },[])

  // 处理保存个人信息
  const handleSaveProfile = (newProfile) => {
    userUpdateFn.mutate(newProfile);
  };

  // 我的发帖数据
  const fetchPosts = async (pageNum, pageSize) => {
    useGetPostsMutation.mutate({pageNum,pageSize})
  };

  // 模拟我发起的订单（作为客户）
  const fetchMyOrders = async (pageNum, pageSize) => {
    useGetMyOrderMutation.mutate({pageNum,pageSize})
  }

  // 模拟我接收的订单（作为摄影师）
  const fetchReceivedOrders = async (pageNum, pageSize) => {
  };

  // 帖子分页
  const { 
    currentPage: postsPage, 
    totalPages: postsTotalPages, 
    loading: postsLoading,
    setCurrentPage: setPostsPage,
    reloadCurrentPage: refreshPosts
  } = usePagination({
    fetchData: fetchPosts,
    itemsPerPage: 6,
    initialPage: 1,
    dependencies: [],
    total:totalPostNum
  });

  // 我的发起订单分页
  const { 
    currentPage: myOrdersPage, 
    totalPages: myOrdersTotalPages, 
    loading: myOrdersLoading,
    setCurrentPage: setMyOrdersPage,
    reloadCurrentPage: refreshMyOrders
  } = usePagination({
    fetchData: fetchMyOrders,
    itemsPerPage: 9,
    initialPage: 1,
    dependencies: [],
    total:totalOrdersNum
  });

  // 我的接收订单分页
  const { 
    currentPage: receivedOrdersPage, 
    totalPages: receivedOrdersTotalPages, 
    loading: receivedOrdersLoading,
    setCurrentPage: setReceivedOrdersPage,
    reloadCurrentPage: refreshReceivedOrders
  } = usePagination({
    fetchData: fetchReceivedOrders,
    itemsPerPage: 9,
    initialPage: 1,
    dependencies: [],
    total:totalReceivedNum
  });

  // 初始加载
  useEffect(() => {
    fetchPosts(1, 6);
    fetchMyOrders(1, 9);
    if (isPhotographer) {
      fetchReceivedOrders(1, 9);
    }
  }, []);

  const handlePostCheck = (id, checked) => {

  };

  // 批量删除帖子
  const handleBatchDeletePosts = async () => {

  };

  // 批量删除订单
  const handleBatchDeleteOrders = async () => {

  };

  const handlePostClick = (post) => {
    goto(`/post/${post.id}`);
  };

  const handleEditPost = (post, e) => {
    e.stopPropagation();
    goto(`/edit-post/${post.id}`);
  };

  const handleDeletePost = async (post, e) => {

  };

  // 加载状态显示
  const showLoading = (postsLoading && activeTab === 'posts') || 
                      (myOrdersLoading && activeTab === 'myOrders') || 
                      (receivedOrdersLoading && activeTab === 'receivedOrders');

  const currentData = activeTab === 'posts' ? postsData : 
                     activeTab === 'myOrders' ? myOrdersData : 
                     receivedOrdersData;

  if (showLoading && currentData.length === 0) {
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
          profile={profileData}
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
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post.id)}
                        onChange={(e) => handlePostCheck(post.id, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                    </div>
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
                    onAction={(action, order) => {
                      if (action === 'take') console.log(order);
                      if (action === 'comment') console.log(order);
                    }}
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
                    onAction={(action, order) => {
                      if (action === 'take') console.log(order);
                      if (action === 'comment') console.log(order);
                    }}
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
        profile={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

export default Profile;