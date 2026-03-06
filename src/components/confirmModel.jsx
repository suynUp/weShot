// components/ConfirmModal.jsx
import { XMarkIcon } from '@heroicons/react/24/outline';
import { HelpCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto">
      {/* 遮罩层 - 淡橙色半透明 */}
      <div 
        className="fixed inset-0 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-orange-50/80 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full border border-orange-200">
          
          {/* 头部 - 淡橙色 */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-orange-200">
            <h3 className="text-lg font-medium text-orange-800">
              {title || '确认操作'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-orange-500" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            <div className="text-center space-y-4">
              {/* 询问图标 */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              {/* 询问内容 */}
              <div className="space-y-2">
                <p className="text-orange-800 text-lg font-medium">
                  {content || '您确定要执行此操作吗？'}
                </p>
              </div>
            </div>
          </div>

          {/* 按钮组 */}
          <div className="px-6 py-4 bg-orange-100/50 rounded-b-2xl flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-orange-300 rounded-xl text-orange-700 hover:bg-orange-100 transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg font-medium"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;