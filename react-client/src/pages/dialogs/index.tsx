import React from "react"
import { useGetAllDialogsQuery } from "../../app/services/dialogApi"
import { selectDialogs } from "../../features/dialogs/dialogs.slice"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { selectCurrent, selectUser } from "../../features/user/user.slice"
import { Avatar, Card, CardBody } from "@nextui-org/react"
import { BASE_URL } from "../../constants"
import { Typography } from "../../components/typography"

export const Dialogs = () => {
  const dialogs = useSelector(selectDialogs)
  const currentUser = useSelector(selectCurrent)

  const jsx = dialogs?.map(dialog => {
    const receiver = dialog.participants.find(p => p.id !== currentUser?.id)
    return (
      <Link to={receiver?.id ?? ""}>
        <Card>
          <CardBody className="flex flex-row gap-5">
            <Avatar
              src={`${BASE_URL}${receiver?.avatarUrl}`}
              className="w-20 h-20 text-large"
            />
            <div className="flex flex-col gap-2">
              <Typography size="text-2xl" weight="semibold">{receiver?.name ?? ""}</Typography>
              <Typography>{dialog.messages[dialog.messages.length - 1].text}</Typography>
            </div>
          </CardBody>
        </Card>
      </Link>
    )
  })
  return <div className="flex flex-col gap-3">{jsx}</div>
}
