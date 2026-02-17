import { ArrowRight } from 'lucide-react';

export function RankingCard({ photographer, rank, displayValue, onViewProfile }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl font-bold text-orange-400">NO.{rank}</span>
        <span className="text-3xl font-bold text-orange-400">{displayValue}</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-white overflow-hidden flex-shrink-0">
          {photographer.avatar_url ? (
            <img
              src={photographer.avatar_url}
              alt={photographer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-white rounded-lg px-3 flex items-center">
            <span className="text-sm font-medium text-gray-700 truncate">{photographer.name}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewProfile(photographer.id)}
        className="flex items-center gap-2 text-orange-400 hover:text-orange-500 transition-colors ml-auto group"
      >
        <span className="text-sm font-medium">TA的主页</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}