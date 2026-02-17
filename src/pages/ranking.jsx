import { useEffect, useState } from 'react';
import { RankingCard } from '../components/rankingCard';
import { useNavigation } from '../hooks/navigation';
import { ChevronLeft } from 'lucide-react';

// 模拟摄影师数据
const mockPhotographers = [
  {
    id: '1',
    name: '张摄影师',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    average_rating: 4.9,
    total_orders: 156
  },
  {
    id: '2',
    name: '李摄影师',
    avatar_url: 'https://images.unsplash.com/photo-1494790108777-766d23a7b0d7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    average_rating: 4.8,
    total_orders: 142
  },
  {
    id: '3',
    name: '王摄影师',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    average_rating: 4.7,
    total_orders: 128
  },
  {
    id: '4',
    name: '陈摄影师',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    average_rating: 4.6,
    total_orders: 115
  },
  {
    id: '5',
    name: '刘摄影师',
    avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    average_rating: 4.5,
    total_orders: 98
  }
];

export function Rankings() {
    const [photographersByRating, setPhotographersByRating] = useState([]);
    const [photographersByOrders, setPhotographersByOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const {goBack} = useNavigation()

    useEffect(() => {
        loadRankings();
    }, []);

    const loadRankings = async () => {
        try {
        // 模拟异步加载
        await new Promise(resolve => setTimeout(resolve, 500));

        // 按评分排序（取前3）
        const byRating = [...mockPhotographers].sort((a, b) => b.average_rating - a.average_rating);
        setPhotographersByRating(byRating.slice(0, 3));

        // 按接单量排序（取前3）
        const byOrders = [...mockPhotographers].sort((a, b) => b.total_orders - a.total_orders);
        setPhotographersByOrders(byOrders.slice(0, 3));
        } catch (error) {
        console.error('Error loading rankings:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleViewProfile = (id) => {
        console.log('View profile:', id);
        // 这里可以添加跳转到摄影师详情页的逻辑
        // window.location.href = `/photographer/${id}`;
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 flex items-center justify-center">
            <div className="text-lg text-gray-600">加载中...</div>
        </div>
        );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 py-12 px-4">
        <div>
            <ChevronLeft onClick={goBack} className='w-10 h-10'/>
        </div>
        <div className="max-w-6xl mx-auto space-y-12">
            <section>
                <div className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full text-xl font-bold mb-8 shadow-md">
                    评分排行榜
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {photographersByRating.map((photographer, index) => (
                    <RankingCard
                        key={photographer.id}
                        photographer={photographer}
                        rank={index + 1}
                        displayValue={photographer.average_rating.toFixed(1)}
                        onViewProfile={handleViewProfile}
                    />
                    ))}
                </div>
            </section>

            <section>
                <div className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full text-xl font-bold mb-8 shadow-md">
                    接单量排行榜
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {photographersByOrders.map((photographer, index) => (
                    <RankingCard
                        key={photographer.id}
                        photographer={photographer}
                        rank={index + 1}
                        displayValue={`${photographer.total_orders}单`}
                        onViewProfile={handleViewProfile}
                    />
                    ))}
                </div>
            </section>
        </div>
    </div>
  );
}