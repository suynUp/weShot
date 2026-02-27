// components/profile/BatchActionBar.jsx
import { Trash2 } from 'lucide-react';

export function BatchActionBar({ count, onDelete, onCancel }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex items-center justify-between">
      <span className="text-sm text-gray-600">
        已选择 <span className="font-bold text-orange-600">{count}</span> 项
      </span>
      <div className="flex gap-2">
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          批量删除
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          取消选择
        </button>
      </div>
    </div>
  );
}