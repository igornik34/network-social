import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { api } from "./services/api"
import user from "../features/user/user.slice"
import dialogs from "../features/dialogs/dialogs.slice"
import { listenerMiddleware } from "../middleware/auth"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user,
    dialogs
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
