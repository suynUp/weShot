import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request.js'

export default function Login() {
  // 表单状态
  const [casId, setCasId] = useState('Admin')
  const [phone, setPhone] = useState('123456')
  // 加载状态：防止重复点击
  const [loading, setLoading] = useState(false)
  // 路由跳转
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!casId.trim()) {
      alert('请输入管理员账号')
      return
    }
    if (!phone.trim()) {
      alert('请输入密码')
      return
    }

    setLoading(true)

    try {
      console.log('发送登录请求，参数：', { casId, phone })
      
      const res = await request.post('/auth/admin/login', {
        casId: casId,
        phone: phone
      })

      console.log(' 登录接口返回：', res)

      const SUCCESS_CODE = 200
      if (res.code === SUCCESS_CODE) {
        request.saveToken(res.data.token)
        
        alert('登录成功！')
        navigate('/')
      } else {
        alert(res.msg || '登录失败，请检查账号密码')
      }
    } catch (error) {
      console.error('❌ 登录失败：', error)
      alert(error.message || '登录失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      border: '1px solid #eee'
    }}>
      <h2>登录</h2>
      <input
        type='text'
        placeholder="管理员账号"
        value={casId}
        onChange={(e) => setCasId(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <input
        type="password"
        placeholder="密码"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <button 
        onClick={handleLogin}
        disabled={loading}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </div>
  )
}