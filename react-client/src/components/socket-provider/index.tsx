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
import { Message, User } from "../../app/types"
import { BASE_URL } from "../../constants"
import { useNavigate } from "react-router-dom"
import { AppDispatch } from "../../app/store"
import { selectDialogs, setDialog, setMessage } from "../../features/dialogs/dialogs.slice"

interface ISocketContext {
  socket: Socket | null
  onlineUsers: User[]
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  onlineUsers: [],
})

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const currentUser = useSelector(selectCurrent)
  const dialogs = useSelector(selectDialogs)
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    if (currentUser) {
      const socket = io(BASE_URL, {
        query: {
          userId: currentUser.id,
        },
      })

      setSocket(socket)

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", users => {
        setOnlineUsers(users)
      })
      socket.on("newMessage", (newMessage: Message) => {
        const existingDialog = dialogs?.find(dialog => dialog.id === newMessage.dialogID)
        if(!existingDialog) {
          dispatch(setDialog(newMessage.dialog))
        }
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
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
