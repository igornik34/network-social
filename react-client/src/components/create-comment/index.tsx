import React from "react"
import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../app/services/postApi"
import { Controller, useForm } from "react-hook-form"
import { Button, Textarea } from "@nextui-org/react"
import { ErrorMessage } from "../error-message"
import { IoMdCreate } from "react-icons/io"
import { Post } from "../../app/types"
import { useCreateCommentMutation } from "../../app/services/commentApi"
import { useParams } from "react-router-dom"

type CommentForm = {
  comment: string
}

export const CreateComment = () => {
  const { id } = useParams<{id: string}>()
  const [createComment] = useCreateCommentMutation()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CommentForm>()

  const error = errors?.comment?.message as string

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        await createComment({ content: data.comment, postId: id }).unwrap()
        setValue("comment", "")
        await triggerGetPostById(id).unwrap()
      }
    } catch (error) {
      console.error(error)
    }
  })
  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{ required: "Обязательное поле" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="Напишите Комментарий"
            className="mb-5"
          />
        )}
      />
      {errors && <ErrorMessage error={error} />}
      <Button
        color="primary"
        className="flex-end"
        endContent={<IoMdCreate />}
        type="submit"
      >
        Отправить
      </Button>
    </form>
  )
}
