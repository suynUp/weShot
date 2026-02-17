import { Trash, PenLine} from "lucide-react"

const DraftShifter = ({draftlist,setLoadId,deleteDraft,hasLoaded}) => {
    return <>
        <div>
             <div className="flex
                px-4 py-3.5 rounded-xl
                bg-gradient-to-b from-rose-50 to-rose-150
                border-2 border-rose-250
                font-medium
                border-rose-300
                shadow-sm
                hover:bg-gradient-to-b hover:from-rose-100 hover:to-rose-250
                hover:border-rose-350">
                草稿箱
            </div>
            {draftlist.map((d)=>{
                return <div key={d.id} className="flex 
                px-4 py-3.5 rounded-xl
                bg-gradient-to-b from-rose-50 to-rose-150
                border-2 border-rose-250
                font-medium
                border-rose-300
                shadow-sm
                hover:bg-gradient-to-b hover:from-rose-100 hover:to-rose-250
                hover:border-rose-350" >
                    <div className="mr-[10px]">
                        <div className="text-gray-500 flex">
                        上次编辑于<p className="text-black">{d.date}</p>
                        </div>
                        <div className="text-gray-500 flex">
                            你想在<p className="text-black">{d.place}</p>拍摄
                        </div>
                    </div>
                    <div>
                        <Trash className="mb-1" onClick={()=>deleteDraft(d.id)}></Trash>
                        <PenLine onClick={()=>{
                            setLoadId(d.id)
                            hasLoaded(true)
                            }} />
                    </div>
                    
                </div>
            })}
        </div>
    </>
}

export default DraftShifter