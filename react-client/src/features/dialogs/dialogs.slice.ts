import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Dialog, Message } from "../../app/types"
import { dialogApi } from "../../app/services/dialogApi"
import { RootState } from "../../app/store"
import { messageApi } from "../../app/services/messageApi"
import { isDialog, isMessage } from "../../app/type_guards"
import { hasErrorField } from "../../utils/has-error-field"

interface InitialState {
  dialogs: Dialog[] | null
  currentDialog: {
    dialog: Dialog | null
    isNewDialog?: boolean
  }
}

const initialState: InitialState = {
  dialogs: null,
  currentDialog: { dialog: null },
}

export const slice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload

      if (state.currentDialog.dialog) {
        state.currentDialog.dialog.messages = [
          ...state.currentDialog.dialog.messages,
          message,
        ]
      } else {
        if (state.dialogs) {
          const dialogIndex = state.dialogs.findIndex(
            dialog => dialog.id === message.dialogId,
          )
          if (dialogIndex !== -1) {
            // Если диалог найден, обновите его lastMessage
            state.dialogs[dialogIndex].lastMessage = message
            // Переназначьте state.dialogs, чтобы обновить изменения
            state.dialogs = [...state.dialogs]
          }
        }
      }
    },
    readMessage: (state, action: PayloadAction<string>) => {
      if (state.currentDialog && state.currentDialog.dialog) {
        const index = state.currentDialog.dialog.messages.findIndex(
          m => m.id === action.payload,
        )
        if (index !== -1) {
          state.currentDialog.dialog.messages[index].isReaded = true
        }
      }
    },
    resetCurrentDialog: state => {
      state.currentDialog = {
        dialog: null,
      }
    },
    setCurrentDialog: (state, action: PayloadAction<Dialog>) => {
      state.currentDialog = {
        ...state.currentDialog,
        dialog: action.payload,
      }
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
          console.log(action.payload)

          if (isDialog(action.payload)) {
            state.currentDialog = {
              dialog: action.payload,
              isNewDialog: false,
            }
          }
        },
      )
      .addMatcher(
        dialogApi.endpoints.getDialogById.matchRejected,
        (state, action) => {
          console.log(action)

          if (
            hasErrorField(action.payload) &&
            action.payload.data.error === "Диалог не найден"
          ) {
            state.currentDialog = {
              dialog: null,
              isNewDialog: true,
            }
          }
        },
      )
      .addMatcher(
        messageApi.endpoints.sendMessage.matchFulfilled,
        (state, action) => {
          if (isMessage(action.payload)) {
            const message = action.payload
            if (state.currentDialog.dialog) {
              state.currentDialog.dialog.messages.push(message)
            }
          }
          console.log(action.payload)

          console.log("message: " + isMessage(action.payload))
          console.log("dialog: " + isDialog(action.payload))
          if (isDialog(action.payload)) {
            const dialog = action.payload

            state.currentDialog = {
              dialog,
            }
            state.dialogs?.push(dialog)
          }
        },
      )
      .addMatcher(
        messageApi.endpoints.readMessage.matchFulfilled,
        (state, action) => {
          if (state.currentDialog && state.currentDialog.dialog) {
            const index = state.currentDialog.dialog.messages.findIndex(
              m => m.id === action.payload.id,
            )
            if (index !== -1) {
              state.currentDialog.dialog.messages[index].isReaded = true
            }
          }
        },
      )
  },
})

export const {
  setMessage,
  resetCurrentDialog,
  setDialog,
  setCurrentDialog,
  readMessage,
} = slice.actions
export default slice.reducer

export const selectDialogs = (state: RootState) => state.dialogs.dialogs
export const selectCurrentDialog = (state: RootState) =>
  state.dialogs.currentDialog
