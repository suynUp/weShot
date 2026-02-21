// components/ProfileEditModal.jsx
import { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { imgUpload } from '../api/imgUpload';

function ProfileEditModal({ isOpen, onClose, profile, onSave }) {
  // 直接用profile初始化state
  const [formData, setFormData] = useState({
    nickname: profile?.nickname || '',
    sex: profile?.sex || 0,
    phone: profile?.phone || '',
    detail: profile?.detail || '',
    photographer: {
      style: profile?.style || '',
      equipment: profile?.equipment || '',
      type: profile?.photographerType || ''
    }
  });

  const [isVerfied,] = useState(profile.role ===2)
  
  const [avatarFile, setAvatarFile] = useState(null);        // 存储原始图片 base64
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || ''); // 预览URL
  const [avatarUploadFile, setAvatarUploadFile] = useState(null); // 存储最终要上传的 File 对象
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);

  // 组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // 完成裁剪
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 生成裁剪后的图片并返回 File 对象
  const getCroppedImageFile = useCallback(async () => {
    if (!avatarFile || !croppedAreaPixels) return null;
    
    try {
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.src = avatarFile;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const ctx = canvas.getContext('2d');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          // 生成文件名（使用时间戳+随机数）
          const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
          
          // 创建 File 对象
          const file = new File([blob], fileName, { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          // 创建预览URL
          const previewUrl = URL.createObjectURL(blob);
          
          resolve({
            file,
            previewUrl
          });
        }, 'image/jpeg', 0.95);
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      return null;
    }
  }, [avatarFile, croppedAreaPixels]);

  // 处理头像上传
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarFile(reader.result); // 存储 base64 用于裁剪
        setIsCropping(true);
        setUploadError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // 确认裁剪
  const handleCropConfirm = async () => {
    const result = await getCroppedImageFile();
    if (result) {
      // 清理旧的预览URL
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      
      setAvatarPreview(result.previewUrl);     // 更新预览
      setAvatarUploadFile(result.file);        // 存储 File 对象用于上传
      setIsCropping(false);
      setAvatarFile(null);                      // 清除原始图片数据
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setIsCropping(false);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      setUploadError('');
      
      let finalAvatarUrl = profile?.avatarUrl || '';
      
      // 如果有新上传的头像
      if (avatarUploadFile) {
        // 上传到图床
        finalAvatarUrl = await imgUpload(avatarUploadFile);
        console.log(finalAvatarUrl)
        // 清理预览URL
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview);
        }
      }
      console.log('data',{
        ...formData,
        avatarUrl: finalAvatarUrl  // 使用图床返回的永久URL
      })
      // 保存表单数据
      await onSave({
        ...formData,
        avatarUrl: finalAvatarUrl  // 使用图床返回的永久URL
      });
      
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      setUploadError(error.message || '保存失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // 处理单选框
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
      return;
    }
    
    // 处理嵌套对象
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 如果弹窗关闭，不渲染内容
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩层 - 暖色调半透明 */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-orange-500/30 via-pink-500/30 to-amber-500/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200/50">
          {/* 头部 - 暖色渐变 */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex justify-between items-center rounded-t-2xl text-white">
            <h2 className="text-xl font-semibold">编辑个人信息</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 头像上传区域 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-amber-200 border-4 border-white shadow-lg ring-2 ring-orange-300/50">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-400 bg-gradient-to-br from-orange-100 to-amber-100">
                      <CameraIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all transform hover:scale-110"
                  disabled={isUploading}
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-orange-600/70 mt-2">点击相机图标上传头像（最大5MB）</p>
            </div>

            {/* 头像裁剪弹窗 */}
            {isCropping && avatarFile && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 max-w-lg w-full border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4">裁剪头像</h3>
                  <div className="relative h-80 w-full bg-gray-900 rounded-lg overflow-hidden">
                    <Cropper
                      image={avatarFile}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      cropShape="round"
                      showGrid={false}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-orange-700">缩放</label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full mt-2 accent-orange-500"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCropCancel}
                      className="flex-1 px-4 py-2 border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleCropConfirm}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
                    >
                      确认
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 错误提示 */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {uploadError}
              </div>
            )}

            {/* 基本信息 */}
            <div className="space-y-5">
              <h3 className="text-lg font-medium text-orange-800 border-b border-orange-200 pb-2">基本信息</h3>
              
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  昵称
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/80 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="请输入昵称"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  性别
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="sex"
                      value="1"
                      checked={formData.sex === 1}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      disabled={isUploading}
                    />
                    <span className="ml-2 text-orange-700 group-hover:text-orange-600">男</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="sex"
                      value="2"
                      checked={formData.sex === 2}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      disabled={isUploading}
                    />
                    <span className="ml-2 text-orange-700 group-hover:text-orange-600">女</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="sex"
                      value="0"
                      checked={formData.sex === 0}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      disabled={isUploading}
                    />
                    <span className="ml-2 text-orange-700 group-hover:text-orange-600">保密</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  手机号
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/80 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="请输入手机号"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  个人简介
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/80 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="介绍一下自己..."
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* 摄影师信息 */}
            {isVerfied&&<div className="space-y-5">
              <h3 className="text-lg font-medium text-orange-800 border-b border-orange-200 pb-2">摄影师信息</h3>
              
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  摄影风格
                </label>
                <input
                  type="text"
                  name="photographer.style"
                  value={formData.photographer.style}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/80 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="例如：人像、风景、街拍"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  摄影设备
                </label>
                <input
                  type="text"
                  name="photographer.equipment"
                  value={formData.photographer.equipment}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/80 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="例如：索尼A7M3、佳能5D4"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2 text-left">
                  摄影类型
                </label>
                <input
                  type="text"
                  name="photographer.type"
                  value={formData.photographer.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/80 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="例如：婚礼摄影、商业摄影"
                  disabled={isUploading}
                />
              </div>
            </div>}

            {/* 按钮组 */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-orange-300 rounded-xl text-orange-700 hover:bg-orange-100 transition-colors font-medium"
                disabled={isUploading}
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    上传中...
                  </>
                ) : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;