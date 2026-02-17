/**
 * 防抖与节流工具类
 * 用于优化高频触发的事件处理
 */
class DebounceThrottle {
  /**
   * 防抖函数
   * @param {Function} fn 要执行的函数
   * @param {number} delay 延迟时间(ms)
   * @param {boolean} immediate 是否立即执行
   * @returns {Function} 防抖处理后的函数
   */
  static debounce(fn, delay = 300, immediate = false) {
    let timer = null;
    
    return function(...args) {
      const context = this;
      
      if (immediate && !timer) {
        // 立即执行
        fn.apply(context, args);
      }
      
      // 清除之前的定时器
      if (timer) {
        clearTimeout(timer);
      }
      
      // 设置新的定时器
      timer = setTimeout(() => {
        if (!immediate) {
          fn.apply(context, args);
        }
        timer = null;
      }, delay);
    };
  }

  /**
   * 节流函数（时间戳版-立即执行）
   * @param {Function} fn 要执行的函数
   * @param {number} delay 延迟时间(ms)
   * @returns {Function} 节流处理后的函数
   */
  static throttle(fn, delay = 300) {
    let previous = 0;
    
    return function(...args) {
      const context = this;
      const now = Date.now();
      
      if (now - previous > delay) {
        fn.apply(context, args);
        previous = now;
      }
    };
  }
}