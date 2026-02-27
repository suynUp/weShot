// components/profile/OtherProfile.jsx
import { useEffect, useState } from 'react';
import { ProfileHeader } from '../profileHeader';
import { Pagination } from '../pagination';
import { Image, Clock } from 'lucide-react';
import { useNavigation } from '../../hooks/navigation';
import { usePagination } from '../../hooks/usePagination';
import { PostsSection } from './PostsSection';
import { TabButton } from './TabButton';
import { ProfileLoading } from './ProfileLoading';
import { PostDetail } from '../postDetail';
import postStore from '../../store/postStore';
import { useGetPostDetail } from '../../hooks/usePost';
import { CompletedOrdersSection  } from './CompleteOrderSection';
import { useGetOrderDetail } from '../../hooks/useOrder';
import { OrderDisplayStore } from '../../store/orderDisplayStore';
import { OrderDetail } from '../orderDetailCard';

export function OtherProfile({ profileData, isPhotographer, postsData, totalPostNum,
  userCompletedOrders, totalCompletedOrders, fetchPosts, fetchUserCompletedOrders }) {
  
  const { goBack } = useNavigation();
  const [activeTab, setActiveTab] = useState('posts');

  //这是post
  const [loadId,setLoadId] = useState(-1)
  const [showPostDetail,setShowPostDetail] = useState(false)
  const currentPost = postStore(state => state.currentPost)
  const useGetPostDetailMutation = useGetPostDetail()

  //这是CompleteOrder
  const [loadCompleteOrderId,setCompleteOrderLoadId] = useState(-1)
  const [showCompleteOrderDetail,setShowCompleteOrderDetail] = useState(false)
  const currentCompleteOrder = OrderDisplayStore(state => state.currentOrder)
  const useGetCompleteOrderDetailMutation = useGetOrderDetail()

  useEffect(()=>{
    if(loadId!==-1){
      useGetPostDetailMutation.mutate(loadId)
    }
  },[loadId])

  useEffect(()=>{
    console.log(showCompleteOrderDetail)
    if(loadCompleteOrderId!==-1){
      useGetCompleteOrderDetailMutation.mutate(loadCompleteOrderId)
    }
  },[loadCompleteOrderId])

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

  // 已完成订单分页
  const { 
    currentPage: completedOrdersPage, 
    totalPages: completedOrdersTotalPages, 
    loading: completedOrdersLoading,
    setCurrentPage: setCompletedOrdersPage,
  } = usePagination({
    fetchData: fetchUserCompletedOrders,
    itemsPerPage: 9,
    initialPage: 1,
    total: totalCompletedOrders,
    enabled: isPhotographer
  });

  const handlePostClick = (postId) => {
    setLoadId(postId)
    setShowPostDetail(true)
  };

  const handleOrderClick = (orderId) => {
    setCompleteOrderLoadId(orderId)
    setShowCompleteOrderDetail(true)
  }

  const showLoading = () => {
    if (activeTab === 'posts') return postsLoading;
    if (activeTab === 'completedOrders') return completedOrdersLoading;
    return false;
  };

  const getCurrentData = () => {
    if (activeTab === 'posts') return postsData;
    if (activeTab === 'completedOrders') return userCompletedOrders;
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
        onBack={() => goBack()}
        isOwnProfile={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 选项卡 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon={<Image className="w-4 h-4" />}
            label="TA的发帖"
          />
          
          {isPhotographer && (
            <TabButton
              active={activeTab === 'completedOrders'}
              onClick={() => setActiveTab('completedOrders')}
              icon={<Clock className="w-4 h-4" />}
              label="已完成订单"
            />
          )}
        </div>

        {/* 内容区域 */}
        {activeTab === 'posts' && (
          <><PostsSection
            posts={postsData}
            loading={postsLoading}
            isOwnProfile={false}
            onPostClick={handlePostClick}
            emptyMessage="TA还没有发布过帖子"
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

        {activeTab === 'completedOrders' && isPhotographer && (
          <>
          <CompletedOrdersSection
            orders={userCompletedOrders}
            loading={completedOrdersLoading}
            emptyMessage="TA还没有完成过订单"
            readOnly={true}
            onSelect={handleOrderClick}
          />
          {showCompleteOrderDetail&&
          <OrderDetail
          orderData={currentCompleteOrder}
          onClose={()=>{
            setCompleteOrderLoadId(-1)
            setShowCompleteOrderDetail(false)
          }}
          />}
          </>
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
        
        {activeTab === 'completedOrders' && userCompletedOrders.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Pagination
              currentPage={completedOrdersPage}
              totalPages={completedOrdersTotalPages}
              onPageChange={setCompletedOrdersPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}