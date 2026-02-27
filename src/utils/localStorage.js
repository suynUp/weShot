/**
 * 带过期时间的数据结构
 * @typedef {Object} StorageItemWithExpiry
 * @property {any} value - 存储的实际数据
 * @property {number} expiry - 过期时间戳（毫秒）
 * @property {number} [timestamp] - 存储时间戳（毫秒）
 */

/**
 * localStorage键名常量
 * @description 集中管理localStorage的键名，避免硬编码
 */
export const LOCAL_STORAGE_KEYS = {
  /** 当前用户信息键名 */
  USER: 'user_detail',
  USERID: 'user_id', 
  DRAFTLIST: 'draft_list',
  DRAFTDETAILIST:'draft_detail_list',
  MYORDER:'my_order',
  POST_DRAFTLIST:'post_draft_list',
};

/**
 * 时间单位常量
 */
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000, // 近似值
  YEAR: 365 * 24 * 60 * 60 * 1000, // 近似值
};


/**
 * 安全地从localStorage获取数据（支持过期校验）
 * @param {string} key localStorage中的键名
 * @param {any} defaultValue 当键不存在或解析失败时的默认值
 * @returns {any} 解析后的数据或默认值
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    // 检查localStorage是否可用
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return defaultValue;
    }

    const item = window.localStorage.getItem(key);
    
    // 如果键不存在，返回默认值
    if (item === null) {
      return defaultValue;
    }

    // 尝试解析JSON数据
    const parsedItem = JSON.parse(item);
    
    // 检查是否是带过期时间的数据结构
    if (parsedItem && typeof parsedItem === 'object' && 'value' in parsedItem && 'expiry' in parsedItem) {
      // 检查是否已过期
      if (Date.now() > parsedItem.expiry) {
        console.log(`Item with key "${key}" has expired, removing...`);
        // 自动移除过期数据
        window.localStorage.removeItem(key);
        return defaultValue;
      }
      // 返回实际存储的值
      return parsedItem.value;
    }
    
    // 如果是普通数据，直接返回
    return parsedItem;
  } catch (error) {
    // 解析失败时记录错误并返回默认值
    console.error(`Error parsing localStorage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * 安全地向localStorage保存数据（支持设置过期时间）
 * @param {string} key localStorage中的键名
 * @param {any} value 要保存的数据
 * @param {Object} options 保存选项
 * @param {number} [options.expiresIn] - 过期时间（毫秒）
 * @param {Date|number} [options.expiresAt] - 过期时间点（Date对象或时间戳）
 * @returns {boolean} 是否保存成功
 */
export const saveToLocalStorage = (key, value, options = {expiresIn:TIME_UNITS.DAY*7}) => {
  try {
    // 检查localStorage是否可用
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return false;
    }
    
    let itemToStore = value;
    
    // 如果设置了过期时间，包装数据结构
    if (options.expiresIn || options.expiresAt) {
      const expiry = options.expiresAt 
        ? (options.expiresAt instanceof Date ? options.expiresAt.getTime() : options.expiresAt)
        : Date.now() + (options.expiresIn || 0);
      
      /** @type {StorageItemWithExpiry} */
      itemToStore = {
        value,
        expiry,
        timestamp: Date.now(),
      };
    }
    
    console.log('Saving to localStorage:', key, itemToStore);
    
    // 序列化数据并保存
    const serializedValue = JSON.stringify(itemToStore);
    window.localStorage.setItem(key, serializedValue);
    
    return true;
  } catch (error) {
    // 保存失败时记录错误
    console.error(`Error saving to localStorage with key "${key}":`, error);
    return false;
  }
};

/**
 * 获取带过期时间的数据（包含元信息）
 * @param {string} key localStorage中的键名
 * @returns {StorageItemWithExpiry|null} 带过期信息的数据或null
 */
export const getFromLocalStorageWithMeta = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return null;
    }

    const item = window.localStorage.getItem(key);
    
    if (item === null) {
      return null;
    }

    const parsedItem = JSON.parse(item);
    
    // 检查是否是带过期时间的数据结构
    if (parsedItem && typeof parsedItem === 'object' && 'value' in parsedItem && 'expiry' in parsedItem) {
      return parsedItem;
    }
    
    // 如果是普通数据，包装成统一格式
    return {
      value: parsedItem,
      expiry: null,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error);
    return null;
  }
};


/**
 * 检查指定键的数据是否已过期
 * @param {string} key localStorage中的键名
 * @returns {boolean|null} 是否过期（null表示键不存在或解析失败）
 */
export const isLocalStorageItemExpired = (key) => {
  const item = getFromLocalStorageWithMeta(key);
  
  if (!item) {
    return null;
  }
  
  // 如果没有设置过期时间，返回false（永不过期）
  if (item.expiry === null || item.expiry === undefined) {
    return false;
  }
  
  return Date.now() > item.expiry;
};

/**
 * 清理所有过期的localStorage项
 * @returns {number} 清理的项数
 */
export const cleanupExpiredLocalStorage = () => {
  let cleanedCount = 0;
  
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return 0;
    }
    
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        if (isLocalStorageItemExpired(key)) {
          window.localStorage.removeItem(key);
          cleanedCount++;
          i--; // 因为移除了一个项，索引需要减1
        }
      }
    }
    
    console.log(`Cleaned up ${cleanedCount} expired items from localStorage`);
    return cleanedCount;
  } catch (error) {
    console.error('Error cleaning up expired localStorage items:', error);
    return cleanedCount;
  }
};

/**
 * 从localStorage移除指定键的数据
 * @param {string} key 要移除的键名
 * @returns {boolean} 是否移除成功
 */
export const removeFromLocalStorage = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return false;
    }

    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * 清空localStorage中的所有数据
 * @returns {boolean} 是否清空成功
 */
export const clearLocalStorage = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
      return false;
    }

    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export const cleanLocalStorageByKeys = (excludeKeys = []) => {
  const allKeys = Object.values(LOCAL_STORAGE_KEYS);
  const cleanedKeys = [];
  
  allKeys.forEach(key => {
    // 如果不在排除列表中，就清理
    if (!excludeKeys.includes(key)) {
      localStorage.removeItem(key);
      cleanedKeys.push(key);
      console.log(`已清理 localStorage: ${key}`);
    }
  });
  
  return cleanedKeys;
};