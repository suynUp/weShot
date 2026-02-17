import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect } from 'react'
import Home from './pages/home'
import Login from './pages/login'
import Launch from './pages/launch'
import Profile from './pages/profile'
import { Rankings } from './pages/ranking'
import { RatingPage } from './pages/rating'
import { Gallery } from './pages/gallery'

const usePathStore = create(
  persist(
    (set) => ({
      // 保存当前路径
      currentPath: '/',
      
      // 设置当前路径
      setCurrentPath: (path) => {
        set({ currentPath: path })
      },
    }),
    {
      name: 'app-current-path', // localStorage 的 key
    }
  )
)

export default function RootRouter() {
  const { currentPath, setCurrentPath } = usePathStore()
  
  // 监听路由变化并保存当前路径
  useEffect(() => {
    // 获取当前路径
    const currentPath = window.location.pathname
    
    // 保存当前路径到 store
    setCurrentPath(currentPath)
    
    // 监听浏览器前进/后退
    const handlePopState = () => {
      const newPath = window.location.pathname
      setCurrentPath(newPath)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setCurrentPath])
  
  // 处理页面刷新时的重定向
  useEffect(() => {
    // 检查是否是页面刷新
    const isPageRefresh = 
      window.performance?.navigation?.type === 1 ||
      (() => {
        const navEntries = performance.getEntriesByType('navigation')
        return navEntries.length > 0 && navEntries[0].type === 'reload'
      })()
    
    // 如果是刷新页面，且有保存的路径，当前路径与保存的路径不一致
    if (isPageRefresh && currentPath && currentPath !== '/' && window.location.pathname !== currentPath) {
      // 直接使用 window.location 跳转到保存的路径
      window.location.replace(currentPath)
    }
  }, [currentPath]) // 依赖 currentPath
  
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
    },{
      path:"/ranking",
      page:<Rankings/>
    },{
      path:"/rating", // 修复了路径，加了斜杠
      page:<RatingPage/>
    },{
      path:"/gallery",
      page:<Gallery/>
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