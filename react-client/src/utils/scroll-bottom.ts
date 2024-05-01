import { RefObject } from "react"

export const scrollBottom = (ref: RefObject<HTMLDivElement | null>): void => {
  ref.current?.scrollTo({
    top: ref.current?.scrollHeight,
    behavior: "smooth",
  })
}
