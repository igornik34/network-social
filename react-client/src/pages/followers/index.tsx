import React from "react"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/user.slice"
import { Link } from "react-router-dom"
import { Card, CardBody } from "@nextui-org/react"
import { User } from "../../components/user"

export const Followers = () => {
  const currentUser = useSelector(selectCurrent)
  if (!currentUser) {
    return null
  }
  return currentUser.followers.length > 0 ? (
    <div className="flex gap-5 flex-col">
      {currentUser.followers.map(follower => (
        <Link key={follower.follower.id} to={`/users/${follower.follower.id}`}>
          <Card>
            <CardBody className="block">
              <User
                name={follower.follower.name ?? ""}
                avatarUrl={follower.follower.avatarUrl ?? ""}
                description={follower.follower.email ?? ""}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  ) : (
    <h1>У вас нет подписчиков</h1>
  )
}
