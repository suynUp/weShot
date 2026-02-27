// hooks/useProfileData.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserStore } from '../store/userStore';
import { useGetMyOrder, useGetMyPost, useGetOtherOrdersMutation, useGetOtherPostsMutation, useUserMutation } from '../hooks/useUser';
import UserAPI from '../api/userAPI';
import { useGetOrder } from './useOrder';

export const useProfileData = () => {
  // 从URL查询参数获取要查看的用户ID，例如: /profile?casId=123
  const [searchParams] = useSearchParams();
  const casId = searchParams.get('casId');
  
  // 当前登录用户信息
  const currentUser = UserStore(state => state.user);
  
  // 判断是否是自己的主页：没有casId参数 或者 casId等于当前用户ID
  const isOwnProfile = !casId || casId === currentUser?.casId;
  
  // 存储查看他人主页时的目标用户信息
  const [targetUser, setTargetUser] = useState(null);
  
  // ========== 帖子相关数据 ==========
  // 当前展示的帖子列表（自己的帖子 或 他人的帖子）
  const postsData = UserStore(state => isOwnProfile ? state.myPosts : state.viewUserPosts);
  // 帖子总数
  const totalPostNum = UserStore(state => isOwnProfile ? state.totalPost : state.viewUserTotalPost);
  
  // ========== 自己的主页相关数据 ==========
  // 我发起的订单列表（仅自己可见）
  const myOrdersData = UserStore(state => state.myOrders);
  // 我发起的订单总数
  const totalOrdersNum = UserStore(state => state.totalOrders);
  
  // 我接收的订单列表（仅摄影师自己可见）
  const receivedOrdersData = UserStore(state => state.myReceivedOrders);
  // 我接收的订单总数
  const totalReceivedNum = UserStore(state => state.totalReceived);
  
  // ========== 他人主页相关数据 ==========
  // 他人的已完成订单列表（对方是摄影师时可见）
  const userCompletedOrders = UserStore(state => state.userCompletedOrders);
  // 他人的已完成订单总数
  const totalCompletedOrders = UserStore(state => state.totalCompletedOrders);
  
  // 判断当前展示的用户是否是摄影师
  // 自己的主页：从store获取isVerFied；他人的主页：判断目标用户的role是否为2
  const isPhotographer = UserStore(state => isOwnProfile ? state.isVerFied : targetUser?.role === 2 || false);
  
  // 当前展示的用户信息（自己的信息 或 他人的信息）
  const profileData = isOwnProfile ? UserStore(state => state.user) : targetUser;

  // ========== Hooks ==========
  // 获取自己的订单
  const useGetMyOrderMutation = useGetMyOrder();
  // 获取自己的帖子
  const useGetPostsMutation = useGetMyPost();
  // 获取当前用户信息
  const getUserMutation = useUserMutation();
  // 获取他人的帖子
  const useGetUserPostsMutation = useGetOtherPostsMutation();
  // 获取他人的订单
  const useGetUserOrdersMutation = useGetOtherOrdersMutation();

  const { getMyAllPendings } = useGetOrder();

  // 获取目标用户信息（查看他人主页时调用）
  const fetchTargetUserInfo = async (userId) => {
    try {
      const res = await UserAPI.getOtherUserById(userId);
      setTargetUser(res.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (isOwnProfile) {
      // 自己的主页：获取自己的用户信息
      getUserMutation.mutate();
    } else if (casId) {
      // 他人的主页：获取目标用户信息
      fetchTargetUserInfo(casId);
    }
  }, [casId, isOwnProfile]);

  return {
    // 基础数据
    casId,                    // 从URL获取的用户ID
    currentUser,              // 当前登录用户信息
    isOwnProfile,             // 是否是自己的主页
    targetUser,               // 查看他人时的目标用户信息
    profileData,              // 当前展示的用户信息
    isPhotographer,           // 当前展示的用户是否是摄影师
    
    // Store 数据
    postsData,                // 帖子列表
    totalPostNum,             // 帖子总数
    myOrdersData,             // 我发起的订单列表
    totalOrdersNum,           // 我发起的订单总数
    receivedOrdersData,       // 我接收的订单列表
    totalReceivedNum,         // 我接收的订单总数
    userCompletedOrders,      // 他人的已完成订单列表
    totalCompletedOrders,     // 他人的已完成订单总数
    
    // Hooks
    useGetMyOrderMutation,    // 获取自己订单的 mutation
    useGetPostsMutation,      // 获取自己帖子的 mutation
    getUserMutation,          // 获取用户信息的 mutation
    useGetUserPostsMutation,  // 获取他人帖子的 mutation
    useGetUserOrdersMutation, // 获取他人订单的 mutation
    getMyAllPendings          // 获取待处理订单的函数（待实现）
  };
};