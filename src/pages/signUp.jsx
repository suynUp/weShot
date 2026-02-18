import { useState } from 'react';
import { Camera, Sparkles, ChevronRight, CheckCircle, XCircle, Image, Grid, Heart, Plus, LogIn, ArrowRight, AlertCircle, ChevronLeft } from 'lucide-react';
import { useNavigation } from '../hooks/navigation';

function PhotographerSignUp() {
  const [step, setStep] = useState(1); // 1: 邀请码, 2: 详细信息
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // 假设用户已登录，这里使用模拟的登录用户信息
  const [user] = useState({
    name: '张摄影师',
    email: 'zhang@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  const {goto} = useNavigation()

  // 摄影师详细信息
  const [photographerInfo, setPhotographerInfo] = useState({
    equipment: [], // 设备列表
    style: '', // 摄影风格
    styleOther: '', // 其他风格
    type: '', // 摄影师类型
    typeOther: '', // 其他类型
    specialties: [] // 擅长领域
  });

  // 设备选项
  const equipmentOptions = [
    { id: 'sony', label: '索尼', icon: '📷' },
    { id: 'canon', label: '佳能', icon: '📸' },
    { id: 'nikon', label: '尼康', icon: '🎥' },
    { id: 'fuji', label: '富士', icon: '📱' },
    { id: 'leica', label: '徕卡', icon: '📷' },
    { id: 'other', label: '其他', icon: '⚙️' }
  ];

  // 摄影风格选项
  const styleOptions = [
    { id: 'portrait', label: '人像摄影', icon: '👤' },
    { id: 'landscape', label: '风光摄影', icon: '🏔️' },
    { id: 'street', label: '街拍摄影', icon: '🚶' },
    { id: 'commercial', label: '商业摄影', icon: '💼' },
    { id: 'wedding', label: '婚礼摄影', icon: '💒' },
    { id: 'documentary', label: '纪实摄影', icon: '📖' },
    { id: 'other', label: '其他', icon: '✨' }
  ];

  // 摄影师类型选项
  const typeOptions = [
    { id: 'professional', label: '专业摄影师', description: '全职从事摄影工作' },
    { id: 'amateur', label: '业余爱好者', description: '摄影作为兴趣爱好' },
    { id: 'student', label: '摄影学生', description: '在校学习摄影专业' },
    { id: 'studio', label: '摄影工作室', description: '拥有自己的摄影团队' },
    { id: 'other', label: '其他', description: '其他类型' }
  ];

  // 验证邀请码
  const verifyInviteCode = async () => {
    if (inviteCode.length < 6) {
      setInviteError('邀请码至少6位');
      return;
    }

    setCheckingInvite(true);
    setInviteError('');

    // 模拟验证邀请码
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 假设有效的邀请码格式：PHOTO + 4位数字
    const isValid = /^PHOTO\d{4}$/.test(inviteCode);
    
    if (isValid) {
      setInviteValid(true);
      // 自动进入下一步
      setTimeout(() => setStep(2), 500);
    } else {
      setInviteError('邀请码无效，请重试');
    }
    
    setCheckingInvite(false);
  };

  // 切换设备选择
  const toggleEquipment = (equipmentId) => {
    setPhotographerInfo(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter(e => e !== equipmentId)
        : [...prev.equipment, equipmentId]
    }));
  };

  // 处理风格选择
  const handleStyleChange = (styleId) => {
    setPhotographerInfo(prev => ({
      ...prev,
      style: styleId,
      // 如果不是选择"其他"，清空其他输入
      styleOther: styleId !== 'other' ? '' : prev.styleOther
    }));
  };

  // 处理类型选择
  const handleTypeChange = (typeId) => {
    setPhotographerInfo(prev => ({
      ...prev,
      type: typeId,
      // 如果不是选择"其他"，清空其他输入
      typeOther: typeId !== 'other' ? '' : prev.typeOther
    }));
  };

  // 处理提交
  const handleSubmit = () => {
    // 构建最终的风格和类型值
    const finalStyle = photographerInfo.style === 'other' 
      ? photographerInfo.styleOther 
      : styleOptions.find(s => s.id === photographerInfo.style)?.label;
    
    const finalType = photographerInfo.type === 'other'
      ? photographerInfo.typeOther
      : typeOptions.find(t => t.id === photographerInfo.type)?.label;

    console.log('提交摄影师信息:', {
      userId: user.email,
      inviteCode,
      equipment: photographerInfo.equipment.map(e => 
        equipmentOptions.find(opt => opt.id === e)?.label
      ),
      style: finalStyle,
      type: finalType,
      specialties: photographerInfo.specialties
    });
    
    alert('入驻申请提交成功！等待审核...');
  };

  // 检查是否可以进入下一步
  const canProceed = () => {
    if (step === 2) {
      const hasEquipment = photographerInfo.equipment.length > 0;
      const hasStyle = photographerInfo.style && 
        (photographerInfo.style !== 'other' || photographerInfo.styleOther.trim());
      const hasType = photographerInfo.type && 
        (photographerInfo.type !== 'other' || photographerInfo.typeOther.trim());
      
      return hasEquipment && hasStyle && hasType;
    }
    return false;
  };

  const handleFeedback = () => {
    console.log('打开反馈弹窗');
    // 这里可以打开反馈弹窗或跳转到反馈页面
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
        className='cursor-pointer hover:scale-105 active:scale-95 bg-white p-1 shadow-lg rounded-full' >
                <ChevronLeft className='h-10 w-10 text-orange-400'></ChevronLeft>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* 用户信息栏 - 显示已登录状态 */}
        <div className="mb-6 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100 border-2 border-orange-200">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">已登录</p>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => console.log('切换账号')}
            className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
          >
            切换账号
          </button>
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

        {/* 步骤1: 邀请码验证 - 融入设计稿风格 */}
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
                    邀请码验证成功！
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
                      解锁新身份！
                      <CheckCircle className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      解锁新身份！
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button 
                  onClick={() => console.log('登录')}
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  登录
                </button>
                <button 
                  onClick={handleFeedback}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  不满意？点击此处反馈意见
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-6">
              提示：邀请码格式为 PHOTO + 4位数字
            </p>
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
              <p className="text-gray-600">请选择您的设备、风格和类型</p>
            </div>

            <div className="space-y-8">
              {/* 设备选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  常用设备 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {equipmentOptions.map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => toggleEquipment(eq.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                        photographerInfo.equipment.includes(eq.id)
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <span className="text-xl">{eq.icon}</span>
                      <span className="text-sm font-medium">{eq.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 摄影风格选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  摄影风格 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {styleOptions.map(style => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                        photographerInfo.style === style.id
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <span className="text-xl">{style.icon}</span>
                      <span className="text-sm font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>
                
                {/* 其他风格输入框 */}
                {photographerInfo.style === 'other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={photographerInfo.styleOther}
                      onChange={(e) => setPhotographerInfo(prev => ({ ...prev, styleOther: e.target.value }))}
                      placeholder="请输入您的摄影风格"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 摄影师类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  摄影师类型 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {typeOptions.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        photographerInfo.type === type.id
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                      {type.description && (
                        <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* 其他类型输入框 */}
                {photographerInfo.type === 'other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={photographerInfo.typeOther}
                      onChange={(e) => setPhotographerInfo(prev => ({ ...prev, typeOther: e.target.value }))}
                      placeholder="请输入您的摄影师类型"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-lg"
              >
                提交入驻申请
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotographerSignUp