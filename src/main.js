// Firebase integration following pattern at
//  https://alligator.io/vuejs/vuefire-firebase/

import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import VueFire from 'vuefire'
import Dashboard from './components/Dashboard.vue'
import Process from './components/Process.vue'

Vue.use(Router)
Vue.use(VueFire)

const router = new Router({
  routes: [
    {
      path: '/',
      name:'dashboard',
      component: Dashboard
    },
    {
      path: '/process/:id',
      name:'process',
      component: Process,
      props: true,
    },
  ]
 })

new Vue({
 el: '#app',
 render: h => h(App),
 router
})
