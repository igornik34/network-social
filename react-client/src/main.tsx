import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import { NextUIProvider } from "@nextui-org/react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Auth } from "./pages/auth"
import { Layout } from "./components/layout"
import { Posts } from "./pages/posts"
import { CurrentPost } from "./pages/current-post"
import { UserProfile } from "./pages/user-profile"
import { Followers } from "./pages/followers"
import { Following } from "./pages/following"
import { AuthGuard } from "./features/user/authGuard"
import { Dialogs } from "./pages/dialogs"
import { SocketProvider } from "./components/socket-provider"
import { CurrentDialog } from "./pages/current-dialog"
import { DialogsGuard } from "./features/dialogs/dialogsGuard"
import ru from "javascript-time-ago/locale/ru"
import TimeAgo from "javascript-time-ago"

const container = document.getElementById("root")
TimeAgo.addDefaultLocale(ru)
const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Posts /> },
      { path: "posts/:id", element: <CurrentPost /> },
      { path: "users/:id", element: <UserProfile /> },
      { path: "followers", element: <Followers /> },
      { path: "following", element: <Following /> },
      { path: "dialogs", element: <Dialogs /> },
      { path: "dialogs/:id", element: <CurrentDialog /> },
    ],
  },
])

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <NextUIProvider>
          <ThemeProvider>
            <AuthGuard>
              <DialogsGuard>
                <SocketProvider>
                  <RouterProvider router={router}></RouterProvider>
                </SocketProvider>
              </DialogsGuard>
            </AuthGuard>
          </ThemeProvider>
        </NextUIProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
