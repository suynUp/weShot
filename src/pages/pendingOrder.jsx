import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Users, DollarSign, 
  Camera, Phone, MessageSquare, User,
  CheckCircle, XCircle, AlertCircle, Filter,
  Search, Star, ChevronDown, Package, Wrench, Image, BookOpen,
  ChevronLeft
} from 'lucide-react';

import OrderCard from '../components/orderSquareCard';
import { useNavigation } from '../hooks/navigation';
// 主页面组件 - 接单广场
function PhotographerOrderSquare() {
  // 模拟订单数据
  const orders = [
    {
      "payment_status": 0,
      "shoot_time": "2026-09-16T14:00:32",
      "created_at": "2026-02-15T20:31:41",
      "remark": "希望拍摄毕业照，需要拍摄图书馆和操场两个场景，最好能提供学士服",
      "contact_info": "15212341234",
      "type": "毕业照",
      "photographer_id": 202300141034,
      "customerName": "析阳",
      "duration": "3h",
      "subject_count": 2,
      "customerAvatar": "https://avatars.githubusercontent.com/u/68357909",
      "price": 100.00,
      "need_equipment": true,
      "location": "山东大学软件园校区",
      "customer_id": 202300141034,
      "order_id": 16,
      "status": 0
    },
    {
      "payment_status": 0,
      "shoot_time": "2026-09-20T10:00:00",
      "created_at": "2026-02-16T09:15:22",
      "remark": "需要拍摄活动记录，大概有50人参加，需要抓拍精彩瞬间",
      "contact_info": "13812345678",
      "type": "活动记录",
      "photographer_id": 0,
      "customerName": "李明",
      "duration": "4h",
      "subject_count": 50,
      "customerAvatar": "https://avatars.githubusercontent.com/u/12345678",
      "price": 800.00,
      "need_equipment": true,
      "location": "济南国际会展中心",
      "customer_id": 202300141035,
      "order_id": 17,
      "status": 0
    },
    {
      "payment_status": 1,
      "shoot_time": "2026-09-18T15:30:00",
      "created_at": "2026-02-14T14:20:10",
      "remark": "无",
      "contact_info": "18912345678",
      "type": "人物写真",
      "photographer_id": 0,
      "customerName": "王芳",
      "duration": "2h",
      "subject_count": 1,
      "customerAvatar": "https://avatars.githubusercontent.com/u/87654321",
      "price": 300.00,
      "need_equipment": false,
      "location": "泉城广场",
      "customer_id": 202300141036,
      "order_id": 18,
      "status": 2
    }
  ];

  // 筛选和搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const {goto} = useNavigation()

  // 获取所有拍摄类型用于筛选
  const types = ['all', ...new Set(orders.map(o => o.type))];

  // 筛选订单（只显示待接单的订单）
  const availableOrders = orders.filter(order => order.status === 0);
  
  const filteredOrders = availableOrders.filter(order => {
    // 搜索过滤
    const matchesSearch = 
      order.order_id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location.includes(searchTerm) ||
      order.type.includes(searchTerm);
    
    // 类型过滤
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 - 接单广场风格 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 flex">
        <div className='relative flex items-center' >
            <ChevronLeft
            onClick={()=>goto('/')}
            className='w-12 w-12 cursor-pointer hover:scale-110'/>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">接单广场</h1>
                <p className="text-sm text-gray-500">发现适合你的拍摄订单</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-orange-50 px-4 py-2 rounded-full">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-700 font-medium">今日可接单: {availableOrders.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选栏 */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索地点、拍摄类型或客户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            {/* 筛选按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 bg-white"
            >
              <Filter className="w-4 h-4" />
              筛选
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 展开的筛选选项 */}
          {showFilters && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3">拍摄类型</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      typeFilter === type
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? '全部' : type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 快捷筛选标签 */}
          <div className="flex gap-2">
            <span className="text-sm text-gray-500 py-2">热门筛选：</span>
            {['毕业照', '人物写真', '活动记录'].map(type => (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(type);
                  setSearchTerm('');
                }}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 订单列表 */}
        <div className="grid grid-cols-2 gap-2">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无符合条件的订单</h3>
              <p className="text-gray-500">试试调整筛选条件，或稍后再来看看</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
}

export default PhotographerOrderSquare;