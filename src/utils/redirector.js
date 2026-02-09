export class RedirectHelper {
  
  /**
   * 执行登录重定向
   */
  static redirectToLogin() {
    try {
      // 直接拼接认证URL，假设你知道完整的URL结构
      const serviceUrl = encodeURIComponent('https://www.h10eaea4e.nyat.app:48561/login');
      const authUrl = `https://i.sdu.edu.cn/cas/proxy/login/page?forward=${serviceUrl}`;
      
      // 直接跳转到认证页面
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('跳转失败:', error);
      // 如果出错，至少尝试跳转到基础登录页
      window.location.href = 'https://i.sdu.edu.cn/cas/login';
    }
  }
}
