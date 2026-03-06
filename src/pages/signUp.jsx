import { useEffect, useState } from 'react';
import { Camera, ChevronRight, CheckCircle, XCircle, Image, Grid, Heart, Plus, LogIn, ArrowRight, AlertCircle, ChevronLeft, X } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';
import { UserStore } from '../store/userStore';
import { useEnroll } from '../hooks/usePhotographer';
import { useUserMutation, useUserUpdate } from '../hooks/useUser';
import { toast } from '../hooks/useToast';

function PhotographerSignUp() {
  const [step, setStep] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const user = UserStore(state => state.user);
  const isVerfied = UserStore(state => state.isVerFied);
  
  const {goto} = useNavigation();

  const enrollMutation = useEnroll();
  const getUserMutation = useUserMutation();
  const updateMutation = useUserUpdate();

  // 表单验证错误状态
  const [validationErrors, setValidationErrors] = useState({
    equipment: '',
    style: '',
    type: ''
  });

  useEffect(()=>{
    getUserMutation.mutateAsync();
  }, []);

  useEffect(()=>{   
    if(!user){
      goto('/login');
      if(isVerfied){
        goto('/');
      }
    }
  }, [getUserMutation.isSuccess]);

  // 摄影师详细信息
  const [photographerInfo, setPhotographerInfo] = useState({
    equipment: [],
    style: [],
    type: []
  });

  // 自定义输入状态
  const [newEquipment, setNewEquipment] = useState('');
  const [showEquipmentInput, setShowEquipmentInput] = useState(false);
  const [equipmentInputError, setEquipmentInputError] = useState('');
  
  const [newStyle, setNewStyle] = useState('');
  const [showStyleInput, setShowStyleInput] = useState(false);
  const [styleInputError, setStyleInputError] = useState('');
  
  const [newType, setNewType] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [typeInputError, setTypeInputError] = useState('');

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

  // 验证邀请码
  const verifyInviteCode = async () => {
    // 空值校验：邀请码不能为空
    if (!inviteCode.trim()) {
      setInviteError('请输入邀请码');
      return;
    }

    // 长度校验
    if (inviteCode.trim().length < 4) {
      setInviteError('邀请码长度不能少于4位');
      return;
    }

    try {
      setCheckingInvite(true);
      setInviteError('');

      await enrollMutation.mutateAsync(inviteCode);
      setInviteValid(true);
      setStep(2);
      
    } catch (error) {
      if (error.message?.includes('邀请码')) {
        setInviteError(error.message || '邀请码无效，请重试');
      } else {
        setInviteError('系统错误，请稍后重试');
      }
      setInviteValid(false);
    } finally {
      setCheckingInvite(false);
    }
  };

  // 验证设备输入
  const validateEquipmentInput = (value) => {
    if (!value.trim()) {
      return '设备名称不能为空';
    }
    if (value.trim().length > 50) {
      return '设备名称不能超过50个字符';
    }
    if (photographerInfo.equipment.includes(value.trim())) {
      return '该设备已存在';
    }
    return '';
  };

  // 验证风格输入
  const validateStyleInput = (value) => {
    if (!value.trim()) {
      return '风格名称不能为空';
    }
    if (value.trim().length > 30) {
      return '风格名称不能超过30个字符';
    }
    if (photographerInfo.style.includes(value.trim())) {
      return '该风格已存在';
    }
    return '';
  };

  // 验证类型输入
  const validateTypeInput = (value) => {
    if (!value.trim()) {
      return '类型名称不能为空';
    }
    if (value.trim().length > 30) {
      return '类型名称不能超过30个字符';
    }
    if (photographerInfo.type.includes(value.trim())) {
      return '该类型已存在';
    }
    return '';
  };

  // 添加设备
  const addEquipment = () => {
    const error = validateEquipmentInput(newEquipment);
    if (error) {
      setEquipmentInputError(error);
      return;
    }

    setPhotographerInfo(prev => ({
      ...prev,
      equipment: [...prev.equipment, newEquipment.trim()]
    }));
    setNewEquipment('');
    setShowEquipmentInput(false);
    setEquipmentInputError('');
    
    // 清除对应字段的验证错误
    setValidationErrors(prev => ({ ...prev, equipment: '' }));
  };

  // 移除设备
  const removeEquipment = (item) => {
    setPhotographerInfo(prev => ({
      ...prev,
      equipment: prev.equipment.filter(e => e !== item)
    }));
  };

  // 添加风格
  const addStyle = () => {
    const error = validateStyleInput(newStyle);
    if (error) {
      setStyleInputError(error);
      return;
    }

    setPhotographerInfo(prev => ({
      ...prev,
      style: [...prev.style, newStyle.trim()]
    }));
    setNewStyle('');
    setShowStyleInput(false);
    setStyleInputError('');
    
    // 清除对应字段的验证错误
    setValidationErrors(prev => ({ ...prev, style: '' }));
  };

  // 移除风格
  const removeStyle = (item) => {
    setPhotographerInfo(prev => ({
      ...prev,
      style: prev.style.filter(s => s !== item)
    }));
  };

  // 添加类型
  const addType = () => {
    const error = validateTypeInput(newType);
    if (error) {
      setTypeInputError(error);
      return;
    }

    setPhotographerInfo(prev => ({
      ...prev,
      type: [...prev.type, newType.trim()]
    }));
    setNewType('');
    setShowTypeInput(false);
    setTypeInputError('');
    
    // 清除对应字段的验证错误
    setValidationErrors(prev => ({ ...prev, type: '' }));
  };

  // 移除类型
  const removeType = (item) => {
    setPhotographerInfo(prev => ({
      ...prev,
      type: prev.type.filter(t => t !== item)
    }));
  };

  // 切换预设风格
  const togglePresetStyle = (styleLabel) => {
    setPhotographerInfo(prev => ({
      ...prev,
      style: prev.style.includes(styleLabel)
        ? prev.style.filter(s => s !== styleLabel)
        : [...prev.style, styleLabel]
    }));
    
    // 如果添加了预设风格，清除验证错误
    if (!photographerInfo.style.includes(styleLabel)) {
      setValidationErrors(prev => ({ ...prev, style: '' }));
    }
  };

  // 切换预设类型
  const togglePresetType = (typeLabel) => {
    setPhotographerInfo(prev => ({
      ...prev,
      type: prev.type.includes(typeLabel)
        ? prev.type.filter(t => t !== typeLabel)
        : [...prev.type, typeLabel]
    }));
    
    // 如果添加了预设类型，清除验证错误
    if (!photographerInfo.type.includes(typeLabel)) {
      setValidationErrors(prev => ({ ...prev, type: '' }));
    }
  };

  // 验证表单
  const validateForm = () => {
    const errors = {
      equipment: '',
      style: '',
      type: ''
    };

    let isValid = true;

    // 校验设备
    if (photographerInfo.equipment.length === 0) {
      errors.equipment = '请至少添加一个设备';
      isValid = false;
    }

    // 校验风格
    if (photographerInfo.style.length === 0) {
      errors.style = '请至少选择一种摄影风格';
      isValid = false;
    }

    // 校验类型
    if (photographerInfo.type.length === 0) {
      errors.type = '请至少选择一种摄影师类型';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // 处理提交
  const handleSubmit = async () => {
    // 表单空值校验
    if (!validateForm()) {
      // 滚动到第一个错误位置
      const firstErrorField = Object.keys(validationErrors).find(key => validationErrors[key]);
      if (firstErrorField) {
        const element = document.getElementById(`field-${firstErrorField}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const submitData = {
      nickname:user.nickname,
      photographer: {
        style: photographerInfo.style,
        equipment: photographerInfo.equipment,
        type: photographerInfo.type
      }
    };

    console.log('提交摄影师入驻申请:', submitData);
    
    try {
      await updateMutation.mutateAsync(submitData);
      toast.success('更新个人信息成功！');
      goto('/profile');
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请稍后重试，或进入个人主页修改');
    }
  };

  // 检查是否可以进入下一步
  const canProceed = () => {
    return photographerInfo.equipment.length > 0 && 
           photographerInfo.style.length > 0 && 
           photographerInfo.type.length > 0;
  };

  // 处理输入框键盘事件
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen py-5 px-4">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Camera className="absolute top-20 right-20 w-16 h-16 text-orange-200/20 rotate-12" />
        <Camera className="absolute bottom-20 left-20 w-20 h-20 text-pink-200/20 -rotate-12" />
      </div>
      
      <div className='ml-[10%] flex pointer'>
        <div 
          onClick={()=>goto('/')}
          className='cursor-pointer hover:scale-105 active:scale-95 bg-white p-1 shadow-lg rounded-full'
        >
          <ChevronLeft className='h-10 w-10 text-orange-400' />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* 用户信息栏 */}
        <div className="mb-6 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100 border-2 border-orange-200">
              <img 
                src={user?.avatarUrl} 
                alt={user?.nickname}
                className="w-full h-full object-cover"
              />
            </div>
            <div className='text-start'>
              <p className="text-sm text-gray-500">已登录</p>
              <p className="font-medium text-gray-800">{user?.nickname}</p>
              <p className="text-xs text-gray-400">ID：{user?.casId}</p>
            </div>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 1 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : 'bg-white text-gray-400'
              }`}>
                1
              </div>
              <div className={`font-medium ${step >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>
                邀请码验证
              </div>
            </div>
            <div className="w-16 h-0.5 bg-gray-200">
              <div className={`h-full bg-orange-400 transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : 'bg-white text-gray-400'
              }`}>
                2
              </div>
              <div className={`font-medium ${step >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>
                详细信息
              </div>
            </div>
          </div>
        </div>

        {/* 步骤1: 邀请码验证 */}
        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-6">
                <Camera className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">立即入驻</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                立即入驻，以解锁摄影师/管理员身份，体验更多精彩内容！
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  请输入邀请码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setInviteError('');
                  }}
                  onKeyPress={(e) => handleKeyPress(e, verifyInviteCode)}
                  placeholder="填写专属邀请码"
                  className={`w-full px-5 py-4 border ${
                    inviteError ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-300 bg-white text-lg`}
                  disabled={inviteValid}
                />
                
                {inviteError && (
                  <p className="mt-3 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <XCircle className="w-4 h-4" />
                    {inviteError}
                  </p>
                )}
                
                {inviteValid && (
                  <p className="mt-3 text-sm text-green-500 flex items-center gap-1 bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    邀请码验证成功！即将进入信息填写页面...
                  </p>
                )}

                <button
                  onClick={verifyInviteCode}
                  disabled={checkingInvite || inviteValid || !inviteCode.trim()}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-lg"
                >
                  {checkingInvite ? (
                    <>验证中...</>
                  ) : inviteValid ? (
                    <>
                      验证成功，即将跳转
                      <CheckCircle className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      验证邀请码
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 步骤2: 详细信息填写 */}
        {step === 2 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-4">
                <Camera className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">填写摄影师信息</h2>
              <p className="text-gray-600">可多选，也可自定义添加</p>
            </div>

            <div className="space-y-8">
              {/* 设备选择 */}
              <div id="field-equipment">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  常用设备 <span className="text-red-500">*</span>
                </label>
                
                {/* 错误提示 */}
                {validationErrors.equipment && (
                  <p className="mb-3 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.equipment}
                  </p>
                )}
                
                {/* 已选设备标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {photographerInfo.equipment.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm"
                    >
                      {item}
                      <button
                        onClick={() => removeEquipment(item)}
                        className="hover:text-orange-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* 自定义添加设备 */}
                {showEquipmentInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newEquipment}
                        onChange={(e) => {
                          setNewEquipment(e.target.value);
                          setEquipmentInputError('');
                        }}
                        onKeyPress={(e) => handleKeyPress(e, addEquipment)}
                        placeholder="输入设备名称"
                        className={`flex-1 px-4 py-2 border ${
                          equipmentInputError ? 'border-red-300' : 'border-gray-200'
                        } rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none`}
                      />
                      <button
                        onClick={addEquipment}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => {
                          setShowEquipmentInput(false);
                          setNewEquipment('');
                          setEquipmentInputError('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                    {equipmentInputError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {equipmentInputError}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowEquipmentInput(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-200 rounded-lg text-orange-500 hover:border-orange-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加设备
                  </button>
                )}
              </div>

              {/* 摄影风格 */}
              <div id="field-style">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  摄影风格 <span className="text-red-500">*</span>
                </label>

                {/* 错误提示 */}
                {validationErrors.style && (
                  <p className="mb-3 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.style}
                  </p>
                )}

                {/* 已选风格标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {photographerInfo.style.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm"
                    >
                      {item}
                      <button
                        onClick={() => removeStyle(item)}
                        className="hover:text-orange-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* 预设风格选项 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {presetStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => togglePresetStyle(style.label)}
                      className={`p-2 rounded-lg border transition-all duration-300 flex items-center gap-2 ${
                        photographerInfo.style.includes(style.label)
                          ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-200 text-gray-600'
                      }`}
                    >
                      <span className="text-lg">{style.icon}</span>
                      <span className="text-sm">{style.label}</span>
                    </button>
                  ))}
                </div>

                {/* 自定义添加风格 */}
                {showStyleInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newStyle}
                        onChange={(e) => {
                          setNewStyle(e.target.value);
                          setStyleInputError('');
                        }}
                        onKeyPress={(e) => handleKeyPress(e, addStyle)}
                        placeholder="输入风格名称"
                        className={`flex-1 px-4 py-2 border ${
                          styleInputError ? 'border-red-300' : 'border-gray-200'
                        } rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none`}
                      />
                      <button
                        onClick={addStyle}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => {
                          setShowStyleInput(false);
                          setNewStyle('');
                          setStyleInputError('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                    {styleInputError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {styleInputError}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowStyleInput(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-200 rounded-lg text-orange-500 hover:border-orange-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    自定义风格
                  </button>
                )}
              </div>

              {/* 摄影师类型 */}
              <div id="field-type">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  摄影师类型 <span className="text-red-500">*</span>
                </label>

                {/* 错误提示 */}
                {validationErrors.type && (
                  <p className="mb-3 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.type}
                  </p>
                )}

                {/* 已选类型标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {photographerInfo.type.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm"
                    >
                      {item}
                      <button
                        onClick={() => removeType(item)}
                        className="hover:text-orange-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* 预设类型选项 */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {presetTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => togglePresetType(type.label)}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        photographerInfo.type.includes(type.label)
                          ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 自定义添加类型 */}
                {showTypeInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newType}
                        onChange={(e) => {
                          setNewType(e.target.value);
                          setTypeInputError('');
                        }}
                        onKeyPress={(e) => handleKeyPress(e, addType)}
                        placeholder="输入类型名称"
                        className={`flex-1 px-4 py-2 border ${
                          typeInputError ? 'border-red-300' : 'border-gray-200'
                        } rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none`}
                      />
                      <button
                        onClick={addType}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => {
                          setShowTypeInput(false);
                          setNewType('');
                          setTypeInputError('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                    {typeInputError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {typeInputError}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTypeInput(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-200 rounded-lg text-orange-500 hover:border-orange-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    自定义类型
                  </button>
                )}
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={updateMutation.isLoading}
                className={`w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-lg ${
                  !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {updateMutation.isLoading ? (
                  <>提交中...</>
                ) : (
                  <>
                    更新个人信息
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotographerSignUp;