import axios from "axios"

const imgToken = "6|LcNsvMLdREu5sMnANiAverhmOeBm1zwR7zaqr0XD"

export const Upload = async (file) => {
    try {
        
        const response = await axios.post('https://image.foofish.work/api/v1/upload', 
            {file:file},
            {
                headers: {
                    'Authorization': `Bearer ${imgToken}`,  // 添加认证 token
                    'Content-Type': 'multipart/form-data'   
                }
            }
        )
        
        return response.data.data.links.url
    } catch (error) {
        console.error('上传失败:', error)
        throw error
    }
}