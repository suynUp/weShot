// components/profile/MyProfile.jsx
import { useEffect, useState } from 'react';
import { ProfileHeader } from '../profileHeader';
import { TabButton } from './TabButton';
import { PostsSection } from './PostsSection';
import { OrdersSection } from './OrderSection';
import { BatchActionBar } from './BatchActionBar'
import { ProfileLoading } from './ProfileLoading';
import { Pagination } from '../pagination';
import ProfileEditModal from '../profileEditor';
import { FileText, Image, Clock } from 'lucide-react';
import { useNavigation } from '../../hooks/navigation';
import { usePagination } from '../../hooks/usePagination';
import { useLogOut } from '../../hooks/useUser';
import { PostDetail } from '../postDetail';
import postStore from '../../store/postStore';
import { useDeletePost, useGetPostDetail } from '../../hooks/usePost';

export function MyProfile({ profileData, isPhotographer, postsData, totalPostNum, 
  myOrdersData, totalOrdersNum, receivedOrdersData, totalReceivedNum,
  fetchPosts, fetchMyOrders, fetchReceivedOrders,setStatus,status }) {
  
  const { goto } = useNavigation();
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [orderType, setOrderType] = useState('my');

  const [loadId,setLoadId] = useState(-1)
  const [showPostDetail,setShowPostDetail] = useState(false)
  const currentPost = postStore(state => state.currentPost)
  const useGetPostDetailMutation = useGetPostDetail()

  const LogOut = useLogOut()
  const useDeletePostMutation = useDeletePost()

  useEffect(()=>{
    if(loadId!==-1){
        useGetPostDetailMutation.mutate(loadId)
    }
  },[loadId])
  // 帖子分页
  const { 
    currentPage: postsPage, 
    totalPages: postsTotalPages, 
    loading: postsLoading,
    setCurrentPage: setPostsPage,
  } = usePagination({
    fetchData: fetchPosts,
    itemsPerPage: 6,
    initialPage: 1,
    total: totalPostNum
  });

  // 发起订单分页
  const { 
    currentPage: myOrdersPage, 
    totalPages: myOrdersTotalPages, 
    loading: myOrdersLoading,
    setCurrentPage: setMyOrdersPage,
  } = usePagination({
    fetchData: fetchMyOrders,
    itemsPerPage: 9,
    initialPage: 1,
    total: totalOrdersNum,
    dependencies:[status]
  });

  // 接收订单分页
  const { 
    currentPage: receivedOrdersPage, 
    totalPages: receivedOrdersTotalPages, 
    loading: receivedOrdersLoading,
    setCurrentPage: setReceivedOrdersPage,
  } = usePagination({
    fetchData: fetchReceivedOrders,
    itemsPerPage: 9,
    initialPage: 1,
    total: totalReceivedNum,
    dependencies: [isPhotographer]
  });

  const handlePostCheck = (id, checked) => {
    const newSelected = new Set(selectedPosts);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedPosts(newSelected);
  };

  const handlePostClick = (postId) => {
    setLoadId(postId)
    setShowPostDetail(true)
  };

  const handlePostDelete = (postId) => {
    useDeletePostMutation.mutate(postId)
  }

  const showLoading = () => {
    if (activeTab === 'posts') return postsLoading;
    if (activeTab === 'myOrders') return myOrdersLoading;
    if (activeTab === 'receivedOrders') return receivedOrdersLoading;
    return false;
  };

  const getCurrentData = () => {
    if (activeTab === 'posts') return postsData;
    if (activeTab === 'myOrders') return myOrdersData;
    if (activeTab === 'receivedOrders') return receivedOrdersData;
    return [];
  };

  const isLoading = showLoading();
  const currentData = getCurrentData();

  if (isLoading && currentData.length === 0) {
    return <ProfileLoading />;
  }

  return (
    <div className="relative z-10">
      <ProfileHeader
        profile={profileData}
        onBack={() => goto('/')}
        onEdit={() => setIsEditModalOpen(true)}
        logOut={() => LogOut()}
        isOwnProfile={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 选项卡 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon={<Image className="w-4 h-4" />}
            label="我的发帖"
          />
          
          {isPhotographer ? (
            <>
              <TabButton
                active={activeTab === 'myOrders' && orderType === 'my'}
                onClick={() => {
                  setActiveTab('myOrders');
                  setOrderType('my');
                }}
                icon={<FileText className="w-4 h-4" />}
                label="我的发起"
              />
              <TabButton
                active={activeTab === 'receivedOrders' && orderType === 'received'}
                onClick={() => {
                  setActiveTab('receivedOrders');
                  setOrderType('received');
                }}
                icon={<Clock className="w-4 h-4" />}
                label="待处理订单"
                toastNum={receivedOrdersData.length}
              />
            </>
          ) : (
            <TabButton
              active={activeTab === 'myOrders'}
              onClick={() => setActiveTab('myOrders')}
              icon={<FileText className="w-4 h-4" />}
              label="我的订单"
            />
          )}
        </div>

        {/* 批量操作栏 */}
        {activeTab === 'posts' && selectedPosts.size > 0 && (
          <BatchActionBar
            count={selectedPosts.size}
            onDelete={() => {}}
            onCancel={() => setSelectedPosts(new Set())}
          />
        )}

        {activeTab !== 'posts' && selectedOrders.size > 0 && (
          <BatchActionBar
            count={selectedOrders.size}
            onDelete={() => {}}
            onCancel={() => setSelectedOrders(new Set())}
          />
        )}

        {/* 内容区域 */}
        {activeTab === 'posts' && (
            <>
          <PostsSection
            posts={postsData}
            loading={postsLoading}
            isOwnProfile={true}
            selectedPosts={selectedPosts}
            onPostCheck={handlePostCheck}
            onPostClick={handlePostClick}
            onDeletePost={handlePostDelete}
            onNewPost={() => goto('/postpublish')}
          />
          {showPostDetail&&<PostDetail
            listItem={currentPost}
            onClose={()=>{
                setLoadId(-1)
                setShowPostDetail(false)
            }}
          />}
          </>
        )}

        {activeTab === 'myOrders' && (
          <OrdersSection
            filter={true}
            setStatus={setStatus}
            selectedStatus={status}
            orders={myOrdersData}
            loading={myOrdersLoading}
            emptyMessage="暂无发起的订单"
            emptyAction={
              <button 
                onClick={() => goto('/launch')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
              >
                发布新订单
              </button>
            }
          />
        )}

        {activeTab === 'receivedOrders' && isPhotographer && (
          <OrdersSection
            orders={receivedOrdersData}
            loading={receivedOrdersLoading}
            emptyMessage="暂无待接收订单"
            emptyHint="前往接单广场接单吧"
          />
        )}

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

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profileData}
        onSave={() => {}}
      />
    </div>
  );
}