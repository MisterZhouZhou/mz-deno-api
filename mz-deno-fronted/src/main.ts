import { createApp } from 'vue'
import App from './App'
import router from './router'
import './assets/style/common.less'

const app = createApp(App)
app.use(router)
app.mount('#app')
