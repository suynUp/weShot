import { ChevronLeft, Inbox } from "lucide-react"
import LaunchInput from "../components/launchInput"  
import { useState } from "react"

const Launch = () => {

    const [startDate,setStartDate] = useState(new Date())
    const [duration,setDuration] = useState(0)
    const [place,setPlace] = useState("")
    const [personNum,setPersonNum] = useState(0)
    const [pay,setPay] = useState(0)
    const [equipment,setEquipment] = useState('no')
    const [style,setStyle] = useState("")
    const [contact,setContact] = useState("")
    const [special,setSpecial] = useState('no')
    const [grapherId,setGrapherId] = useState("")
    const [notice,setNotice] = useState("")

    const inputList = [
        {
            title:"起始时间",
            type:"datePicker",
            content:startDate,
            setContent:setStartDate
        },{
            title:"拍摄时长(h)",
            type:"number",
            content:duration,
            setContent:setDuration
        },{
            title:"地点",
            placeholder:"山东大学软件园",
            content:place,
            setContent:setPlace
        },{
            title:"拍摄人数",
            type:'number',
            content:personNum,
            setContent:setPersonNum
        },{
            title:"报酬(￥)",
            type:'number',
            step:'0.00',
            content:pay,
            setContent:setPay
        },{
            title:'是否需要专业设备',
            type:'option',
            options:'equipment',
            content:equipment,
            setContent:setEquipment
        },{
            title:'拍摄风格类型',
            subtitle:'类型：人物写真/毕业照/活动记录/小动物/其它',
            content:style,
            setContent:setStyle
        },{
            title:'联系方式(Q/V/电话)',
            placeholder:'点击输入',
            content:contact,
            setContent:setContact
        },{
            title:'是否预约特定摄影师',
            type:'option',
            options:'grapher',
            content:special,
            setContent:setSpecial,
        },{
            title:'你要预约的摄影师id',
            content:grapherId,
            setContent:setGrapherId
        },{
            title:'其它问题与需求',
            necessary:false,
            content:notice,
            setContent:setNotice
        }
    ]

    return <>
    <div className="fixed top-0 left-0 right-0 z-50 w-3xl bg-white/0 ">
        <div className="flex items-center justify-between px-4 py-3 bg-transparent">
            <button className="flex items-center text-gray-700 hover:text-black">
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1">返回</span>
            </button>
            
            <div className="flex items-center space-x-4 bg-transparent">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                <Inbox className="h-6 w-6 text-gray-700" />
                </button>
                
                <button className="px-8 py-3.5 rounded-xl
                bg-gradient-to-b from-rose-50 to-rose-150
                border-2 border-rose-250
                font-medium
                border-rose-300
                shadow-sm
                hover:bg-gradient-to-b hover:from-rose-100 hover:to-rose-250
                hover:border-rose-350
                active:scale-95
                transition-all duration-400">
                保存草稿
                </button>
                <button className="px-8 py-3.5 rounded-xl
                bg-gradient-to-b from-rose-50 to-rose-150
                border-2 border-rose-250
                font-medium
                border-rose-300
                shadow-sm
                hover:bg-gradient-to-b hover:from-rose-100 hover:to-rose-250
                hover:border-rose-350
                active:scale-95
                transition-all duration-400">
                发布
                </button>
            </div>
        </div>
    </div>
    <div className="flex flex-col justify-center">
        {inputList.map((i)=>(i.title!=='你要预约的摄影师id'||special==='yes')&&<LaunchInput
        key={i.title}
        title={i.title}
        subtitle={i.subtitle}
        type={i.type}
        placeholder={i.placeholder}
        content={i.content}
        setContent={i.setContent}
        options={i.options}
        necessary={i.necessary}
        />)}
    </div>
    </>;
}

export default Launch