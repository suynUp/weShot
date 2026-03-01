// components/profile/TabButton.jsx
export function TabButton({ active, onClick, icon, label, toastNum = null }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 relative ${
        active
          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
          : 'bg-white/70 text-gray-600 hover:bg-white'
      }`}
    >
      {icon}
      {label}
      
      {/* 提示红点 - 当toastNum > 0时显示 */}
      {toastNum > 0 && (
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold px-1">
            {toastNum > 99 ? '99+' : toastNum}
          </span>
        </div>
      )}
    </button>
  );
}