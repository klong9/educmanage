import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/article',
      name: 'article',
      component: resolve => require(['@/components/article'], resolve)
    },
    {
      path: '/courses',
      name: 'courses',
      component: resolve => require(['@/components/courses'], resolve)
    },
    {
      path: '/lecturer',
      name: 'lecturer',
      component: resolve => require(['@/components/lecturer'], resolve)
    },
    {
      path: '/addcourse',
      name: 'addcourse',
      component: resolve => require(['@/components/addcourse'], resolve),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/changecourse',
      name: 'changecourse',
      component: resolve => require(['@/components/changecourse'], resolve),

    },
    {
      path: '/addlecturer',
      name: 'addlecturer',
      component: resolve => require(['@/components/addlecturer'], resolve),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/changelecturer',
      name: 'changelecturer',
      component: resolve => require(['@/components/changelecturer'], resolve),
    },
    {
      path: '/addarticle',
      name: 'addarticle',
      component: resolve => require(['@/components/addarticle'], resolve),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/changearticle',
      name: 'changearticle',
      component: resolve => require(['@/components/changearticle'], resolve),

    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login'], resolve),

    },
  ]
})
