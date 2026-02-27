import { useState } from "react";
import { orderAction, useCommentMutation, useManageOrderMutation } from "./useOrder";
import { useUserMutation } from "./useUser";

const useActionOrder = () => {

    const [commentLoading,setCommentLoading] = useState(false)

    const useGetCurrentUser = useUserMutation();
    const useManageMutation = useManageOrderMutation()
    const useComment = useCommentMutation()

    const handlePay = (orderId) => {
        useManageMutation.mutate({orderAction:orderAction.PAY,orderId})
    }

    const handleAccept = (orderId) => {
        useManageMutation.mutate({orderAction:orderAction.ACCEPT,orderId})
    }

    const handleReject = (orderId) => {
        useManageMutation.mutate({orderAction:orderAction.REJECT,orderId})
    }

    const handleDeliver = (orderId,deliverUrls) => {
        useManageMutation.mutate({orderAction:orderAction.DELIVER,orderId,deliverUrls})
    }

    const handleCancel = (orderId) => {
        useManageMutation.mutate({orderAction:orderAction.CANCEL,orderId})
    }

    const handleComment = (orderId,photoScore,timeScore,commScore,content) => {
        setCommentLoading(true)
        useComment.mutate({orderId,photoScore,timeScore,commScore,content},
            {onSettled:()=>setCommentLoading(false)}
        )
    }

    const commentSuccess = useComment.isSuccess
    const commentError = useComment.isError

    return {
        useGetCurrentUser,
        useManageMutation,
        
        commentError,
        commentSuccess,
        commentLoading,

        handlePay,
        handleAccept,
        handleReject,
        handleDeliver,
        handleCancel,
        handleComment
    }
}

export default useActionOrder;