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
  }),
})

export const { useSendMessageMutation } = messageApi
export const {
  endpoints: { sendMessage },
} = messageApi
