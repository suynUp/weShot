// Profile.jsx (入口文件)
import { useProfileData } from '../hooks/userProfile';
import { MyProfile } from '../components/profile/Myprofile';
import { OtherProfile } from '../components/profile/OtherProfile';
import { ProfileLoading } from '../components/profile/ProfileLoading';

function Profile() {
  const {
    isOwnProfile,
    profileData,
    isPhotographer,
    postsData,
    totalPostNum,
    myOrdersData,
    totalOrdersNum,
    receivedOrdersData,
    totalReceivedNum,
    userCompletedOrders,
    totalCompletedOrders,
    useGetMyOrderMutation,
    useGetPostsMutation,
    useGetUserPostsMutation,
    useGetUserOrdersMutation,
    getMyAllPendings,
    casId,
    status,
    setStatus
  } = useProfileData();

  // 数据获取函数
  const fetchPosts = async (pageNum, pageSize) => {
    if (isOwnProfile) {
      useGetPostsMutation.mutate({ pageNum, pageSize });
    } else if (casId) {
      useGetUserPostsMutation.mutate({  pageNum, pageSize, casId });
    }
  };

  const fetchMyOrders = async (pageNum, pageSize) => {
    if (isOwnProfile) {
      useGetMyOrderMutation.mutate({ pageNum, pageSize,status:status==='all'?null:status });
    }
  };

  const fetchReceivedOrders = async (pageNum,pageSize) => {
    if (isOwnProfile && isPhotographer) {
      // 获取摄影师接收的订单
      getMyAllPendings(pageNum,pageSize);
    }
  };

  const fetchUserCompletedOrders = async (pageNum, pageSize) => {
    if (!isOwnProfile && isPhotographer && casId) {
      useGetUserOrdersMutation.mutate({  pageNum, pageSize,casId });
    }
  };

  if (!profileData) {
    return <ProfileLoading />;
  }

  if (isOwnProfile) {
    return (
      <MyProfile
        profileData={profileData}
        isPhotographer={isPhotographer}
        postsData={postsData}
        totalPostNum={totalPostNum}
        myOrdersData={myOrdersData}
        totalOrdersNum={totalOrdersNum}
        receivedOrdersData={receivedOrdersData}
        totalReceivedNum={totalReceivedNum}
        fetchPosts={fetchPosts}
        fetchMyOrders={fetchMyOrders}
        fetchReceivedOrders={fetchReceivedOrders}
        setStatus={setStatus}
        status={status}
      />
    );
  }

  return (
    <OtherProfile
      profileData={profileData}
      isPhotographer={isPhotographer}
      postsData={postsData}
      totalPostNum={totalPostNum}
      userCompletedOrders={userCompletedOrders}
      totalCompletedOrders={totalCompletedOrders}
      fetchPosts={fetchPosts}
      fetchUserCompletedOrders={fetchUserCompletedOrders}
    />
  );
}

export default Profile;