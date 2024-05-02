import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Dialog, Message } from "../../app/types"
import { dialogApi } from "../../app/services/dialogApi"
import { RootState } from "../../app/store"
import { messageApi } from "../../app/services/messageApi"
import { isDialog, isMessage } from "../../app/type_guards"

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
      } else {
        state.dialogs
          ?.find(dialog => dialog.id === message.dialogID)
          ?.messages.push(message)
      }
    },
    resetCurrentDialog: state => {
      state.currentDialog = null
    },
    setCurrentDialog: (state, action: PayloadAction<Dialog>) => {
      state.currentDialog = action.payload
    },
    setDialog: (state, action: PayloadAction<Dialog>) => {
      const existingDialog = state.dialogs?.find(
        dialog => dialog.id === action.payload.id,
      )
      if (!existingDialog)
        state.dialogs = state.dialogs
          ? [...state.dialogs, action.payload]
          : [action.payload]
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
          if(isMessage(action.payload)) {
            const message = action.payload
            if (state.currentDialog) {
              state.currentDialog.messages.push(message)
            }
          }
          console.log(action.payload);
          
          console.log("message: " + isMessage(action.payload));
          console.log("dialog: " + isDialog(action.payload));
          if(isDialog(action.payload)) {
            const dialog = action.payload
            
            state.currentDialog = dialog
            state.dialogs?.push(dialog)
          }
        },
      )
  },
})

export const { setMessage, resetCurrentDialog, setDialog, setCurrentDialog } = slice.actions
export default slice.reducer

export const selectDialogs = (state: RootState) => state.dialogs.dialogs
export const selectCurrentDialog = (state: RootState) =>
  state.dialogs.currentDialog
