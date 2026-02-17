import { useState } from 'react';
import { ProfileHeader } from '../components/profileHeader';
import { OrderCard } from '../components/orderCard';
import { Pagination } from '../components/pagination';
import { useNavigation } from '../hooks/navigation';
import { usePagination } from '../hooks/usePagination';
import ProfileEditModal from '../components/profileEditor'; // 引入弹窗组件

function Profile() {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { goto } = useNavigation();
  
  const mockProfile = {
    id: '1',
    username: '叮咚鸡',
    user_id: '101010',
    avatar_url: null
  };

  // 用户个人信息
  const [userProfile, setUserProfile] = useState({
    nickname: "析阳",
    avatarUrl: "https://avatars.githubusercontent.com/u/68357909",
    sex: 1,
    phone: "42654087011",
    detail: "sed",
    photographer: {
      style: "ut",
      equipment: "veniam eiusmod",
      type: "incididunt consectetur qui"
    }
  });

  // 处理保存个人信息
  const handleSaveProfile = (newProfile) => {
    setUserProfile(newProfile);
    // 这里可以调用API保存到后端
    console.log('Saving profile:', newProfile);
  };

  // 模拟异步获取数据的函数
  const fetchOrders = async (pageNum, pageSize) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const allData = [
      { id: '1', user_name: '用户1', status: '对接中', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 1, nickname: '析阳', created_at: '2026-02-08T15:18:42', type: 1 },
      { id: '2', user_name: '用户2', status: '已完成', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 2, nickname: '析阳', created_at: '2026-02-10T01:34:18', type: 2 },
      { id: '3', user_name: '用户3', status: '待接单', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 3, nickname: '析阳', created_at: '2026-02-11T17:42:46', type: 2 },
      { id: '4', user_name: '用户4', status: '对接中', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 4, nickname: '用户4', created_at: '2026-02-12T10:00:00', type: 1 },
      { id: '5', user_name: '用户5', status: '对接中', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 5, nickname: '用户5', created_at: '2026-02-12T11:00:00', type: 1 },
      { id: '6', user_name: '用户6', status: '待接单', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 6, nickname: '用户6', created_at: '2026-02-12T12:00:00', type: 2 },
      { id: '7', user_name: '用户7', status: '待接单', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 7, nickname: '用户7', created_at: '2026-02-12T13:00:00', type: 2 },
      { id: '8', user_name: '用户8', status: '待接单', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 8, nickname: '用户8', created_at: '2026-02-12T14:00:00', type: 2 },
      { id: '9', user_name: '用户9', status: '对接中', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 9, nickname: '用户9', created_at: '2026-02-12T15:00:00', type: 1 },
      { id: '10', user_name: '用户10', status: '已完成', description: '毕业季帮拍，需自带设备。', has_budget: true, post_id: 10, nickname: '用户10', created_at: '2026-02-12T16:00:00', type: 3 },
    ];
    
    return {
      data: {
        total: allData.length,
        list: allData.slice(start, end)
      }
    };
  };

  const { 
    currentPage, 
    totalPages, 
    paginatedData,
    loading,
    error,
    setCurrentPage,
    refresh
  } = usePagination({
    fetchData: fetchOrders,
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

  // 加载状态显示
  if (loading && paginatedData.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  // 错误状态显示
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">加载失败: {error}</p>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30" />

      <div className="relative z-10">
        <ProfileHeader
          profile={mockProfile}
          onBack={() => goto('/')}
          onEdit={() => setIsEditModalOpen(true)} // 打开编辑弹窗
          onAvatarClick={() => console.log('Avatar clicked')}
        />

        <div className="max-w-7xl min-h-[50%] mx-auto px-10 p-20 rounded-2xl bg-white/40 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-shadow relative">          
          <div className="grid grid-cols-3 gap-6">
            {paginatedData.map((order) => (
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
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center rounded-2xl">
              <div className="text-gray-600">加载中...</div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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