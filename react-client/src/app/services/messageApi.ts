import { Dialog, Message } from "../types"
import { api } from "./api"

export const messageApi = api.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation<
      Message | Dialog,
      { text: string; receiverId: string }
    >({
      query: ({ text, receiverId }) => ({
        url: `/message/send/${receiverId}`,
        method: "POST",
        body: { text },
      }),
    }),
    readMessage: builder.mutation<
      Message,
      { messageId: string; senderId: string }
    >({
      query: ({ messageId, senderId }) => ({
        url: `/message/read/${messageId}`,
        method: "POST",
        body: { senderId },
      }),
    }),
  }),
})

export const { useSendMessageMutation, useReadMessageMutation } = messageApi
export const {
  endpoints: { sendMessage },
} = messageApi
