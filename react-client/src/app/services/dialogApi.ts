import { url } from "inspector"
import { Dialog, Message, User } from "../types"
import { api } from "./api"

export const dialogApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllDialogs: builder.query<Dialog[], void>({
      query: () => ({
        url: "/dialogs",
        method: "GET",
      }),
    }),
    getDialogById: builder.query<Dialog, string>({
      query: receiverId => ({
        url: `/dialogs/${receiverId}`,
        method: "GET",
      }),
    }),
    getReceiverById: builder.query<User, string>({
      query: id => ({
        url: `/receiver/${id}`,
        method: "GET"
      }),
    }),
  }),
})

export const {
  useGetAllDialogsQuery,
  useGetDialogByIdQuery,
  useGetReceiverByIdQuery,
  useLazyGetAllDialogsQuery,
  useLazyGetDialogByIdQuery,
  useLazyGetReceiverByIdQuery,
} = dialogApi
export const {
  endpoints: { getAllDialogs, getDialogById, getReceiverById },
} = dialogApi
