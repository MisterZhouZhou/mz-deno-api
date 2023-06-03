export interface IUser {
  userId: string // id
  userName: string // 姓名
  groupName: string // 所在组
  ws: WebSocket // socket对象
}

export interface IMessage {
  userId: string // userId
  userName: string // 姓名
  message: string // 所在组
  isMe?: boolean // 是否为当前用户
}