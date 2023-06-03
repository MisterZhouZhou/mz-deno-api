<template>
  <el-container>
    <el-container>
      <el-aside class="chat-aside" width="260px">
        <div class="chat-title">当前聊天室人数{{ group.users.length }}</div>
        <div class="chat-user" v-for="(user, index) in group.users" :key="index">{{ user.userName }}</div>
      </el-aside>
      <el-main class="chat-main">
        <div class="chat-main-title">{{ group.groupName }}-{{ group.currentUserName }}</div>
        <div class="chat-list">
          <div v-for="(message, index) in group.messages" :key="index" :class="{'chat-me': message.isMe, 'chat-other': !message.isMe}">
            <div v-if="!message.isMe" class="user-name">{{ message.userName }}</div>
            <div class="user-message">{{ message.message }}</div>
            <div v-if="message.isMe" class="user-name">{{ message.userName }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input v-model="group.input" maxlength="30" placeholder="Please input" show-word-limit type="textarea" />
          <el-button type="primary" class="chat-send" @click="send">发送</el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="showDialog" title="选择聊天分组">
    <el-radio-group v-model="radioObj.selected" :style="{ display: 'grid' }" @change="radioChange">
      <el-radio v-for="(title, index) in radioObj.arr" :key="index" :label="index">{{ title }}</el-radio>
    </el-radio-group>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
// socket
let socket: WebSocket;
const router = useRouter()
const route = useRoute()

interface IUser {
  userId: string // id
  userName: string // 姓名
}

interface IMessage {
  userId: string // userId
  userName: string // 姓名
  message: string // 消息内容
  isMe?: boolean // 是否为当前用户
}

// 弹窗
const showDialog = ref(true)
const radioObj = reactive({
  selected: -1,
  arr: ['JavaScript', 'TypeScript', 'NodeJS', 'Deno']
})

const group = reactive({
  groupName: '',
  currentUserName: route.query.name || 'mz',
  users: Array<IUser>(),
  messages: Array<IMessage>(),
  input: ''
})

// 路由重定向
if (!route.query.name) {
  router.replace('/chat?name=mz')
}

function initSocket() {
  const host = import.meta.env.PROD ? window.location.host : 'localhost:8000'
  socket = new WebSocket(
    `ws://${host}/ws`,
  );
  socket.onopen = onConnectionOpen
  socket.onmessage = onMessageReceived
}

const onConnectionOpen = () => {
  console.log('---onConnectionOpen');
}

const onMessageReceived = (msg: MessageEvent) => {
  const data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
  switch (data.event) {
    case 'users':
      group.users = data.data;
      break;
    case 'messages':
      group.messages.push(data.data);
      break;
    default:
      break;
  }
}

//  radio
function radioChange(val: number) {
  radioObj.selected = val
  showDialog.value = false

  const groupName = radioObj.arr[val]
  group.groupName = groupName

  // name
 
  const event = {
    event: 'join',
    groupName: radioObj.arr[val],
    userName: group.currentUserName
  }
  socket.send(JSON.stringify(event))
}

// send msg
function send() {
  const event = {
    event: 'message',
    data: group.input
  }
  socket.send(JSON.stringify(event))
}

// 初始化socket
initSocket()

</script>

<style lang="less">
.chat-header {
  background-color: #5a5b5c;
}

.chat-aside {
  height: 100vh;
  background-color: #5a5b5c;
  .chat-title {
    color: rgba(255, 255, 255, 0.6);
    padding: 10px 0;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .chat-user {
    font-size: 26px;
    font-weight: 500;
    text-align: center;
  }
}

.chat-main {
  padding: 0;
  position: relative;

  .chat-main-title {
    height: 34px;
    color: rgba(255, 255, 255, 0.6);
    padding: 10px 20px;
    font-size: 24px;
    font-weight: 500;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .chat-list {
    padding: 0 10px;
    .user-name {
      font-size: 20px;
      font-weight: 500;

    }
    .user-message {
      padding: 10px;
      border-radius: 8px;
      font-size: 20px;
      max-width: 300px;
    }
    .chat-me {
      display: flex;
      justify-content: flex-end;
      .user-message {
        margin-right: 10px;
        background-color: green;
      }
    }
    .chat-other {
      display: flex;
      .user-message {
        margin-left: 10px;
        background-color: lightgray;
      }
    }
  }
  .chat-input {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    width: calc(100vw - 280px);
    .chat-send {
      height: 52px;
      margin-left: 10px;
    }
  }
}
</style>