// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import { Tabbar, TabbarItem } from 'vant'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Tabbar)
app.use(TabbarItem)

const rootValue = 16 //根节点的font-size值
const rootWidth = 390 //设计稿的宽
const deviceWidth = document.documentElement.clientWidth //屏幕的宽
document.documentElement.style.fontSize = (deviceWidth * rootValue) / rootWidth + 'px' //Html中的font-size值

// git branch
// commitlint
// ESLint+Prettier

app.mount('#app')
