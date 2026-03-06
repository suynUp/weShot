// components/ProfileEditModal.jsx
import { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { imgUpload } from '../api/imgUpload';

// 预设选项
const presetStyles = [
  { id: 'portrait', label: '人像摄影', icon: '👤' },
  { id: 'landscape', label: '风光摄影', icon: '🏔️' },
  { id: 'street', label: '街拍摄影', icon: '🚶' },
  { id: 'commercial', label: '商业摄影', icon: '💼' },
  { id: 'wedding', label: '婚礼摄影', icon: '💒' },
  { id: 'documentary', label: '纪实摄影', icon: '📖' },
];

const presetTypes = [
  { id: 'memory', label: '记忆影像', icon: '📸' },
  { id: 'impression', label: '印象风格', icon: '🎨' },
  { id: 'story', label: '故事感', icon: '📖' },
  { id: 'vintage', label: '复古胶片', icon: '🎞️' },
  { id: 'minimalist', label: '极简主义', icon: '⬜' },
  { id: 'artistic', label: '艺术创意', icon: '✨' }
];

function ProfileEditModal({ isOpen, onClose, profile, onSave }) {
  // 直接用profile初始化state，适配传入的数据结构
  const [formData, setFormData] = useState({
    nickname: profile?.nickname || '',
    sex: profile?.sex || 0,
    phone: profile?.phone || '',
    detail: profile?.detail || '',
    style: Array.isArray(profile?.style) ? profile.style : [],
    equipment: Array.isArray(profile?.equipment) ? profile.equipment : [],
    photographerType: Array.isArray(profile?.photographerType) ? profile.photographerType : []
  });

  // 自定义输入状态
  const [customStyle, setCustomStyle] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');
  const [customType, setCustomType] = useState('');
  
  // 显示自定义输入框的状态
  const [showCustomStyle, setShowCustomStyle] = useState(false);
  const [showCustomEquipment, setShowCustomEquipment] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);

  const [isVerfied,] = useState(profile?.role === 2);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || '');
  const [avatarUploadFile, setAvatarUploadFile] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);

  // 当profile变化时更新formData
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        sex: profile.sex || 0,
        phone: profile.phone || '',
        detail: profile.detail || '',
        style: Array.isArray(profile.style) ? profile.style : [],
        equipment: Array.isArray(profile.equipment) ? profile.equipment : [],
        photographerType: Array.isArray(profile.photographerType) ? profile.photographerType : []
      });
      setAvatarPreview(profile.avatarUrl || '');
    }
  }, [profile]);

  // 多选处理函数
  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = [...(prev[field] || [])];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        // 添加
        currentValues.push(value);
      } else {
        // 移除
        currentValues.splice(index, 1);
      }
      
      return {
        ...prev,
        [field]: currentValues
      };
    });
  };

  // 添加自定义项
  const addCustomItem = (field, value, setCustom, setShowCustom) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    
    setCustom('');
    setShowCustom(false);
  };

  // 移除项
  const removeItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  // 渲染多选按钮组
  const renderMultiSelect = (field, label, presetOptions, customValue, setCustomValue, showCustom, setShowCustom) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-orange-700 text-left">
        {label}
      </label>
      
      {/* 已选中的项 */}
      {formData[field]?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {formData[field].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(field, item)}
                className="ml-1 hover:text-orange-500"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 预设选项 */}
      <div className="grid grid-cols-2 gap-2">
        {presetOptions.map((option) => {
          const isSelected = formData[field]?.includes(option.label);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleMultiSelect(field, option.label)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl border transition-all
                ${isSelected 
                  ? 'border-orange-500 bg-orange-50 text-orange-700' 
                  : 'border-orange-200 hover:border-orange-300 text-gray-600 hover:bg-orange-50'
                }
              `}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="text-sm flex-1 text-left">{option.label}</span>
              {isSelected && (
                <span className="w-5 h-5 bg-orange-500 rounded-full text-white flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 自定义输入 */}
      {showCustom ? (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder={`输入自定义${label}`}
            className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomItem(field, customValue, setCustomValue, setShowCustom);
              }
            }}
          />
          <button
            type="button"
            onClick={() => addCustomItem(field, customValue, setCustomValue, setShowCustom)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            添加
          </button>
          <button
            type="button"
            onClick={() => setShowCustom(false)}
            className="px-4 py-2 border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className="mt-2 text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <span>+ 自定义{label}</span>
        </button>
      )}
    </div>
  );

  // 渲染设备输入（支持多选）
  const renderEquipmentInput = () => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-orange-700 text-left">
        摄影设备
      </label>

      {/* 已添加的设备 */}
      {formData.equipment?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.equipment.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem('equipment', item)}
                className="ml-1 hover:text-orange-500"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 设备输入 */}
      {showCustomEquipment ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={customEquipment}
            onChange={(e) => setCustomEquipment(e.target.value)}
            placeholder="输入设备名称（如：索尼A7M3）"
            className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomItem('equipment', customEquipment, setCustomEquipment, setShowCustomEquipment);
              }
            }}
          />
          <button
            type="button"
            onClick={() => addCustomItem('equipment', customEquipment, setCustomEquipment, setShowCustomEquipment)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            添加
          </button>
          <button
            type="button"
            onClick={() => setShowCustomEquipment(false)}
            className="px-4 py-2 border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCustomEquipment(true)}
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <span>+ 添加设备</span>
        </button>
      )}
    </div>
  );

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
          const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
          const file = new File([blob], fileName, { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
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
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarFile(reader.result);
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
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      
      setAvatarPreview(result.previewUrl);
      setAvatarUploadFile(result.file);
      setIsCropping(false);
      setAvatarFile(null);
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
      
      if (avatarUploadFile) {
        finalAvatarUrl = await imgUpload(avatarUploadFile);
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview);
        }
      }

      // 构建请求体 - 适配你提供的数据结构
      const submitData = {
        nickname: formData.nickname,
        avatarUrl: finalAvatarUrl,
        sex: formData.sex,
        phone: formData.phone,
        detail: formData.detail,
        photographer: {
          style: formData.style,
          equipment: formData.equipment,
          type: formData.photographerType
        }
      };

      await onSave(submitData);
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
    
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩层 - 改为淡橙色半透明 */}
      <div 
        className="fixed inset-0 bg-orange-50/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 弹窗内容 - 统一为淡橙色 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-orange-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200">
          {/* 头部 - 改为纯橙色背景 */}
          <div className="sticky top-0 bg-orange-400 px-6 py-4 flex justify-between items-center rounded-t-2xl text-white">
            <h2 className="text-xl font-semibold">编辑个人信息</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-400 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 表单 */}
          <form className="p-6 space-y-6">
            {/* 头像上传区域 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-orange-100 border-4 border-white shadow-lg ring-2 ring-orange-200">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-400 bg-orange-100">
                      <CameraIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-orange-400 rounded-full text-white hover:bg-orange-600 shadow-lg transition-all transform hover:scale-110"
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
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-orange-400/80 backdrop-blur-sm">
                <div className="bg-orange-50 rounded-2xl p-6 max-w-lg w-full border border-orange-200">
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
                      className="flex-1 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600 transition-all shadow-md"
                    >
                      确认
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 错误提示 */}
            {uploadError && (
              <div className="bg-orange-100 border border-orange-200 text-orange-600 px-4 py-3 rounded-lg">
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
                  className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="介绍一下自己..."
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* 摄影师信息 */}
            {isVerfied && (
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-orange-800 border-b border-orange-200 pb-2">摄影师信息</h3>
                
                {/* 摄影风格多选 */}
                {renderMultiSelect(
                  'style',
                  '摄影风格',
                  presetStyles,
                  customStyle,
                  setCustomStyle,
                  showCustomStyle,
                  setShowCustomStyle
                )}

                {/* 摄影类型多选 */}
                {renderMultiSelect(
                  'photographerType',
                  '摄影类型',
                  presetTypes,
                  customType,
                  setCustomType,
                  showCustomType,
                  setShowCustomType
                )}

                {/* 摄影设备 */}
                {renderEquipmentInput()}
              </div>
            )}

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
                className="flex-1 px-4 py-3 bg-orange-400 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleSubmit}
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