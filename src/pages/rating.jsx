import { useState } from 'react';
import { StarRating } from '../components/starRating';

export function RatingPage() {
  const [photoQuality, setPhotoQuality] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (photoQuality === 0 || punctuality === 0 || communication === 0) {
      alert('请完成所有评分项');
      return;
    }

    setSubmitting(true);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟提交成功
      console.log('Rating submitted:', {
        photo_quality: photoQuality,
        punctuality: punctuality,
        communication: communication,
      });

      setSubmitted(true);
      setTimeout(() => {
        setPhotoQuality(0);
        setPunctuality(0);
        setCommunication(0);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
            请评级本单摄影师
          </h1>

          <div className="space-y-6">
            <StarRating
              rating={photoQuality}
              onRatingChange={setPhotoQuality}
              label="摄影师拍摄质量"
            />

            <StarRating
              rating={punctuality}
              onRatingChange={setPunctuality}
              label="摄影师准时性"
            />

            <StarRating
              rating={communication}
              onRatingChange={setCommunication}
              label="沟通效率"
            />
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleSubmit}
              disabled={submitting || submitted}
              className={`px-16 py-4 rounded-full text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                submitted
                  ? 'bg-green-400 text-white'
                  : 'bg-gradient-to-r from-orange-300 to-orange-400 text-orange-800 hover:from-orange-400 hover:to-orange-500 hover:text-white hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {submitted ? '提交成功！' : submitting ? '提交中...' : '提交'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}