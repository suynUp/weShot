import { ChevronLeft, Camera, Pencil } from 'lucide-react';

export function ProfileHeader({ profile, onBack, onEdit, onAvatarClick }) {
  return (
    <div className="relative">
      <div className="absolute top-8 left-8">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex justify-center pt-8 pb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-12 py-8 shadow-lg flex items-center gap-6 min-w-[500px]">
            <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                {profile?.avatar_url ? (
                    <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover" 
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-gray-300" />
                )}
                </div>
            </div>

            <div className="flex-1">
                <div className='flex flex-col'>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-medium text-gray-900">
                            {profile?.username || '叮咚鸡'}
                        </h1>
                        <button
                            onClick={onAvatarClick}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Camera className="w-8 h-8" />
                        </button>
                    </div>
                    <p className="text-gray-600 mt-1 text-start">
                        id : {profile?.user_id || '101010'}
                    </p>
                </div>
                
            </div>

          <button
            onClick={onEdit}
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}