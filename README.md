# mz-deno-api

## 公共api
### /ws
接口描述：
* socket群组聊天接口

请求方式：
* socket

请求参数：
* 无

请求示例：
```js
socket = new WebSocket(
  `ws://localhost:8000/ws`,
);
// 加入群组
const event = {
  event: 'join',
  groupName: radioObj.arr[val],
  userName: group.currentUserName
}
socket.send(JSON.stringify(event))
// 发送消息
const event = {
  event: 'message',
  data: group.input
}
socket.send(JSON.stringify(event))
// 接收消息
const onMessageReceived = (msg: MessageEvent) => {
  const data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
  switch (data.event) {
    case 'users':
      // TODO
      break;
    case 'messages':
      // TODO
      break;
    default:
      break;
  }
}
```
### /login
接口描述：
* 登录授权接口

请求方式：
* POST http://localhost:8000/login

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| name | 是 | string | 用户姓名 |
| password | 是 | string | 用户密码 |

请求示例：
```js
curl  -X POST \
  'http://localhost:8000/login' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "mz",
  "password": "123456"
}'
```
### /upload
接口描述：
* 文件上传接口

请求方式：
* POST http://localhost:8000/upload

请求参数：
* 无

请求示例：
```ts
curl  -X POST \
  'http://localhost:8000/upload' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --form 'file=@/Users/zhouwei/Desktop/WorkSpace/Deno/mz-deno-api/deno.json'
```

### /uploads/:file
接口描述：
* 获取文件预览接口

请求方式：
* GET http://localhost:8000/uploads/xxx.png

请求参数：
* 无

请求示例：
```ts
http://localhost:8000/uploads/xxx.png
```

### /downloads/:file
接口描述：
* 文件下载接口

请求方式：
* GET http://localhost:8000/downloads/xx.png

请求参数：
* 无

请求示例：
```ts
http://localhost:8000/downloads/xxx.png
```

### /api/captcha
接口描述：
* 生成图形验证码接口

请求方式：
* GET http://localhost:8000/api/captcha

请求参数：
* 无

请求示例：
```js
http://localhost:8000/api/captcha
```
### /api/verify
接口描述：
* 图形验证码验证接口

请求方式：
* POST http://localhost:8000/api/verify

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| code | 是 | string|number | 图形验证码 |

请求示例：
```js
curl  -X POST \
  'http://localhost:8000/api/verify' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "code": "4947"
}'
```

### /api/placeholder/:size
接口描述：
* 生成不同尺寸的占位图
* 其他产品如：https://via.placeholder.com/50x50

请求方式：
* GET http://localhost:8000/api/placeholder

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| size | 是 | string|number | 占位图尺寸 |

请求示例：
```js
http://localhost:8000/api/placeholder/100x100
```

### /api/short
接口描述：
* 短链生成接口

请求方式：
* GET http://localhost:8000/api/short

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| url | 是 | string | 长链接url |

请求示例：
```js
http://localhost:8000/api/short?url=http://www.baidu.com
```

### /api/short/:url
接口描述：
* 根据短链获取长链接接口

请求方式：
* GET http://localhost:8000/api/short

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| url | 是 | string | 短链url |

请求示例：
```js
http://localhost:8000/api/short/HhCzi1vp
```
### /api/qrcode
接口描述：
* 根据内容生成二维码接口，返回base64

请求方式：
* GET http://localhost:8000/api/qrcode

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| data | 是 | string | url或者文本 |
| size | 否 | string|number | 生成的二维码尺寸，默认200 |

请求示例：
```js
http://localhost:8000/api/qrcode?data=nihao&size=300
```
### /api/qrcode/show
接口描述：
* 根据内容生成二维码接口，返回html

请求方式：
* GET http://localhost:8000/api/short

请求参数：

| 参数名称 | 是否必填 | 类型 | 说明 |
| -------- | -------- | -------- |-------- |
| data | 是 | string | url或者文本 |
| size | 否 | string|number | 生成的二维码尺寸，默认200 |
请求示例：
```js
http://localhost:8000/api/qrcode/show?data=nihao&size=300
```

### /api/screenShoot
接口描述：
* 屏幕截图为图片或者pdf

请求方式：
* GET http://localhost:8000/api/screenShoot

请求参数：
* 无

请求示例：
```ts
// 指定地址、设备和类型
http://localhost:8000/api/screenShoot?url=http://www.baidu.com&device=iPhone 6&type=pdf

// 默认为图片， 指定设备和地址
http://localhost:8000/api/screenShoot?url=http://www.baidu.com&device=iPhone 6
```

## 鉴权api
### /api/hello1
接口描述：
* 根据内容生成二维码接口，返回html

请求方式：
* GET http://localhost:8000/api/hell1

请求参数：
* 无

请求示例：
```js
http://localhost:8000/api/hell1
```
