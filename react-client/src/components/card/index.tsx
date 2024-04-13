import React, { FC, useState } from "react"
import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextUiCard,
  Spinner,
} from "@nextui-org/react"
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../app/services/likeApi"
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../app/services/postApi"
import { useDeleteCommentMutation } from "../../app/services/commentApi"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/user.slice"
import { User } from "../user"
import { formatToClientDate } from "../../utils/format-to-client-date"
import { RiDeleteBinLine } from "react-icons/ri"
import { Typography } from "../typography"
import { MetaInfo } from "../meta-info"
import { FcDislike } from "react-icons/fc"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import { FaRegComment } from "react-icons/fa"
import { ErrorMessage } from "../error-message"
import { hasErrorField } from "../../utils/has-error-field"

type Props = {
  avatarUrl: string
  name: string
  authorId: string
  content: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt?: Date
  id?: string
  cardFor: "comment" | "post" | "current-post"
  likedByUser?: boolean
}

export const Card: FC<Props> = ({
  avatarUrl = "",
  name = "",
  authorId = "",
  content = "",
  commentId = "",
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  id = "",
  cardFor = "post",
  likedByUser = false,
}) => {
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrent)

  const refetchPosts = async () => {
    switch (cardFor) {
      case "post":
        await triggerGetAllPosts().unwrap()
        break
      case "current-post":
        await triggerGetPostById(id).unwrap()
        break
      case "comment":
        await triggerGetPostById(id).unwrap()
        break
      default:
        throw new Error("Неверный аргумент cardFor")
    }
  }

  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case "post":
          await deletePost(id).unwrap()
          await refetchPosts()
          break
        case "comment":
          await deleteComment(commentId)
          await refetchPosts()
          break
        case "current-post":
          await deletePost(id).unwrap()
          refetchPosts()
          navigate(-1)
          break
        default:
          throw new Error("Неверный аргумент cardFor")
      }
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  const handleLikePost = async () => {
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likePost({ postId: id }).unwrap()
      await refetchPosts()
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  return (
    <NextUiCard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-none text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>
        {authorId === currentUser?.id && (
          <div className="cursor-pointer" onClick={handleDelete}>
            {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
              <Spinner />
            ) : (
              <RiDeleteBinLine />
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="px-3 py-2 mb-5">
        <Typography>{content}</Typography>
      </CardBody>
      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <div onClick={handleLikePost}>
              <MetaInfo
                count={likesCount}
                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
              />
            </div>
            <Link to={`/posts/${id}`}>
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            </Link>
          </div>
          <ErrorMessage error={error} />
        </CardFooter>
      )}
    </NextUiCard>
  )
}
