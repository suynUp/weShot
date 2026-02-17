import { ThumbsUp } from "lucide-react";

// 照片卡片组件
function PhotoCard({ photo }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-48 bg-orange-100 overflow-hidden">
        <img
          src={photo.image_url}
          alt={photo.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 truncate">
          {photo.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded-full flex-1"></div>
          <div className="flex items-center gap-2 ml-3">
            <ThumbsUp className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-gray-700">
              {photo.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoCard