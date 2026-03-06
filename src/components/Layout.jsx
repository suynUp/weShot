import { Outlet, Link } from 'react-router-dom'
import logo from '../assets/img/logo.png'
import ring from '../assets/img/ring.png'
import './Layout.css'
import { PrivateRoute } from './AuthGuard';
import { clearLocalStorage } from '../utils/localStorage';

function Layout() {



  return (
    <PrivateRoute
    comp={<div className="app-container">
      {/* 顶部头部栏 */}
      <div className='header-bar'>
        <div className='header-left'>
          <div className="logo-container">
            <img src={logo} alt="WE拍 Logo" className="logo-img" />
          </div>
          <div className='title'>管理</div>
        </div>
        <div className="header-right">
          <button className="notify-btn"><img src={ring} alt="通知铃铛" /></button>
          <span className="admin-name">管理员</span>
          <div className="admin-img">
            <img src="#" alt="管理员头像" />
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* 左侧导航栏 */}
        <div className='aside-bar'>
          <ul>
            <Link to="/manager" end><li>仪表盘</li></Link>
            <Link to="/manager/content-audit"><li>内容审核</li></Link>
            <Link to="/manager/user-manage"><li>用户管理</li></Link>
            <Link to="/manager/feedback-manage"><li>公告与意见反馈管理</li></Link>
          </ul>
          <div className='logout'
          onClick={()=>{
            clearLocalStorage()
          }}
          >
            退出登录
          </div>
        </div>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>}
    />
  );
}

export default Layout