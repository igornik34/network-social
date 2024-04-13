import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/user.slice'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import { User } from '../../components/user'

export const Following = () => {
  const currentUser = useSelector(selectCurrent)
  if (!currentUser) {
    return null
  }
  return currentUser.following.length > 0 ? (
    <div className="flex gap-5 flex-col">
      {currentUser.following.map(following => (
        <Link key={following.following.id} to={`/users/${following.following.id}`}>
          <Card>
            <CardBody className="block">
              <User
                name={following.following.name ?? ""}
                avatarUrl={following.following.avatarUrl ?? ""}
                description={following.following.email ?? ""}
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
