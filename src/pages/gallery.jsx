import { useEffect, useState } from 'react';
import { ChevronDown, X, ThumbsUp, ChevronLeft } from 'lucide-react';
import PhotoCard from '../components/photoCard';
import FilterPanel from '../components/filterPanel';
import { useNavigation } from '../hooks/navigation';

// Mock 数据
const mockPhotos = [
  {
    id: '1',
    title: '城市日落',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 234,
    category_id: '1'
  },
  {
    id: '2',
    title: '人像摄影',
    image_url: 'https://images.unsplash.com/photo-1494790108777-766d23a7b0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 567,
    category_id: '2'
  },
  {
    id: '3',
    title: '建筑艺术',
    image_url: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 189,
    category_id: '3'
  },
  {
    id: '4',
    title: '自然风光',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 892,
    category_id: '1'
  },
  {
    id: '5',
    title: '街头摄影',
    image_url: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 345,
    category_id: '2'
  },
  {
    id: '6',
    title: '夜景拍摄',
    image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 678,
    category_id: '3'
  }
];

const mockCategories = [
  { id: '1', label: '风光摄影' },
  { id: '2', label: '人像摄影' },
  { id: '3', label: '建筑摄影' },
  { id: '4', label: '街拍摄影' }
];

const mockTags = [
  // 风光摄影标签
  { id: '101', name: '日出日落', category_id: '1' },
  { id: '102', name: '山川湖泊', category_id: '1' },
  { id: '103', name: '森林草原', category_id: '1' },
  // 人像摄影标签
  { id: '201', name: '写真', category_id: '2' },
  { id: '202', name: '婚纱', category_id: '2' },
  { id: '203', name: '儿童', category_id: '2' },
  // 建筑摄影标签
  { id: '301', name: '现代建筑', category_id: '3' },
  { id: '302', name: '古建筑', category_id: '3' },
  { id: '303', name: '室内设计', category_id: '3' },
  // 街拍摄影标签
  { id: '401', name: '人文纪实', category_id: '4' },
  { id: '402', name: '城市光影', category_id: '4' },
  { id: '403', name: '街头人像', category_id: '4' }
];

// 标签组件
function SelectedTag({ tagId, tagName, onRemove }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
      <span>{tagName}</span>
      <button
        onClick={() => onRemove(tagId)}
        className="hover:bg-gray-700 rounded-full p-0.5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}


// 主组件
export function Gallery() {

    const {goBack} = useNavigation()

  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 模拟异步加载
      await new Promise(resolve => setTimeout(resolve, 500));

      setPhotos(mockPhotos);
      setCategories(mockCategories);

      // 按分类组织标签
      const tagsByCategory = {};
      mockTags.forEach(tag => {
        if (!tagsByCategory[tag.category_id]) {
          tagsByCategory[tag.category_id] = [];
        }
        tagsByCategory[tag.category_id].push(tag);
      });
      setTags(tagsByCategory);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const removeTag = (tagId) => {
    setSelectedTags(prev => prev.filter(t => t !== tagId));
  };

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const getSelectedTagNames = () => {
    const names = [];
    Object.values(tags).flat().forEach(tag => {
      if (selectedTags.includes(tag.id)) {
        names.push(tag.name);
      }
    });
    return names;
  };

  const filteredPhotos = selectedTags.length === 0 ? photos : photos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 p-4 md:p-8">
        <div>
            <ChevronLeft className='w-10 h-10' onClick={goBack}/>
        </div>
        <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">摄影作品集</h1>
        </div>

        {selectedTags.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {getSelectedTagNames().map((tagName, idx) => {
                const tagId = selectedTags[idx];
                return (
                  <SelectedTag
                    key={tagId}
                    tagId={tagId}
                    tagName={tagName}
                    onRemove={removeTag}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 md:hidden"
          >
            <ChevronDown
              className={`w-6 h-6 transition-transform ${
                filterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <FilterPanel
            categories={categories}
            tags={tags}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            expandedCategories={expandedCategories}
            onToggleCategory={toggleCategory}
            onClose={() => setFilterOpen(false)}
            isOpen={filterOpen}
          />
        </div>
      </div>
    </div>
  );
}