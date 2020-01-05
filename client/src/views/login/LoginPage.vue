<template>
    <v-app>
        <div class="login primary"></div>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4 lg4>
                        <v-card class="elevation-12">
                            <form @submit.prevent="login()">
                                <v-card-text>
                                    <div class="layout column align-center">
                                        <img src="@/assets/logo.svg" width="180" />
                                        <h1
                                            class="flex my-4 primary--text pt-5"
                                        >{{app.name.charAt(0).toUpperCase() + app.name.slice(1)}}</h1>
                                    </div>

                                    <v-text-field
                                        color="primary"
                                        append-icon="person"
                                        label="Usuario"
                                        type="text"
                                        required
                                        v-model="username"
                                    ></v-text-field>
                                    <v-text-field
                                        color="primary"
                                        label="Contraseña"
                                        :append-icon="showPass ? 'visibility' : 'visibility_off'"
                                        @click:append="() => (showPass = !showPass)"
                                        :type="showPass ? 'password' : 'text'"
                                        required
                                        v-model="password"
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-alert
                                        v-model="error"
                                        style="min-width:100%;"
                                        type="error"
                                        dismissible
                                    >{{errorMsg}}</v-alert>
                                </v-card-actions>
                                <v-card-actions>
                                    <v-btn
                                        block
                                        color="primary white--text"
                                        :loading="loading"
                                        :disabled="loading"
                                        type="submit"
                                    >entrar</v-btn>
                                </v-card-actions>
                            </form>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import LoginPage from './LoginPageController'

export default LoginPage
</script>
<style lang="sass">
  @import "@/views/login/LoginPage.sass"
</style>
