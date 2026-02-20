import './App.css'
import { useToast } from './hooks/useToast';
import RootRouter from './rootRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

  const {ToastContainer} = useToast()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // 失败重试次数
        staleTime: 5 * 60 * 1000, // 5分钟，数据在5分钟内被认为是新鲜的
        cacheTime: 10 * 60 * 1000, // 10分钟，数据缓存时间
        refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
        refetchOnMount: true, // 组件挂载时重新获取
      },
    },
  });

  return (
    <>
            <ToastContainer/>
      <QueryClientProvider client={queryClient}>
        <RootRouter></RootRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
