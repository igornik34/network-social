import React, { FC, useEffect, useRef, memo } from "react"
import { Message as MessageType } from "../../app/types"
import getFormatTime from "../../utils/get-format-time"
import { useReadMessageMutation } from "../../app/services/messageApi"
import { IoCheckmarkDone, IoCheckmarkOutline } from "react-icons/io5"

interface MessageProps extends MessageType {
  currentId: string
}

export const Message: FC<MessageProps> = memo(props => {
  const isSender = props.senderId === props.currentId
  const styles = isSender ? "self-end" : "self-start"
  const messageRef = useRef<HTMLDivElement>(null)
  const [readMessage] = useReadMessageMutation()

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !props.isReaded && !isSender) {
          readMessage({ messageId: props.id, senderId: props.senderId })
          if (messageRef.current) {
            observer.unobserve(messageRef.current)
          }
        }
      })
    })

    if (messageRef.current) {
      observer.observe(messageRef.current)
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current)
      }
    }
  }, [])
  return (
    <div
      className={
        "rounded-xl inline-flex justify-between gap-2 px-2 py-1 bg-foreground-100 w-fit " +
        styles
      }
      ref={messageRef}
    >
      <p className="max-w-[200px] px-1 py-1">{props.text}</p>
      <div className="text-foreground-500 text-[0.7rem] flex items-end gap-[2px] self-end">
        <span>{getFormatTime(new Date(props.createdAt))}</span>
        {isSender &&
          (props.isReaded ? (
            <IoCheckmarkDone size={18} color="rgb(2, 132, 199)"/>
          ) : (
            <IoCheckmarkOutline size={18} />
          ))}
      </div>
    </div>
  )
})
