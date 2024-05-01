import React, { FC } from "react"
import { Message as MessageType } from "../../app/types"

interface MessageProps extends MessageType {
  currentId: string
}

export const Message: FC<MessageProps> = props => {
  console.log(props.senderID, props.currentId)

  const styles = props.senderID === props.currentId ? "self-end" : "self-start"
  return (
    <div
      className={
        "rounded-xl inline-flex items-end justify-between gap-2 px-3 py-2 bg-foreground-100 w-fit " +
        styles
      }
    >
      <span className="max-w-[200px]">{props.text}</span>
      <sub className="text-foreground-500 text-[0.7rem]">
        {`${new Date(props.createdAt).getHours()}`}:
        {`${new Date(props.createdAt).getMinutes()}`}
      </sub>
    </div>
  )
}
