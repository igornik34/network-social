import React, { useEffect } from "react"
import { useSendMessageMutation } from "../../app/services/messageApi"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@nextui-org/react"
import { Link, useParams } from "react-router-dom"
import { User } from "../../components/user"
import { GoBack } from "../../components/go-back"
import {
  useGetReceiverByIdQuery,
  useLazyGetDialogByIdQuery,
} from "../../app/services/dialogApi"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/user.slice"
import {
  resetCurrentDialog,
  selectCurrentDialog,
} from "../../features/dialogs/dialogs.slice"
import { AppDispatch } from "../../app/store"
import ReactTimeAgo, { useTimeAgo } from "react-time-ago"
import ru from 'javascript-time-ago/locale/ru'
import TimeAgo from "javascript-time-ago"

TimeAgo.addDefaultLocale(ru)

export const CurrentDialog = () => {
  const { id } = useParams<{ id: string }>()
  const { data: userReceiver } = useGetReceiverByIdQuery(id ?? "")
  const [triggerCurrentDialogId] = useLazyGetDialogByIdQuery()
  const currentDialog = useSelector(selectCurrentDialog)
  const current = useSelector(selectCurrent)
  const [sendMessage] = useSendMessageMutation()
  const dispatch = useDispatch<AppDispatch>()
  const lastSeen = useTimeAgo({date: userReceiver?.lastSeen ?? 0, locale: "ru-RU"})
  

  useEffect(() => {
    triggerCurrentDialogId(id ?? "")
  }, [])

  useEffect(
    () => () => {
      dispatch(resetCurrentDialog())
    },
    [],
  )

  return (
    <>
      <GoBack />
      <Card>
        <CardHeader>
          <Link to={`/users/${userReceiver?.id}`}>
            <User
              name={userReceiver?.name ?? ""}
              className="text-small font-semibold leading-none text-default-600"
              avatarUrl={userReceiver?.avatarUrl ?? ""}
              description={userReceiver?.online ? "В сети" : lastSeen.formattedDate}
            />
          </Link>
        </CardHeader>
        
        <Divider />
        <CardBody className="flex flex-col p-4">
          <ScrollShadow className="w-full h-[60vh]" hideScrollBar>
            {currentDialog?.messages.map(mess => (
              <p
                className={
                  mess.senderID === current?.id ? "text-right" : "text-left"
                }
              >
                {mess.text}
              </p>
            ))}
          </ScrollShadow>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            onClick={() => sendMessage({ text: "12321", receiverId: id ?? "" })}
          >
            Написать сообщение
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
