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
        staleTime: 5 * 60 * 1000, 
        cacheTime: 10 * 60 * 1000, 
        refetchOnWindowFocus: false, 
        refetchOnMount: true, 
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
