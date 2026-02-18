import { ChevronLeft, Inbox, Plus, Save, Send, X } from "lucide-react";
import LaunchInput from "../components/launchInput";
import { useEffect, useState } from "react";
import { DraftStore } from "../store/draftStore";
import DraftShifter from "../components/draftShifter";
import { useDeleteDraftMutation, useGetDraft } from "../hooks/useDraft";
import { useNavigation } from "../hooks/navigation";
import { useToast } from "../hooks/useToast";

const Launch = () => {
    //路由
    const { goBack } = useNavigation();
    const toast = useToast();

    //表格控制
    const [startDate, setStartDate] = useState(new Date());
    const [duration, setDuration] = useState(0);
    const [place, setPlace] = useState("");
    const [personNum, setPersonNum] = useState(0);
    const [pay, setPay] = useState(0);
    const [equipment, setEquipment] = useState('no');
    const [style, setStyle] = useState("");
    const [contact, setContact] = useState("");
    const [special, setSpecial] = useState('no');
    const [grapherId, setGrapherId] = useState("");
    const [notice, setNotice] = useState("");

    //视图控制
    const [hasload, setHasLoad] = useState(false);
    const [loadId, setLoadId] = useState(-1);

    //UI信息绑定
    const draftList = DraftStore(state => state.draftList);
    const cunrrentDraft = DraftStore(state => state.cunrrentDraft);

    //hooks
    const deleteMutation = useDeleteDraftMutation();
    const { getDetail, getList } = useGetDraft();

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

    // 监听删除操作的结果
    useEffect(() => {
        if (deleteMutation.isError) {
            toast.error(`删除失败：${deleteMutation.error.message}`);
        }
        if (deleteMutation.isSuccess) {
            toast.success('删除成功！');
        }
    }, [deleteMutation.isError, deleteMutation.isSuccess, deleteMutation.error]);

    const inputList = [
        {
            title: "起始时间",
            type: "datePicker",
            content: startDate,
            setContent: setStartDate,
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
            content: place,
            setContent: setPlace,
            necessary: true
        }, {
            title: "拍摄人数",
            type: 'number',
            content: personNum,
            setContent: setPersonNum,
            placeholder: "例如：3",
            necessary: true
        }, {
            title: "报酬(￥)",
            type: 'number',
            step: '0.01',
            content: pay,
            setContent: setPay,
            placeholder: "例如：500.00",
            necessary: true
        }, {
            title: '是否需要专业设备',
            type: 'option',
            options: 'equipment',
            content: equipment,
            setContent: setEquipment,
            necessary: true
        }, {
            title: '拍摄风格类型',
            subtitle: '类型：人物写真/毕业照/活动记录/小动物/其它',
            content: style,
            setContent: setStyle,
            placeholder: "例如：毕业照",
            necessary: true
        }, {
            title: '联系方式(Q/V/电话)',
            placeholder: '点击输入',
            content: contact,
            setContent: setContact,
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
            content: grapherId,
            setContent: setGrapherId,
            placeholder: "请输入摄影师ID",
            necessary: special === 'yes'
        }, {
            title: '其它问题与需求',
            type: 'textarea',
            necessary: false,
            content: notice,
            setContent: setNotice,
            placeholder: "如有特殊需求，请在此说明..."
        }
    ];

    const deleteDraft = (id) => {
        deleteMutation.mutate(id);
    };

    // 保存草稿
    const handleSaveDraft = () => {
        const requiredFields = [
            { value: startDate, name: '起始时间' },
            { value: duration, name: '拍摄时长' },
            { value: place, name: '地点' },
            { value: personNum, name: '拍摄人数' },
            { value: pay, name: '报酬' },
            { value: style, name: '拍摄风格' },
            { value: contact, name: '联系方式' }
        ];

        const emptyField = requiredFields.find(field => !field.value);
        if (emptyField) {
            toast.warning(`${emptyField.name}不能为空`);
            return;
        }

        toast.success('草稿保存成功！');
    };

    // 发布
    const handlePublish = () => {
        const allFields = [
            { value: startDate, name: '起始时间' },
            { value: duration, name: '拍摄时长' },
            { value: place, name: '地点' },
            { value: personNum, name: '拍摄人数' },
            { value: pay, name: '报酬' },
            { value: equipment, name: '设备要求' },
            { value: style, name: '拍摄风格' },
            { value: contact, name: '联系方式' },
            { value: special, name: '预约特定摄影师' }
        ];

        const emptyField = allFields.find(field => !field.value);
        if (emptyField) {
            toast.warning(`${emptyField.name}不能为空`);
            return;
        }

        if (special === 'yes' && !grapherId) {
            toast.warning('请填写摄影师ID');
            return;
        }

        toast.success('发布成功！');
    };

    // 重置表单
    const handleResetForm = () => {
        setStartDate(new Date());
        setDuration(0);
        setPlace("");
        setPersonNum(0);
        setPay(0);
        setEquipment('no');
        setStyle("");
        setContact("");
        setSpecial('no');
        setGrapherId("");
        setNotice("");
        toast.info('表单已重置');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative overflow-hidden">
            {/* 添加动画样式 - 使用内联style标签 */}
            <style>
                {slideInKeyframes}
            </style>

            {/* Toast提示容器 */}
            <toast.ToastContainer />

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
                            
                            <button 
                                onClick={handleSaveDraft}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                保存草稿
                            </button>
                            
                            <button 
                                onClick={handlePublish}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                            >
                                <Send className="w-4 h-4" />
                                发布
                            </button>
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
                        draftlist={draftList}
                        setLoadId={setLoadId}
                        deleteDraft={deleteDraft}
                        hasLoaded={setHasLoad}
                    />
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="relative z-10 pt-20 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* 进度指示器 */}
                    <div className="mb-8 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                            <div className="w-16 h-1 bg-orange-200 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">2</div>
                            <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">3</div>
                        </div>
                    </div>

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
                            <button
                                onClick={handleSaveDraft}
                                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                            >
                                保存草稿
                            </button>
                            <button
                                onClick={handlePublish}
                                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
                            >
                                立即发布
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Launch;