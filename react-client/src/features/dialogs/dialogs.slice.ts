import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Dialog, Message } from "../../app/types"
import { dialogApi } from "../../app/services/dialogApi"
import { RootState } from "../../app/store"
import { messageApi } from "../../app/services/messageApi"

interface InitialState {
  dialogs: Dialog[] | null
  currentDialog: Dialog | null
}

const initialState: InitialState = {
  dialogs: null,
  currentDialog: null,
}

export const slice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload

      if (state.currentDialog) {
        state.currentDialog.messages = [
          ...state.currentDialog.messages,
          message,
        ]
      }
      // state.dialogs
      //   ?.find(dialog => dialog.id === message.dialogID)
      //   ?.messages.push(message)
    },
    resetCurrentDialog: state => {
      state.currentDialog = null
    },
    setDialog: (state, action: PayloadAction<Dialog>) => {
      state.dialogs?.push(action.payload)
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        dialogApi.endpoints.getAllDialogs.matchFulfilled,
        (state, action) => {
          console.log(action.payload)
          state.dialogs = action.payload
        },
      )
      .addMatcher(
        dialogApi.endpoints.getDialogById.matchFulfilled,
        (state, action) => {
          state.currentDialog = action.payload
        },
      )
      .addMatcher(
        messageApi.endpoints.sendMessage.matchFulfilled,
        (state, action) => {
          const message = action.payload
          const existingDialog = state.dialogs?.find(
            dialog => dialog.id === message.dialogID,
          )
          if (!existingDialog) {
            state.dialogs?.push(message.dialog)
            console.log(message.dialog);
            
            state.currentDialog = message.dialog
          }
          if (state.currentDialog) {
            state.currentDialog.messages.push(message)
          }
        },
      )
  },
})

export const { setMessage, resetCurrentDialog, setDialog } = slice.actions
export default slice.reducer

export const selectDialogs = (state: RootState) => state.dialogs.dialogs
export const selectCurrentDialog = (state: RootState) =>
  state.dialogs.currentDialog
