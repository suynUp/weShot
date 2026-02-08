import axios from "axios";

export class RedirectHelper {
  /**
   * 调用会302重定向的接口
   * @param {string} url 接口地址
   * @param {object} options axios配置
   * @returns {Promise<string>} 重定向URL
   */
  static async getRedirectUrl(url, options = {}) {
    const instance = axios.create({
      maxRedirects: 0,
      timeout: 10000,
      ...options
    });
    
    try {
      const response = await instance.get(url);
      
      // 如果是302，返回重定向URL
      if (response.status === 302) {
        return response.headers.location;
      }
      
      throw new Error(`期望302重定向，但得到${response.status}`);
      
    } catch (error) {
      if (error.response?.status === 302) {
        return error.response.headers.location;
      }
      throw error;
    }
  }
  
  /**
   * 执行登录重定向
   */
  static async redirectToLogin() {
    try {
      const authUrl = await this.getRedirectUrl('https://www.h10eaea4e.nyat.app:48561/login');
      
      // 跳转到认证页面
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('重定向失败:', error);
    }
  }
}
