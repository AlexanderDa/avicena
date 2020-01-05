import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import LoginRouter from '@/router/LoginRouter'
import AccoutnRouter from '@/router/AccountRouter'
import AdminRouter from '@/router/AdminRouter'
import MedicoRouter from '@/router/MedicoRouter'
import AuthenticationRouter from '@/router/AuthenticationRouter'
import UserModel from '@/models/UserModel'
import NotFoundRouter from '@/router/NotFoundRouter'
import { Roles } from '@/common'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  NotFoundRouter,
  AuthenticationRouter,
  LoginRouter,
  AccoutnRouter,
  AdminRouter,
  MedicoRouter
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: any, from: any, next: any) => {
  to.matched.some((record: any) => {
    if (record.meta.onlyLogged) {
      // @ts-ignore
      Vue.http.get('/api/account/me')
        .then((res: any) => {
          const user: UserModel = res.body
          switch (record.meta.role) {
            case 'admin':
              if (user.roleId === Roles.Admin.ID) next()
              else next('/')
              break

            case 'medico':
              if (user.roleId === Roles.Medico.ID) next()
              else next('/')
              break

            case 'all':
              next()
              break

            default:
              next('/')
              break
          }
        })
        .catch((err: any) => {
          if (err.status === 401) {
            // @ts-ignore
            Vue.dialog.alert({
              title: 'Su sesión expiró',
              body: 'Para continuar por favor inicie sesión.'
            }).then(() => { next('/') })
          }
        })
    } else next()
  })
})

export default router
