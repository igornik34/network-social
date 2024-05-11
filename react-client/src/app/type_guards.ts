import { Comment, Dialog, Follows, Like, Message, Post, User } from "./types"

// Type guard для Dialog
export function isDialog(obj: any): obj is Dialog {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    Array.isArray(obj.participants) &&
    Array.isArray(obj.messages) &&
    obj.messages.every(isMessage) && 
    isMessage(obj.lastMessage)
  )
}

// Type guard для Message
export function isMessage(obj: any): obj is Message {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.text === "string" &&
    typeof obj.senderId === "string" &&
    typeof obj.dialogId === "string"
  )
}

// Type guard для User
export function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.password === "string" &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date &&
    Array.isArray(obj.posts) &&
    Array.isArray(obj.following) &&
    Array.isArray(obj.followers) &&
    Array.isArray(obj.likes) &&
    Array.isArray(obj.comments) &&
    (typeof obj.isFollowing === "undefined" ||
      typeof obj.isFollowing === "boolean") &&
    Array.isArray(obj.dialogs) &&
    obj.dialogs.every(isDialog) &&
    (typeof obj.online === "undefined" || typeof obj.online === "boolean") &&
    (typeof obj.lastSeen === "undefined" || obj.lastSeen instanceof Date)
  )
}