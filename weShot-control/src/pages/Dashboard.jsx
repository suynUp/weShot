import { Routes, Route, Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx' 
import ContentAudit from './ContentAudit.jsx'
import UserManage from './UserManage.jsx'
import FeedbackManage from './FeedbackManage.jsx'
import styles from './Dashboard.module.css'
import task1 from '../assets/img/task1.png'
import task2 from '../assets/img/task2.png'
import task3 from '../assets/img/task3.png'
import task4 from '../assets/img/task4.png'

function Dashboard() {
  // 模拟数据（只能模拟 value无效
  const linkTo = [ 
    { goto: Layout, label: '仪表盘' },
    { goto: ContentAudit, label: '内容审核' }
  ];
  const stats = [
    { icon: task1, title: ['待审核', '内容'], value: 1, goto: "/content-audit" },
    { icon: task2, title: ['今日', '新增用户'], value: 3 ,goto: "/user-manage"},
    { icon: task3, title: ['未处理', '反馈'], value: 1, goto: "/feedback-manage"},
    { icon: task4, title: ['今日', '新增订单'], value: 2, goto: "/content-audit"},
  ];

  // 问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好（这个时间还要工作吗？）';
    if (hour < 12) return '上午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div>
      <div className={styles.greeting}>
        {getGreeting()}，管理员！
      </div>

      {/* 任务卡片 */}
      <div className={styles.statsGrid}>
        {stats.map((item, index) => (
          <Link to={item.goto} key={index} className={styles.statCard}>
            {/* 图标+标题 */}
            <div className={styles.cardLeft}>
              <img src={item.icon} alt="任务图标" className={styles.taskImg} />
              <div className={styles.cardTitle}>
                {item.title.map((text, i) => (
                  <div key={i}>{text}</div>
                ))}
              </div>
            </div>
            {/* 右侧 任务数字
            <span className={styles.cardValue}>{item.value}</span> */}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard