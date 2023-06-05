// socket控制器
import { Context } from "$oak"
import { IUser, IMessage } from '../types/chat.ts'

// 存放用户列表 [{id: user}] user: { id, name, group, ws }
const usersMap = new Map<string, IUser>();

// 存放聊天组列表 [{groupname: [user] }]
const groupsMap = new Map<string, IUser[]>();

// 存放聊天消息列表 [{groupname: [message] }]
const messagesMap = new Map<string, IMessage[]>();


const socket = async (ctx : Context) => {
  const socket = await ctx.upgrade()
  // const uuidNumber = new Date().getTime() + Math.floor(Math.random() * 100000)
  const uuid = crypto.randomUUID()
  /// socket开始监听
  socket.onopen = () => {
    // console.log('$---socket.onopen');
  }
  /// socket结束监听
  socket.onclose = () => {
    // 从用户map中获取当前用户
    const userObj = usersMap.get(uuid)
    if (userObj) {
      // 删除聊天组中的用户
      let users = groupsMap.get(userObj.groupName) || []
      users = users.filter((user) => user.userId !== userObj.userId) 
      groupsMap.set(userObj.groupName, users)
      // 删除用户列表中的用户
      usersMap.delete(uuid)
    }
  }

  // socket接收导消息
  socket.onmessage = (msg) => {
    const data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
    const { event } = data;
    switch(event) {
      case 'join': 
        {
          const user: IUser = {
            userId: uuid,
            userName: data.userName,
            groupName: data.groupName,
            ws: socket
          }
          // 更新用户map
          usersMap.set(uuid, user)
          // 更新群组用户列表
          const users = groupsMap.get(user.groupName) || []
          users.push(user)
          groupsMap.set(user.groupName, users)
          // 发送广播
          broadcastUsernames(user.groupName)
          // 广播历史聊天消息
          broadcastHistoryMessages(user.groupName, user)
        }
        break;
      case 'message':
        {
          const userObj = usersMap.get(uuid)
          if (userObj) {
            const messages = messagesMap.get(userObj.groupName) || []
            const message: IMessage = {
              userId: userObj.userId,
              userName: userObj.userName,
              message: data.data,
            }
            messages.push(message)
            // 更新消息列表
            messagesMap.set(userObj.groupName, messages)
            broadcastMessages(userObj.groupName, message)
          }
        }
        break;
      default:
      break;
    }
  }

  function displayUsersName(users: IUser[]): { userId: string, userName: string }[] {
    if (!users) {
      return []
    }
    return users.map(user => ({ userId: user.userId, userName: user.userName }))
  }

  // 广播用户上线
  function broadcastUsernames(groupName: string) {
    const users = groupsMap.get(groupName)
    for (const user of users!) {
      const event = {
        event: 'users',
        data: displayUsersName(users!)
      }
      user.ws.send(JSON.stringify(event))
    }
  }

   // 广播用消息
   function broadcastMessages(groupName: string, message: IMessage) {
    const users = groupsMap.get(groupName) || []
    for (const user of users) {
      message.isMe = message.userId === user.userId ? true : false
      const event = {
        event: 'messages',
        data: message
      }
      user.ws.send(JSON.stringify(event))
    }
  }

  // 广播群历史消息
  function broadcastHistoryMessages(groupName: string, user: IUser) {
    const messages = messagesMap.get(groupName) || []
    for (const message of messages) {
      message.isMe = message.userId === user.userId ? true : false
      const event = {
        event: 'messages',
        data: message
      }
      user.ws.send(JSON.stringify(event))
    }
  }
}

export default socket