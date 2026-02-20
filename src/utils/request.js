import axios from 'axios';
import { getFromLocalStorage, saveToLocalStorage, TIME_UNITS } from './localStorage';

const API_BASE_URL = "https://www.h10eaea4e.nyat.app:48561"; // 可以根据环境变量配置

// 请求配置
export const createRequestOptions = (options = {}) => ({
  showError: true,
  showSuccess: false,
  errorMessage: '',
  successMessage: '',
  needToken: true,
  ...options
});

class Request {
  constructor(options = {}) {
    this.options = options;
    this.instance = axios.create(this.baseConfig);
    this.setupInterceptors();
  }

  // 基础配置
  get baseConfig() {
    return {
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...this.options,
    };
  }

  // 设置拦截器
  setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 请求开始时间（用于计算请求耗时）
        config.startTime = Date.now();

        console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`, config);
        return config;
      },
      (error) => {
        console.error('❌ 请求拦截器错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        const endTime = Date.now();
        const startTime = response.config.startTime;
        const duration = endTime - startTime;

        console.log(`✅ 请求成功: ${response.config.url} (${duration}ms)`, response.data);
        
        // 统一响应格式处理
        if (response.data && typeof response.data === 'object') {
          return {
            ...response,
            data: response.data
          };
        }
        return response;
      },
      (error) => {
        const endTime = Date.now();
        const startTime = error.config?.startTime;
        const duration = startTime ? endTime - startTime : 'unknown';

        console.error(`❌ 请求失败: ${error.config?.url} (${duration}ms)`, error);
        return this.handleError(error);
      }
    );
  }

  getToken() {
    // 假设token存储在localStorage
    return getFromLocalStorage('access_token') 
  }

  hasToken(){
    return this.getToken===null
  }

  // 保存token,7天
  saveToken(token) {
    saveToLocalStorage('access_token', token,{
      expiresIn:TIME_UNITS.DAY*7
    });
  }

  // 错误处理
  handleError(error) {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          this.handleForbidden();
          break;
        case 404:
          this.handleNotFound();
          break;
        case 500:
          this.handleServerError();
          break;
        default:
          this.handleCommonError(data?.message || error.message);
      }

      const apiError = {
        code: data?.code || status,
        message: data?.message || error.message,
      };

      return Promise.reject(apiError);
    } else if (error.request) {
      // 请求发送失败
      const apiError = {
        code: -1,
        message: '网络连接错误，请检查网络设置',
      };
      return Promise.reject(apiError);
    } else {
      // 其他错误
      const apiError = {
        code: -2,
        message: error.message,
      };
      return Promise.reject(apiError);
    }
  }

  // 错误处理辅助方法
  handleUnauthorized() {
    // 清除token并跳转到登录页
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    // 这里可以使用路由跳转，根据你的路由库调整
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  handleForbidden() {
    console.warn('没有权限访问该资源');
  }

  handleNotFound() {
    console.warn('请求的资源不存在');
  }

  handleServerError() {
    console.error('服务器内部错误');
  }

  handleCommonError(message) {
    console.error(`请求失败: ${message}`);
  }

  // 公共请求方法
  async request(config, options = {}) {
    try {
      const mergedOptions = createRequestOptions(options);
      const response = await this.instance.request({
        ...config,
        ...mergedOptions,
      });

      return response.data;
    } catch (error) {
      // 可以根据options.showError决定是否显示错误提示
      if (options.showError !== false) {
        this.showError(error.message || '请求失败');
      }
      throw error;
    }
  }

  // 显示错误消息（可以根据需要实现UI提示）
  showError(message) {
    console.error('请求错误:', message);
    // 这里可以集成antd的message或自定义toast
    // message.error(message);
  }

  // GET 请求
  async get(url, params, options = {}) {
    return this.request({
      method: 'GET',
      url,
      params,
    }, options);
  }

  // POST 请求
 async post(url, data, params = {}, options = {}) {
    return this.request({
      method: 'POST',
      url,
      data,
      params, // 添加 params 参数
    }, options);
  }

  // DELETE 请求
  async delete(url, params, options = {}) {
    return this.request({
      method: 'DELETE',
      url,
      params,
    }, options);
  }

  // 上传文件
  async upload(url, formData, options = {}) {
    return this.request({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }, options);
  }
}

// 创建默认实例
const request = new Request();

export default request;