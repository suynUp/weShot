import { Navigate, Outlet } from 'react-router-dom'
import request from '../utils/request.js'

// 私有路由 需要登录才能访问 
export const PrivateRoute = () => {
  // 判断登录token
  const hasToken = request.hasToken()

  // 有token → 渲染子页面（后台页面）
  // 没token → 自动跳转到登录页
  return hasToken ? <Outlet /> : <Navigate to="/login" replace />
}
export const PublicRoute = () => {
  const hasToken = request.hasToken()

  // 没登录 → 渲染登录页
  // 已经登录 → 自动跳转到后台首页
  return hasToken ? <Navigate to="/" replace /> : <Outlet />
}