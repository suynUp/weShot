// components/launchInput.jsx
const LaunchInput = ({
    title,
    subtitle = null,
    type = 'input',
    placeholder = '',
    content,
    setContent,
    step = "any",
    necessary = true,
    options
}) => {

    // 将 Date 对象转换为 YYYY-MM-DD 格式
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 处理日期变化
    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        if (dateValue) {
            // 创建新的 Date 对象，避免时区问题
            const [year, month, day] = dateValue.split('-').map(Number);
            const newDate = new Date(year, month - 1, day);
            setContent(newDate);
        } else {
            setContent(null);
        }
    };

    const getType = () => {
        if (type === 'input') {
            return (
                <input 
                    value={content || ''} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/90 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                    placeholder={placeholder}
                />
            );
        } else if (type === 'option') {
            return (
                <div className="flex gap-6 mt-2">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="radio"
                            name={options}
                            value="yes"
                            checked={content === 'yes'}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-orange-600 transition-colors">是</span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="radio"
                            name={options}
                            value="no"
                            checked={content === 'no'}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-orange-600 transition-colors">否</span>
                    </label>
                </div>
            );
        } else if (type === 'datePicker') {
            return (
                <div className="relative">
                    <input
                        type="date"
                        value={formatDateForInput(content)}
                        onChange={handleDateChange}
                        className="w-full px-4 py-3 bg-white/90 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700"
                    />
                </div>
            );
        } else if (type === 'number') {
            return (
                <input 
                    type="number" 
                    step={step}
                    value={content || ''}
                    onChange={(e) => setContent(e.target.valueAsNumber || 0)}
                    className="w-full px-4 py-3 bg-white/90 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700"
                    placeholder={placeholder}
                />
            );
        } else if (type === 'textarea') {
            return (
                <textarea
                    value={content || ''}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/90 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 resize-none"
                    placeholder={placeholder}
                />
            );
        }
    };

    return (
        <div className="flex flex-col p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100/50">
            <div className="flex items-center mb-2">
                {necessary && (
                    <span className="text-red-400 mr-1 text-lg">*</span>
                )}
                <p className="text-lg font-medium text-orange-800">{title}</p>
            </div>
            
            {subtitle && (
                <div className="text-sm text-gray-600 mb-3 bg-orange-100/50 p-3 rounded-xl border border-orange-200/50">
                    {subtitle}
                </div>
            )}
            
            <div className="mt-1">
                {getType()}
            </div>
            
            {/* 可选的小提示 */}
            {type === 'number' && (
                <p className="text-xs text-gray-400 mt-2 ml-1">支持小数输入，步长: {step}</p>
            )}
        </div>
    );
};

export default LaunchInput;