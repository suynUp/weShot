import { useEffect, useState } from 'react';
import { Camera, ChevronRight, CheckCircle, XCircle, Image, Grid, Heart, Plus, LogIn, ArrowRight, AlertCircle, ChevronLeft, X } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';
import { UserStore } from '../store/userStore';
import { useEnroll } from '../hooks/usePhotographer';
import { useUserMutation, useUserUpdate } from '../hooks/useUser';
import { toast } from '../hooks/useToast';

function PhotographerSignUp() {
  const [step, setStep] = useState(1); // 1: 邀请码, 2: 详细信息
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const user = UserStore(state => state.user)
  const isVerfied = UserStore(state => state.isVerFied)
  
  const {goto} = useNavigation()

  const enrollMutation = useEnroll();
  const getUserMutation = useUserMutation()
  const updateMutation = useUserUpdate();

  useEffect(()=>{
    getUserMutation.mutateAsync() 
  },[])

  useEffect(()=>{   
    if(!user){
      goto('/login')
      if(isVerfied){
        goto('/')
      }
    }
  },[getUserMutation.isSuccess])

  // 摄影师详细信息 - 调整为数组格式
  const [photographerInfo, setPhotographerInfo] = useState({
    equipment: [], // 设备列表 - 字符串数组
    style: [], // 摄影风格数组
    type: [] // 摄影师类型数组
  });

  // 自定义输入状态
  const [newEquipment, setNewEquipment] = useState('');
  const [showEquipmentInput, setShowEquipmentInput] = useState(false);
  
  const [newStyle, setNewStyle] = useState('');
  const [showStyleInput, setShowStyleInput] = useState(false);
  
  const [newType, setNewType] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);

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
  try {
    setCheckingInvite(true);
    setInviteError('');

    // 第一步：验证邀请码
    await enrollMutation.mutateAsync(inviteCode);
    setInviteValid(true);
    
    // 第三步：跳转到第二步
    setStep(2);
    
  } catch (error) {
    // 错误处理
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

  // 添加设备
  const addEquipment = () => {
    if (newEquipment.trim() && !photographerInfo.equipment.includes(newEquipment.trim())) {
      setPhotographerInfo(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
      setShowEquipmentInput(false);
    }
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
    if (newStyle.trim() && !photographerInfo.style.includes(newStyle.trim())) {
      setPhotographerInfo(prev => ({
        ...prev,
        style: [...prev.style, newStyle.trim()]
      }));
      setNewStyle('');
      setShowStyleInput(false);
    }
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
    if (newType.trim() && !photographerInfo.type.includes(newType.trim())) {
      setPhotographerInfo(prev => ({
        ...prev,
        type: [...prev.type, newType.trim()]
      }));
      setNewType('');
      setShowTypeInput(false);
    }
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
  };

  // 切换预设类型
  const togglePresetType = (typeLabel) => {
    setPhotographerInfo(prev => ({
      ...prev,
      type: prev.type.includes(typeLabel)
        ? prev.type.filter(t => t !== typeLabel)
        : [...prev.type, typeLabel]
    }));
  };

  // 处理提交
  const handleSubmit = async () => {
    // 准备提交的数据 - 直接使用数组格式
    const submitData = {
      photographer: {
        style: photographerInfo.style,
        equipment: photographerInfo.equipment,
        type: photographerInfo.type
      }
    };

    console.log('提交摄影师入驻申请:', submitData);
    
    try {
      await updateMutation.mutateAsync(submitData);
      goto('/profile');
    } catch (error) {
      console.error('提交失败:', error);
      toast('提交失败，请稍后重试，或进入个人主页修改');
    }
  };

  // 检查是否可以进入下一步
  const canProceed = () => {
    if (step === 2) {
      return photographerInfo.equipment.length > 0 && 
             photographerInfo.style.length > 0 && 
             photographerInfo.type.length > 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 py-5 px-4">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
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
                src={user.avatarUrl} 
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
            </div>
            <div className='text-start'>
              <p className="text-sm text-gray-500">已登录</p>
              <p className="font-medium text-gray-800">{user.nickname}</p>
              <p className="text-xs text-gray-400">ID：{user.casId}</p>
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
                  请输入邀请码
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="填写专属邀请码"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-300 bg-white text-lg"
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
                  disabled={checkingInvite || inviteValid}
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

        {/* 步骤2: 详细信息填写 - 多选且可自定义 */}
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
              {/* 设备选择 - 可自定义添加 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  常用设备 <span className="text-red-500">*</span>
                </label>
                
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      placeholder="输入设备名称"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
                    />
                    <button
                      onClick={addEquipment}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => setShowEquipmentInput(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
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

              {/* 摄影风格 - 预设多选 + 自定义 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  摄影风格 <span className="text-red-500">*</span>
                </label>

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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStyle}
                      onChange={(e) => setNewStyle(e.target.value)}
                      placeholder="输入风格名称"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && addStyle()}
                    />
                    <button
                      onClick={addStyle}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => setShowStyleInput(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
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

              {/* 摄影师类型 - 预设多选 + 自定义 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  摄影师类型 <span className="text-red-500">*</span>
                </label>

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
                <div className="space-y-2 mb-3">
                  {presetTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => togglePresetType(type.label)}
                      className={`w-full p-3 rounded-lg border transition-all duration-300 text-left ${
                        photographerInfo.type.includes(type.label)
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>

                {/* 自定义添加类型 */}
                {showTypeInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      placeholder="输入类型名称"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && addType()}
                    />
                    <button
                      onClick={addType}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => setShowTypeInput(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
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
                disabled={!canProceed() || updateMutation.isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-lg"
              >
                {updateMutation.isLoading ? (
                  <>提交中...</>
                ) : (
                  <>
                    提交入驻申请
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