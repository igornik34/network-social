import React from "react"
import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from "../../app/services/postApi"
import { Controller, useForm } from "react-hook-form"
import { Button, Textarea } from "@nextui-org/react"
import { ErrorMessage } from "../error-message"
import { IoMdCreate } from "react-icons/io"
import { Post } from "../../app/types"

type PostForm = {
    content: string
}

export const CreatePost = () => {
  const [createPost] = useCreatePostMutation()
  const [triggerAllPosts] = useLazyGetAllPostsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<PostForm>()

  const error = errors?.content?.message as string

  const onSubmit = handleSubmit(async (data) => {
    try {
        await createPost({content: data.content}).unwrap()
        setValue("content", "")
        await triggerAllPosts().unwrap()
    } catch (error) {
        console.error(error);
    }
  })
  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="content"
        control={control}
        defaultValue=""
        rules={{ required: "Обязательное поле" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="О чем думаете?"
            className="mb-5"
          />
        )}
      />
      {errors && <ErrorMessage error={error} />}
      <Button
        color="success"
        className="flex-end"
        endContent={<IoMdCreate />}
        type="submit"
      >Добавить пост</Button>
    </form>
  )
}
