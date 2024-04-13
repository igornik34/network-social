import React, { FC } from "react"

type Props = {
  children: string
  size?: string
  weight?: "normal" | "semibold" | "bold"
}

export const Typography: FC<Props> = ({
  children,
  size = "text-xl",
  weight = "normal",
}) => {
  return <p className={`${size} font-${weight}`}>{children}</p>
}
