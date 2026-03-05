import { Routes, Route } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './components/AuthGuard.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ContentAudit from './pages/ContentAudit.jsx'
import UserManage from './pages/UserManage.jsx'
import FeedbackManage from './pages/FeedbackManage.jsx'
import Login from './pages/login.jsx'

function App() {
  return (
    <Routes>
      {/* 公开路由：登录页，已经登录的用户不能访问
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
      </Route> */}

      {/* 私有路由：所有后台管理页面，必须登录才能访问 */}
      {/* <Route element={<PrivateRoute />}> */}
      <Route>
        <Route path="/" element={<Layout />}>
          {/* 仪表盘首页（默认页） */}
          <Route index element={<Dashboard />} />
          <Route path="content-audit" element={<ContentAudit />} />
          <Route path="user-manage" element={<UserManage />} />
          <Route path="feedback-manage" element={<FeedbackManage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App