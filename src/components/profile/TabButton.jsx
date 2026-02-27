// components/profile/TabButton.jsx
export function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
          : 'bg-white/70 text-gray-600 hover:bg-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}