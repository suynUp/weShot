import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

function FilterPanel({ categories, tags, selectedTags, onToggleTag, expandedCategories, onToggleCategory, onClose, isOpen }) {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

  return (
    <>
      {/* 桌面端悬浮按钮 - 当面板关闭时显示 */}
      {!isDesktopOpen && (
        <button
          onClick={() => setIsDesktopOpen(true)}
          className="hidden md:flex fixed right-8 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 items-center justify-center"
          aria-label="打开筛选面板"
        >
          <ChevronDown className="w-6 h-6 rotate-90" />
        </button>
      )}

      <div
        className={`fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto transition-all duration-300 z-50 
          md:!fixed md:right-8 md:top-1/2 md:transform md:-translate-y-1/2 md:w-72 md:h-auto md:bg-gradient-to-b md:from-orange-50 md:to-pink-50 md:rounded-2xl md:p-6 md:shadow-lg md:border md:border-gray-200 md:z-40
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${isDesktopOpen ? 'md:translate-x-0' : 'md:translate-x-full'}`}
      >
        <div className="p-6 md:p-0">
          {/* 移动端头部 - 只在移动端显示 */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-xl font-bold text-gray-800">筛选</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-white/80 backdrop-blur-sm"
              aria-label="关闭筛选面板"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* 桌面端头部 - 包含标题和关闭按钮 */}
          <div className="hidden md:flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">筛选</h2>
            <button
              onClick={() => setIsDesktopOpen(false)}
              className="p-1 hover:bg-orange-200 rounded-lg transition-colors"
              aria-label="关闭筛选面板"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.id}>
                <button
                  onClick={() => onToggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100 rounded-lg transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    {category.label}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedCategories[category.id] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedCategories[category.id] && (
                  <div className="mt-2 ml-2 space-y-2">
                    {(tags[category.id] || []).map(tag => (
                      <label
                        key={tag.id}
                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => onToggleTag(tag.id)}
                          className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="text-gray-700">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterPanel;