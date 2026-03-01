export class RedirectHelper {
  
  /**
   * 执行登录重定向
   */
static redirectToLogin() {
  try {
    // 直接跳转到目标URL
    window.location.href = 'https://i.sdu.edu.cn/cas/proxy/login/page?forward=http%3A%2F%2F172.24.37.149%3A8080%2Flogin';
    
  } catch (error) {
    console.error('跳转失败:', error);
    // 备用跳转
    window.location.href = 'https://i.sdu.edu.cn/cas/login';
  }
}
}
