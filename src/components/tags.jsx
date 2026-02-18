
// 随机生成HSL颜色
const generateRandomColor = () => {
  // 随机生成色相 (0-360)
  const hue = Math.floor(Math.random() * 360);
  // 固定饱和度为70%，亮度为90%用于背景色（浅色）
  // 文字颜色使用相同色相，饱和度为80%，亮度为40%（深色）
  return {
    background: `hsl(${hue}, 70%, 90%)`,
    text: `hsl(${hue}, 80%, 35%)`
  };
};

// 根据字符串生成稳定的颜色（相同的tag总是生成相同的颜色）
const generateStableColor = (tag) => {
  // 简单的哈希函数
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 将哈希值映射到色相 (0-360)
  const hue = Math.abs(hash % 360);
  
  return {
    background: `hsl(${hue}, 70%, 90%)`,
    text: `hsl(${hue}, 80%, 35%)`
  };
};

// 简单的标签组件 - 每次渲染随机颜色
export function RandomTag({ tag, className = '', onClick, icon: Icon }) {
  const colors = generateRandomColor();
  
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      {Icon && <Icon className="w-3.5 h-3.5" style={{ color: colors.text }} />}
      {tag}
    </span>
  );
}

// 稳定的标签组件 - 相同的tag总是显示相同的颜色
export function StableTag({ tag, className = '', onClick, icon: Icon }) {
  const colors = generateStableColor(tag);
  
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      {Icon && <Icon className="w-3.5 h-3.5" style={{ color: colors.text }} />}
      {tag}
    </span>
  );
}

// 预设颜色的标签组件 - 如果tag在预设中则使用预设颜色，否则随机
export function SmartTag({ tag, className = '', onClick, icon: Icon, presetColors = {} }) {
  // 预设颜色配置
  const defaultPresets = {
    '人像摄影': { bg: '#FCE7F3', text: '#BE185D' }, // pink
    '风光摄影': { bg: '#D1FAE5', text: '#065F46' }, // green
    '街拍摄影': { bg: '#EDE9FE', text: '#5B21B6' }, // purple
    '商业摄影': { bg: '#DBEAFE', text: '#1E40AF' }, // blue
    '婚礼摄影': { bg: '#FFE4E6', text: '#9F1239' }, // rose
    '纪实摄影': { bg: '#FEF3C7', text: '#92400E' }, // amber
    '索尼': { bg: '#E0E7FF', text: '#4338CA' }, // indigo
    '佳能': { bg: '#FEE2E2', text: '#991B1B' }, // red
    '尼康': { bg: '#FEF9C3', text: '#854D0E' }, // yellow
    '富士': { bg: '#D1FAE5', text: '#065F46' }, // emerald
    '职业摄影师': { bg: '#DBEAFE', text: '#1E40AF' }, // blue
    '自由摄影师': { bg: '#CCFBF1', text: '#115E59' }, // teal
  };
  
  const preset = { ...defaultPresets, ...presetColors }[tag];
  
  if (preset) {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
        style={{
          backgroundColor: preset.bg,
          color: preset.text
        }}
      >
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: preset.text }} />}
        {tag}
      </span>
    );
  }
  
  // 如果没有预设，使用稳定颜色
  const colors = generateStableColor(tag);
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      {Icon && <Icon className="w-3.5 h-3.5" style={{ color: colors.text }} />}
      {tag}
    </span>
  );
}