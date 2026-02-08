import { useNavigation } from "../hooks/navigation";

const CenterCard = () =>{

    const {goto} = useNavigation()

    return (
    <div className="grid gap-7 grid-cols-2 grid-rows-2 w-full h-full bg-gray-50">

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-3">摄影师列表</h3>
            <p className="text-gray-600">浏览专业摄影师作品集</p>
        </div>
        
        <div className="bg-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        onClick={()=>goto('/launch')}>
            <h3 className="text-xl font-bold mb-3">发表需求</h3>
            <p className="text-gray-600">发布您的摄影需求</p>
        </div>
        
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-3">排行榜</h3>
            <p className="text-gray-600">查看摄影师排名</p>
        </div>
        
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-3">摄影实践圈</h3>
            <p className="text-gray-600">加入摄影交流社区</p>
        </div>
    </div>
    );
}

export default CenterCard
