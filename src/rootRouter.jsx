import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useRef, useState } from 'react'
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
import { useGetUserStatus, useLogOut } from './hooks/useUser.js'
import { AlertCircle } from 'lucide-react'
import { UserStore } from './store/userStore.js'

const usePathStore = create(
  persist(
    (set) => ({
      lastVisitedPath: null,
      setLastVisitedPath: (path) => {
        set({ lastVisitedPath: path })
      },
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

  useEffect(() => {
    if (location.pathname === '/') {
      clearLastVisitedPath()
    } 
    else if (!hasRedirected.current) {
      setLastVisitedPath(location.pathname)
    }
    
    hasRedirected.current = false
  }, [location.pathname, setLastVisitedPath, clearLastVisitedPath])

  useEffect(() => {
    const isPageRefresh = 
      window.performance?.navigation?.type === 1 ||
      performance.getEntriesByType('navigation').some(nav => nav.type === 'reload')

    if (isPageRefresh && isFirstRender.current) {
      if (lastVisitedPath && 
          lastVisitedPath !== '/' && 
          window.location.pathname !== lastVisitedPath) {
        
        hasRedirected.current = true
        window.location.replace(lastVisitedPath)
      }
    }
    
    isFirstRender.current = false
  }, [lastVisitedPath])

  return null
}

// 封禁弹窗组件
function BanModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="h-2 bg-red-500" />
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">账号已被封禁</h3>
                <p className="text-sm text-gray-500">您的账号因违反社区规定已被封禁</p>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">封禁状态：</span>
                  <span className="font-medium text-red-600">永久封禁</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">封禁原因：</span>
                  <span className="font-medium text-gray-900">违反社区准则</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">封禁时间：</span>
                  <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              如有疑问，请联系管理员进行申诉。
              <br />
            </p>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 创建一个内部组件来处理封禁逻辑和导航
function BanHandler({ showBanModal, setShowBanModal }) {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路径
  const logOut = useLogOut();
  const getUserStatus = useGetUserStatus();
  const [hasCheckedBanStatus, setHasCheckedBanStatus] = useState(false);
  const update = UserStore((state) => state.update);

  useEffect(() => {
    // 如果在登录页，不检查封禁状态
    if (location.pathname === '/login') {
      return;
    }

    if(hasCheckedBanStatus) {
      return;
    }

    const getUserStatusData = async () => {
      try {
        const result = await getUserStatus.mutateAsync();
        setShowBanModal(result.status === 1);
        update(result)
        setHasCheckedBanStatus(true);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };
    getUserStatusData();
  }, [location.pathname]); // 添加 location.pathname 作为依赖

  const handleBanModalClose = () => {
    logOut();
    navigate('/login');
  };

  // 如果在登录页，永远不显示弹窗
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <BanModal 
      isOpen={showBanModal} 
      onClose={handleBanModalClose}
    />
  );
}

export default function RootRouter() {
  const [showBanModal, setShowBanModal] = useState(false);

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
          index: true,
          page: <Dashboard/>
        },
        {
          path: "content-audit",
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
                  return <Route key={i} index element={ir.page} />
                } else {
                  return <Route key={i} path={ir.path} element={ir.page} />
                }
              })}
            </Route>
          ) : (
            <Route key={index} path={r.path} element={r.page} />
          )
        ))}
      </Routes>
      
      {/* 使用 BanHandler 组件来处理封禁逻辑 */}
      <BanHandler 
        showBanModal={showBanModal} 
        setShowBanModal={setShowBanModal}
      />
    </BrowserRouter>
  )
}