import React, { useEffect, useRef } from "react"
import { useSendMessageMutation } from "../../app/services/messageApi"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Spinner,
} from "@nextui-org/react"
import { Link, useParams } from "react-router-dom"
import { User } from "../../components/user"
import { GoBack } from "../../components/go-back"
import {
  useGetDialogByIdQuery,
  useGetReceiverByIdQuery,
} from "../../app/services/dialogApi"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/user.slice"
import {
  resetCurrentDialog,
  selectCurrentDialog,
} from "../../features/dialogs/dialogs.slice"
import { AppDispatch } from "../../app/store"
import { useTimeAgo } from "react-time-ago"
import { IoMdSend } from "react-icons/io"
import { Controller, useForm } from "react-hook-form"
import { scrollBottom } from "../../utils/scroll-bottom"
import { Message } from "../../components/message"

interface MessageForm {
  message: string
}

export const CurrentDialog = () => {
  const { id } = useParams<{ id: string }>()
  const { data: userReceiver } = useGetReceiverByIdQuery(id ?? "")
  const { data: responsedDialog, isLoading } = useGetDialogByIdQuery(id ?? "")
  const currentDialog = useSelector(selectCurrentDialog)
  const current = useSelector(selectCurrent)
  const [sendMessage] = useSendMessageMutation()
  const dispatch = useDispatch<AppDispatch>()
  const lastSeen = useTimeAgo({
    date: userReceiver?.lastSeen ?? 0,
    locale: "ru-RU",
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<MessageForm>()
  const listMessagesRef = useRef<HTMLDivElement | null>(null)
  const onSubmit = handleSubmit(async data => {
    try {
      await sendMessage({ text: data.message, receiverId: id ?? "" })
      setValue("message", "")
    } catch (error) {
      console.error(error)
    }
    scrollBottom(listMessagesRef)
  })

  useEffect(() => {
    scrollBottom(listMessagesRef)
  }, [listMessagesRef])

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
              description={
                userReceiver?.online ? "В сети" : lastSeen.formattedDate
              }
            />
          </Link>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col p-4">
          <div
            className="w-full h-[60vh] scrollbar-hide relative overflow-auto flex flex-col gap-2"
            ref={listMessagesRef}
          >
            {!currentDialog.isNewDialog && currentDialog.dialog?.messages.map(mess => (
              <Message {...mess} key={mess.id} currentId={current?.id ?? ""} />
            ))}
            {currentDialog.isNewDialog && (
              "Напишите пользователю"
            )}
            {isLoading && <Spinner />}
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="p-0">
          <form onSubmit={onSubmit} className="w-full">
            <Controller
              name="message"
              control={control}
              defaultValue=""
              rules={{ required: "Обязательное поле" }}
              render={({ field }) => (
                <Input
                  radius="none"
                  className="rounded-t-none"
                  size="lg"
                  placeholder="Напишите сообщение..."
                  endContent={
                    <IoMdSend className="cursor-pointer" onClick={onSubmit} />
                  }
                  {...field}
                />
              )}
            />
            {/* {errors && <ErrorMessage error={error} />} */}
          </form>
        </CardFooter>
      </Card>
    </>
  )
}
