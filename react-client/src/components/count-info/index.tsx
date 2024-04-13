import React, { FC } from "react"

type Props = {
  count: number
  title: string
}

export const CountInfo: FC<Props> = ({ count, title }) => {
  return (
    <div className="flex flex-col text-center items-center p-4">
      <span className="text-4xl font-semibold">{count}</span>
      <span>{title}</span>
    </div>
  )
}
