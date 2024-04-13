import { Message } from "../types"
import { api } from "./api"

export const messageApi = api.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation<
      Message,
      { text: string; receiverId: string }
    >({
      query: ({ text, receiverId }) => ({
        url: `/send-message/${receiverId}`,
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
