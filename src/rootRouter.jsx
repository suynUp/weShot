import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect } from 'react'
import Home from './pages/home'
import Login from './pages/login'
import Launch from './pages/launch'
import Profile from './pages/profile'
const usePathStore = create(
  persist(
    (set, get) => ({
      // 保存的上次访问路径
      lastPath: '/',
      
      // 设置路径（不保存首页）
      setLastPath: (path) => {
        if (path !== '/') {
          set({ lastPath: path })
        }
      },
      
      // 清除保存的路径
      clearLastPath: () => set({ lastPath: '/' }),
      
      // 获取保存的路径
      getLastPath: () => get().lastPath
    }),
    {
      name: 'app-last-path', // localStorage 的 key
    }
  )
)

export default function RootRouter() {
  const { lastPath, setLastPath } = usePathStore()
  
  // 效果1：监听路由变化并保存
  useEffect(() => {
    // 获取当前路径
    const currentPath = window.location.pathname
    
    // 保存非首页的路径
    if (currentPath !== '/') {
      setLastPath(currentPath)
    }
    
    // 监听浏览器前进/后退
    const handlePopState = () => {
      const newPath = window.location.pathname
      if (newPath !== '/') {
        setLastPath(newPath)
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setLastPath])
  
  // 效果2：处理页面刷新时的重定向
  useEffect(() => {
    // 检查是否是页面刷新
    const isPageRefresh = 
      // 方法1：使用 performance.navigation（旧浏览器）
      window.performance?.navigation?.type === 1 ||
      // 方法2：使用 performance.getEntriesByType（现代浏览器）
      (() => {
        const navEntries = performance.getEntriesByType('navigation')
        return navEntries.length > 0 && navEntries[0].type === 'reload'
      })()
    
    // 如果是刷新页面，且有保存的非首页路径，当前又在首页
    if (isPageRefresh && lastPath && lastPath !== '/' && window.location.pathname === '/') {
      // 直接使用 window.location 跳转，确保在路由渲染前执行
      window.location.replace(lastPath)
    }
  }, []) // 只在组件挂载时执行一次

  
  const RouteList = [
    {
      path: "/",
      page: <Home/>
    },{
      path:"/login",
      page:<Login/>
    },{
      path:"/launch",
      page:<Launch/>
    },{
      path:"/profile",
      page:<Profile/>
    }
  ]

  return (
    <BrowserRouter>
      <Routes>
        {RouteList.map((r, index) => (
          <Route key={index} path={r.path} element={r.page} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}