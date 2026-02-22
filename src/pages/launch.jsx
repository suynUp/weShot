import { ChevronLeft, Inbox, Plus, Save, Send, X } from "lucide-react";
import LaunchInput from "../components/launchInput";
import { useCallback, useEffect, useState } from "react";
import { DraftStore } from "../store/draftStore";
import DraftShifter from "../components/draftShifter";
import { useDeleteDraftMutation, useGetDraft, useSaveDraftMutation } from "../hooks/useDraft";
import { useNavigation } from "../hooks/navigation";
import { useToast } from "../hooks/useToast";
import { useCreateOrders } from "../hooks/useOrder";

const Launch = () => {
    //路由
    const { goBack } = useNavigation();
    const toast = useToast();

    //表格控制 - 直接使用给定的数据结构，但保留原有的摄影师预约设计
    const [photographerId, setPhotographerId] = useState("");           // 摄影师ID
    const [type, setType] = useState("");                          // 拍摄类型，默认毕业照
    const [shootTime, setShootTime] = useState(new Date());             // 拍摄时间
    const [duration, setDuration] = useState(0);                        // 拍摄时长
    const [location, setLocation] = useState("");      // 地点，默认软件园校区
    const [subjectCount, setSubjectCount] = useState(0);                // 拍摄人数
    const [price, setPrice] = useState(0);                              // 报酬
    const [needEquipment, setNeedEquipment] = useState('yes');          // 是否需要专业设备 (yes/no)
    const [contactInfo, setContactInfo] = useState("");                 // 联系方式
    const [remark, setRemark] = useState("");                         // 备注
    
    // 保留您原有的摄影师预约设计
    const [special, setSpecial] = useState('no');

    // 更新inputList以使用新的变量名，但保留原有的摄影师预约设计
    const inputList = [
        {
            title: "起始时间",
            type: "datePicker",
            content: shootTime,
            setContent: setShootTime,
            necessary: true
        }, {
            title: "拍摄时长(h)",
            type: "number",
            content: duration,
            setContent: setDuration,
            placeholder: "例如：2.5",
            necessary: true
        }, {
            title: "地点",
            placeholder: "山东大学软件园",
            content: location,
            setContent: setLocation,
            necessary: true
        }, {
            title: "拍摄人数",
            type: 'number',
            content: subjectCount,
            setContent: setSubjectCount,
            placeholder: "例如：3",
            necessary: true
        }, {
            title: "报酬(￥)",
            type: 'number',
            step: '0.01',
            content: price,
            setContent: setPrice,
            placeholder: "例如：500.00",
            necessary: true
        }, {
            title: '是否需要专业设备',
            type: 'option',
            options: 'equipment',
            content: needEquipment,
            setContent: setNeedEquipment,
            necessary: true
        }, {
            title: '拍摄风格类型',
            subtitle: '类型：人物写真/毕业照/活动记录/小动物/其它',
            content: type,
            setContent: setType,
            placeholder: "例如：毕业照",
            necessary: true
        }, {
            title: '联系方式(Q/V/电话)',
            placeholder: '点击输入',
            content: contactInfo,
            setContent: setContactInfo,
            necessary: true
        }, {
            title: '是否预约特定摄影师',
            type: 'option',
            options: 'grapher',
            content: special,
            setContent: setSpecial,
            necessary: true
        }, {
            title: '你要预约的摄影师id',
            content: photographerId,
            setContent: setPhotographerId,
            placeholder: "请输入摄影师ID",
            necessary: special === 'yes'
        }, {
            title: '其它问题与需求',
            type: 'textarea',
            necessary: false,
            content: remark,
            setContent: setRemark,
            placeholder: "如有特殊需求，请在此说明..."
        }
    ];

    //视图控制
    const [hasload, setHasLoad] = useState(false);
    const [loadId, setLoadId] = useState(-1);
    const [isLuaching, setIsLaunching] = useState(false); // 发布中状态
    const [isSavingDraft, setIsSavingDraft] = useState(false); // 保存草稿中状态

    //UI信息绑定
    const draftList = DraftStore(state => state.draftList);
    const currentDraft = DraftStore(state => state.currentDraft);

    //hooks
    const deleteMutation = useDeleteDraftMutation(); // 删除草稿的 mutation
    const saveMutation = useSaveDraftMutation(); // 保存草稿的 mutation
    const createOrderMutation = useCreateOrders(); // 创建order的 mutation
    const { getDetail, getList } = useGetDraft();

     // 从草稿加载数据
    const loadDraftData = useCallback((draftData) => {
        try {
            // 解析草稿数据并填充表单
            if (draftData.type) {
                setType(draftData.type);
            }
            if (draftData.shootTime) {
                setShootTime(new Date(draftData.shootTime));
            }
            if (draftData.duration) {
                // 移除 "h" 后缀并转换为数字
                const durationValue = typeof draftData.duration === 'string' 
                    ? parseFloat(draftData.duration.replace('h', '')) 
                    : draftData.duration;
                setDuration(durationValue || 0);
            }
            if (draftData.location) {
                setLocation(draftData.location);
            }
            if (draftData.subjectCount) {
                setSubjectCount(draftData.subjectCount);
            }
            if (draftData.price) {
                setPrice(draftData.price);
            }
            if (draftData.needEquipment !== undefined) {
                setNeedEquipment(draftData.needEquipment ? 'yes' : 'no');
            }
            if (draftData.contactInfo) {
                setContactInfo(draftData.contactInfo);
            }
            if (draftData.remark) {
                setRemark(draftData.remark);
            }
            if (draftData.photographerId) {
                setSpecial('yes');
                setPhotographerId(draftData.photographerId);
            } else {
                setSpecial('no');
                setPhotographerId("");
            }
            
            toast.success('草稿加载成功');
            setHasLoad(false); // 关闭草稿箱
            setLoadId(-1); // 重置加载ID
        } catch (error) {
            toast.error('加载草稿失败');
        }
    }, []);

    useEffect(() => {
        getList();
    },[])

    useEffect(() => {
        if(loadId !== -1&&hasload){
            getDetail(loadId);
        }
    },[hasload,loadId,getDetail])

    useEffect(() => {
        console.log('current changed:', currentDraft);
        if(loadId !== -1&&hasload){
            loadDraftData(currentDraft)
        }
    }, [currentDraft,loadDraftData])

    // 动画样式对象
    const slideInKeyframes = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;


    const check = () => {
        const requiredFields = [
            { value: shootTime, name: '起始时间' },
            { value: duration, name: '拍摄时长' },
            { value: location, name: '地点' },
            { value: subjectCount, name: '拍摄人数' },
            { value: price, name: '报酬' },
            { value: type, name: '拍摄风格' },
            { value: contactInfo, name: '联系方式' }
        ];

        const emptyField = requiredFields.find(field => !field.value);
        if (emptyField) {
            toast.warning(`${emptyField.name}不能为空`);
            return;
        }

        // 构建符合要求的数据结构
        const submitData = {
            photographerId: special === 'yes' ? photographerId : "",
            type: type,
            shootTime: shootTime.toISOString().replace('T', ' ').substring(0, 19),
            duration: duration + "h",
            location: location,
            subjectCount: subjectCount,
            price: price,
            needEquipment: needEquipment === 'yes',
            contactInfo: contactInfo,
            remark: remark || "无"
        };

        return submitData;
    };

    
    // 重置表单
    const handleResetForm = () => {
        setHasLoad(false);
        setLoadId(-1);
        setPhotographerId("");
        setType("");
        setShootTime(new Date());
        setDuration(0);
        setLocation("");
        setSubjectCount(0);
        setPrice(0);
        setNeedEquipment('yes');
        setContactInfo("");
        setRemark("");
        setSpecial('no');
        toast.info('表单已重置');
    };


    const handleSaveDraft = () => {
        const submitData = check();
        if (!submitData) return;
            setIsSavingDraft(true);
        try {
        saveMutation.mutate(submitData);
        } catch (error) {
            console.error('保存草稿失败:', error);
        } finally {
            setIsSavingDraft(false);
        }
    }
    
    const deleteDraft = (id) => {
        deleteMutation.mutate(id);
    };

    // 发布 - 使用新数据结构
    const handlePublish = async () => {
        const submitData = check();
        if (!submitData) return;

        console.log('发布的数据:', submitData);
        setIsLaunching(true);
        try {
            await createOrderMutation.mutateAsync(submitData);
            // 成功时不需要额外处理，因为 onSuccess 里已经做了
        } catch (error) {
            // 错误处理已经在 onError 里做了
        } finally {
            setIsLaunching(false);
        }
    };

   

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative overflow-hidden">
            {/* 添加动画样式 - 使用内联style标签 */}
            <style>
                {slideInKeyframes}
            </style>

            {/* 装饰性背景元素 */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30" />

            {/* 顶部导航栏 */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <button 
                            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group"
                            onClick={goBack}
                        >
                            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="ml-1">返回</span>
                        </button>
                        
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            发布需求
                        </h1>
                        
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => setHasLoad(!hasload)}
                                className="p-2 hover:bg-orange-50 rounded-xl transition-colors relative"
                                title="草稿箱"
                            >
                                <Inbox className="h-5 w-5 text-gray-600" />
                                {draftList.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                        {draftList.length}
                                    </span>
                                )}
                            </button>
                            
                            {isSavingDraft ? (
                                <button 
                                    disabled
                                    className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-white rounded-xl transition-all shadow-md flex items-center gap-2 text-sm cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    保存中...
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSaveDraft}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                                >
                                    <Save className="w-4 h-4" />
                                    保存草稿
                            </button>)}
                            
                            {isLuaching ? (
                                <button 
                                    disabled
                                    className="px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-white rounded-xl transition-all shadow-md flex items-center gap-2 text-sm cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                    发布中...
                                </button>
                            ) : (
                                <button 
                                    onClick={handlePublish}
                                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    发布
                            </button>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧草稿箱面板 */}
            <div className={`fixed top-16 right-0 bottom-0 z-40 transition-all duration-300 ${hasload ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="w-80 h-full bg-white/95 backdrop-blur-md shadow-2xl border-l border-orange-200/50 p-5 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-orange-800">草稿箱</h2>
                        <button 
                            onClick={() => setHasLoad(false)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    
                    <button
                        onClick={handleResetForm}
                        className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl text-orange-600 hover:from-orange-100 hover:to-amber-100 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        新建需求
                    </button>

                    <DraftShifter
                        draftlist={draftList} //列表
                        setLoadId={setLoadId} //设置加载的草稿id
                        deleteDraft={deleteDraft} //删除草稿函数
                        hasLoaded={setHasLoad}  //设置是否已经加载草稿（控制草稿箱显示）
                    />
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="relative z-10 pt-20 pb-12 px-6">
                <div className="max-w-3xl mx-auto">

                    {/* 表单区域 */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-200/50">
                        <div className="space-y-4">
                            {inputList.map((i) => (
                                (i.title !== '你要预约的摄影师id' || special === 'yes') && (
                                    <LaunchInput
                                        key={i.title}
                                        title={i.title}
                                        subtitle={i.subtitle}
                                        type={i.type}
                                        placeholder={i.placeholder}
                                        content={i.content}
                                        setContent={i.setContent}
                                        options={i.options}
                                        necessary={i.necessary}
                                        step={i.step}
                                    />
                                )
                            ))}
                        </div>

                        {/* 底部按钮 */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                onClick={goBack}
                                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            {isSavingDraft ? (
                                <button 
                                    disabled
                                    className="px-6 py-2.5 bg-gradient-to-r from-orange-100 to-amber-100 text-white rounded-xl transition-all shadow-md flex items-center gap-2 text-sm cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    保存中...
                                </button>
                            ) : (
                                <button
                                    onClick={handleSaveDraft}
                                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                                >
                                    保存草稿
                                </button>
                            )}
                            {
                                isLuaching ? (
                                    <button 
                                        disabled
                                        className="px-6 py-2.5 bg-gradient-to-r from-pink-100 to-rose-100 text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        发布中...
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePublish}
                                        className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        立即发布
                                    </button>
                                )
                            }
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Launch;