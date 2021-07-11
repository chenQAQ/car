import Vue from 'vue'
import Router from 'vue-router'
import puz from '@/components/puz/puz'
import car from '@/components/car'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'car',
      component:car
    },
    {
      path: '/puz',
      name: 'puz',
      component: puz
    }
  ]
})
