import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useRef } from 'react'
import Home from './pages/home'
import Login from './pages/login'
import Launch from './pages/launch'
import Profile from './pages/profile'
import { RatingPage } from './pages/rating'
import  Gallery  from './pages/gallery'
import  Feed  from './pages/community'
import PhotographerSignUp from './pages/signUp'
import PhotographersPage from './pages/photographers'
import PhotographerOrderSquare from './pages/pendingOrder'
import PostPublish from './pages/postPblish'
import OrderActionPage from './pages/orderAction'
import SearchResults from './pages/searchResult'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ContentAudit from './pages/ContentAudit.jsx'
import UserManage from './pages/UserManage.jsx'
import FeedbackManage from './pages/FeedbackManage.jsx'

const usePathStore = create(
  persist(
    (set) => ({
      // 保存上一次访问的非首页路径
      lastVisitedPath: null,
      
      // 设置上一次访问的路径
      setLastVisitedPath: (path) => {
        set({ lastVisitedPath: path })
      },
      
      // 清除保存的路径（回到首页时调用）
      clearLastVisitedPath: () => {
        set({ lastVisitedPath: null })
      }
    }),
    {
      name: 'app-last-visited-path',
    }
  )
)

// 创建一个内部组件来使用 useLocation
function RouteHandler() {
  const location = useLocation()
  const { lastVisitedPath, setLastVisitedPath, clearLastVisitedPath } = usePathStore()
  const isFirstRender = useRef(true)
  const hasRedirected = useRef(false)

  // 监听路由变化
  useEffect(() => {
    // 如果是首页，清除保存的路径
    if (location.pathname === '/') {
      clearLastVisitedPath()
    } 
    // 如果不是首页，且不是刷新触发的重定向，则保存路径
    else if (!hasRedirected.current) {
      setLastVisitedPath(location.pathname)
    }
    
    // 重置重定向标志
    hasRedirected.current = false
  }, [location.pathname, setLastVisitedPath, clearLastVisitedPath])

  // 处理页面刷新
  useEffect(() => {
    // 检测是否是页面刷新
    const isPageRefresh = 
      window.performance?.navigation?.type === 1 ||
      performance.getEntriesByType('navigation').some(nav => nav.type === 'reload')

    if (isPageRefresh && isFirstRender.current) {
      // 如果有保存的路径，且当前路径不是首页，且当前路径与保存的路径不同
      if (lastVisitedPath && 
          lastVisitedPath !== '/' && 
          window.location.pathname !== lastVisitedPath) {
        
        // 标记为重定向
        hasRedirected.current = true
        
        // 使用 replace 进行重定向
        window.location.replace(lastVisitedPath)
      }
    }
    
    isFirstRender.current = false
  }, [lastVisitedPath])

  return null
}

export default function RootRouter() {
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
      path:"/rating", 
      page:<RatingPage/>
    },{
      path:"/gallery",
      page:<Gallery/>
    },{
      path:"/community",
      page:<Feed/>
    },{
      path:'/signup',
      page:<PhotographerSignUp/>
    },{
      path:'/photographers',
      page:<PhotographersPage/>
    },{
      path:'/pendingorders',
      page:<PhotographerOrderSquare/>
    },{
      path:'/postpublish',
      page:<PostPublish/>
    },{
      path:'/orderaction/:orderId',
      page:<OrderActionPage/>
    },{
      path:'/searchresults',
      page:<SearchResults/>
    }, {
      path: "/manager",
      page: <Layout/>,
      innerPage: [
        {
          index: true,  // 标记为 index 路由
          page: <Dashboard/>
        },
        {
          path: "content-audit",  // 去掉开头的斜杠，变成相对路径
          page: <ContentAudit/>
        },
        {
          path: "user-manage",
          page: <UserManage/>
        },
        {
          path: "feedback-manage", 
          page: <FeedbackManage/>
        }
      ]
    }
  ]

   return (
    <BrowserRouter>
      <RouteHandler />
      <Routes>
        {RouteList.map((r, index) => (
          r.innerPage ? (
            <Route key={index} path={r.path} element={r.page}>
              {r.innerPage.map((ir, i) => {
                if (ir.index) {
                  // index 路由
                  return <Route key={i} index element={ir.page} />
                } else {
                  // 普通子路由
                  return <Route key={i} path={ir.path} element={ir.page} />
                }
              })}
            </Route>
          ) : (
            <Route key={index} path={r.path} element={r.page} />
          )
        ))}
      </Routes>
    </BrowserRouter>
  )
}