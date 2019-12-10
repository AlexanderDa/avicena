<template>
    <div id="app">
        <v-app id="inspire">
            <v-navigation-drawer v-model="drawer" app clipped>
                <v-list dense>
                    <div v-for="(item,index) in sideBarItems" :key="index">
                        <v-list-item v-if="!item.children" @click="changeView(item.routerName)">
                            <v-list-item-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-group v-else :prepend-icon="item.icon" no-action>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title v-text="item.title"></v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item
                                v-for="subItem in item.children"
                                :key="subItem.title"
                                @click="changeView(subItem.routerName)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title v-text="subItem.title"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </div>
                </v-list>
            </v-navigation-drawer>

            <v-app-bar app color="primary" dark clipped-left>
                <img src="@/assets/logo.svg" width="50px" />
                <v-btn icon @click="drawer=!drawer">
                    <v-icon>menu</v-icon>
                </v-btn>
                <v-toolbar-title>{{app.name.charAt(0).toUpperCase() + app.name.slice(1)}}</v-toolbar-title>
                <v-spacer />
                <slot name="toolbar"></slot>
                <v-menu
                    offset-y
                    origin="top bottom"
                    :nudge-bottom="10"
                    transition="scale-transition"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn dark icon v-on="on">
                            <v-icon>account_circle</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item
                            v-for="(item, i) in menuItems"
                            :key="i"
                            @click="changeView(item.routerName)"
                        >
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.title"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>
            <v-content>
                <router-view tag="v-container" fluid fill-height />
            </v-content>
        </v-app>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { AppInfo, appInfo } from '../common'

import { MenuItem } from '../util'

@Component({
  name: 'Dashboard'
})
export default class DashboardComponent extends Vue {
    public drawer: boolean = true
    public app: AppInfo = appInfo
    @Prop() public sideBarItems!: MenuItem[]
    @Prop({
      default: () => [
        { icon: 'settings', title: 'Mi cuenta', routerName: 'AccountPage' },
        { icon: 'logout', title: 'Salir', routerName: 'AuthenticationPage' }
      ]
    })
    public menuItems!: MenuItem[]

    public async changeView (routerName: string) {
      if (routerName === 'AuthenticationPage') {
        await localStorage.removeItem('token')
        // @ts-ignore
        Vue.http.headers.common['Authorization'] = null
        // @ts-ignore
        this.$router.push({ name: routerName })
      }
      // @ts-ignore
      this.$router.push({ name: routerName })
    }
}
</script>
