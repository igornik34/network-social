import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/user.slice"
import { Socket, io } from "socket.io-client"
import { Dialog, Message, User } from "../../app/types"
import { BASE_URL } from "../../constants"
import { useNavigate } from "react-router-dom"
import { AppDispatch } from "../../app/store"
import {
  selectDialogs,
  setCurrentDialog,
  setDialog,
  setMessage,
} from "../../features/dialogs/dialogs.slice"

interface ISocketContext {
  socket: Socket | null
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
})

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const currentUser = useSelector(selectCurrent)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (currentUser) {
      const socket = io(BASE_URL, {
        query: {
          userId: currentUser.id,
        },
      })

      setSocket(socket)

      socket.on("SERVER:NEW_DIALOG", (newDialog: Dialog) => {
        console.log(newDialog);
        dispatch(setDialog(newDialog))
      })
      socket.on("SERVER:NEW_MESSAGE", (newMessage: Message) => {
        console.log(newMessage);
        dispatch(setMessage(newMessage))
      })
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
    return () => {
      socket?.close()
    }
  }, [currentUser])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
