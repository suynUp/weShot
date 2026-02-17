const LaunchInput = ({
    title,
    subtitle = null,
    type='input',
    placeholder='',
    content,
    setContent,
    step="any",
    necessary = true,
    options
}) =>{

    const getType = () => {
        if(type==='input'){
            return <input value={content} onChange={(e)=>setContent(e.target.value)} className="w-[95%]" placeholder={placeholder}/>
        }else if(type === 'option'){
            return <>
            <div className="flex flex-col text-left">
                <label>
                    <input
                    
                    type="radio"
                    name={options}
                    value="yes"
                    checked={content === 'yes'}
                    onChange={(e) => setContent(e.target.value)}
                    />
                    是
                </label>
                
                <label>
                    <input
                    type="radio"
                    name={options}
                    value="no"
                    checked={content === 'no'}
                    onChange={(e) => setContent(e.target.value)}
                    />
                    否
                </label>
            </div>
            </>
        }else if(type === 'datePicker'){
            return <div>我是日历</div>
        }else if(type === 'number'){
            return <input type="number" step={step}></input>
        }
    }

    return <div className="flex flex-col p-5 mt-5 bg-pink-100 rounded-lg">
        <div className="flex">
            {necessary&&<p className="text-red-500">*</p>}
            <p>{title}</p>
        </div>
        {subtitle&&<div className="text-left">
            {subtitle}
            </div>}
        {getType()}
    </div>
}

export default LaunchInput