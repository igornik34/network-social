import React from "react"
import { useGetAllPostsQuery } from "../../app/services/postApi"
import { CreatePost } from "../../components/create-post"
import { Card } from "../../components/card"

export const Posts = () => {
  const { data } = useGetAllPostsQuery()
  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      {data && data.length > 0
        ? data.map(post => (
            <Card
              key={post.id}
              avatarUrl={post.author.avatarUrl ?? ""}
              content={post.content}
              name={post.author.name ?? ""}
              likesCount={post.likes.length}
              commentsCount={post.comments.length}
              authorId={post.authorId}
              id={post.id}
              likedByUser={post.likedByUser}
              createdAt={post.createdAt}
              cardFor="post"
            />
          ))
        : null}
    </>
  )
}
