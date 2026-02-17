export const userKey={
    USER:['user'],
    OTHERUSER:(id) => ['user',`${id}`]
}

export const draftKey = {
    DRAFTLIST:['draft','list'],
    DRAFTDETAIL:(id)=>['draft',`${id}`]
}

export const orderKey = {
    MYORDERS:['orders']
}