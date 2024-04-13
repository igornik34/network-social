import { Button, Card, Image, useDisclosure } from "@nextui-org/react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { resetUser, selectCurrent } from "../../features/user/user.slice"
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { AppDispatch } from "../../app/store"
import { GoBack } from "../../components/go-back"
import { BASE_URL } from "../../constants"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit } from "react-icons/ci"
import { ProfileInfo } from "../../components/profile-info"
import { formatToClientDate } from "../../utils/format-to-client-date"
import { CountInfo } from "../../components/count-info"
import { EditProfile } from "../../components/edit-profile"
import { FiMessageCircle } from "react-icons/fi"

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useSelector(selectCurrent)
  const { data } = useGetUserByIdQuery(id ?? "")
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserById] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(
    () => () => {
      dispatch(resetUser())
    },
    [],
  )

  if (!data || !currentUser) {
    return null
  }

  const handleFollow = async () => {
    try {
      if (id) {
        data?.isFollowing
          ? await unfollowUser(id).unwrap()
          : await followUser({ followingId: id }).unwrap()

        await triggerGetUserById(id)
        await triggerCurrentQuery()
      }
    } catch (error) {}
  }

  const handleClose = async () => {
    try {
      if (id) {
        await triggerGetUserById(id)
        await triggerCurrentQuery()
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <GoBack />
      <div className="flex items-center gap-4">
        <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={`${BASE_URL}${data?.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-white"
          />

          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {data.name}
            {currentUser.id !== id ? (
              <Button
                color={data.isFollowing ? "default" : "primary"}
                variant="flat"
                className="gap-2"
                onClick={handleFollow}
                startContent={
                  data.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {data.isFollowing ? "Отписаться" : "Подписаться"}
              </Button>
            ) : (
              <Button endContent={<CiEdit />} onClick={() => onOpen()}>
                Редактировать
              </Button>
            )}
            {currentUser.id !== id && (
              <Button
                color="secondary"
                variant="flat"
                className="gap-2"
                startContent={<FiMessageCircle />}
                onClick={() => navigate(`/dialogs/${id}`)}
              >
                Написать сообщение
              </Button>
            )}
          </div>
        </Card>
        <Card className="flex flex-col space-y-4 p-5 flex-1">
          <ProfileInfo title="Почта" info={data.email} />
          <ProfileInfo title="Местоположение" info={data.location} />
          <ProfileInfo
            title="Дата рождения"
            info={formatToClientDate(data.dateOfBirth)}
          />
          <ProfileInfo title="Обо мне" info={data.bio} />

          <div className="flex gap-2">
            <CountInfo count={data.followers.length} title="Подписчики" />
            <CountInfo count={data.following.length} title="Подписки" />
          </div>
        </Card>
      </div>
      <EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
    </>
  )
}
