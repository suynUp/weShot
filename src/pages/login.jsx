import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'
import { toast } from '../hooks/useToast'
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react'
import { RedirectHelper } from '../utils/redirector'

export default function Login() {
  // 表单状态 - 保持原有数据结构
  const [casId, setCasId] = useState('admin')
  const [phone, setPhone] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [directoring,setDirectoring] = useState(false)
  const login = RedirectHelper.redirectToLogin

  const navigate = useNavigate()

  // 动画样式对象 - 从Launch复制
  const slideInKeyframes = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `

  // 表单验证
  const validateForm = () => {
    if (!casId.trim()) {
      toast.warning('请输入账号')
      return false
    }
    if (!phone.trim()) {
      toast.warning('请输入密码')
      return false
    }
    return true
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      console.log('发送登录请求，参数：', { casId, phone })
      
      const res = await request.post('/auth/admin/login', {
        casId: casId,
        phone: phone
      })

      console.log('登录接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        request.saveToken(res.data.token)
        
        toast.success('登录成功！')
        navigate('/home')
      } else {
        toast.error(res.msg || '登录失败，请检查账号密码')
      }
    } catch (error) {
      console.error('❌ 登录失败：', error)
      toast.error(error.message || '登录失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }

  // 处理回车键登录
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin()
    }
  }

  const handleRedirector = () => {
    setDirectoring(true)
    login()
    setDirectoring(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 添加动画样式 */}
      <style>
        {slideInKeyframes}
      </style>

      {/* 登录卡片 - 透明背景 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div 
          className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-200/50"
          style={{
            animation: 'fadeIn 0.5s ease'
          }}
        >
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              欢迎回来
            </h1>
            <p className="text-gray-500 text-sm">
              请登录您的账号继续
            </p>
          </div>

          {/* 表单区域 */}
          <div className="space-y-5">
            {/* 账号输入框 - 使用casId */}
            <div>
              <label className="text-start ml-3 block text-sm font-medium text-gray-600 mb-2">
                账号
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type='text'
                  placeholder="请输入账号"
                  value={casId}
                  onChange={(e) => setCasId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-orange-200/50 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* 密码输入框 - 使用phone */}
            <div>
              <label className="text-start ml-3 block text-sm font-medium text-gray-600 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 bg-white/50 border border-orange-200/50 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  登录
                </>
              )}
            </button>

             <button
              onClick={handleRedirector}
              disabled={directoring}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  跳转中...
                </>
              ) : (
                <>
                  统一认证登录
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}