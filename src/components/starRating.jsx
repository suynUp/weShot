import { Star } from 'lucide-react';

export function StarRating({ rating, onRatingChange, label }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{label}</h3>
      <div className="flex gap-4 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded-full p-1"
          >
            <Star
              className={`w-12 h-12 transition-colors ${
                star <= rating
                  ? 'fill-orange-400 stroke-orange-400'
                  : 'fill-none stroke-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}