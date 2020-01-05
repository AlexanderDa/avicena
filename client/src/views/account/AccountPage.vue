<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar app color="primary" dark clipped-left>
        <v-toolbar-title>{{app.name.charAt(0).toUpperCase() + app.name.slice(1)}}</v-toolbar-title>
        <v-spacer />
        <v-btn dark icon @click="$router.back()">
          <v-icon>close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm9 lg8>
              <v-layout row wrap>
                <v-flex xs12>
                  <form @submit.prevent="updateProfile()">
                    <v-card>
                      <v-toolbar dark dense color="secondary">
                        <v-toolbar-title>Mi Perfil</v-toolbar-title>
                        <v-spacer />
                      </v-toolbar>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-container grid-list-sm class="pa-4">
                          <v-layout row wrap>
                            <v-flex xs12>
                              <v-layout row wrap>
                                <v-flex xs12 sm5 class="text-center">
                                  <v-badge color="transparent" bottom>
                                    <!--template v-slot:badge>
                                      <v-btn icon color="secondary" @click="pickFile">
                                        <v-icon>camera_alt</v-icon>
                                      </v-btn>
                                    </template-->
                                    <v-avatar size="150">
                                      <v-img v-if="imageData" :src="imageData" aspect-ratio="1.75"></v-img>
                                      <v-img
                                        v-else-if="me.image"
                                        :src="me.image"
                                        aspect-ratio="1.75"
                                      ></v-img>
                                      <v-img v-else src="@/assets/user.svg" aspect-ratio="1.75"></v-img>
                                      <input
                                        type="file"
                                        style="display: none"
                                        ref="image"
                                        accept="image/*"
                                        @change="onFilePicked"
                                      />
                                    </v-avatar>
                                  </v-badge>
                                </v-flex>
                                <v-flex xs12 sm7>
                                  <v-flex xs12>
                                    <v-text-field
                                      label="Apellidos"
                                      v-model="professional.lastName"
                                      required
                                    />
                                  </v-flex>
                                  <v-flex xs12>
                                    <v-text-field
                                      label="Nombres"
                                      v-model="professional.firstName"
                                      required
                                    />
                                  </v-flex>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                            <v-flex xs12>
                              <v-text-field
                                label="Nombre de usuario"
                                v-model="me.username"
                              />
                            </v-flex>
                            <v-flex xs12>
                              <v-text-field
                                disabled
                                label="Rol de usuario"
                                :value="getRole(me.roleId)"
                              />
                            </v-flex>
                            <v-flex xs12>
                              <v-text-field
                                disabled
                                label="Correo Electrónico"
                                v-model="me.emailAddress"
                              />
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn type="submit" color="secondary">
                          <v-icon>save</v-icon>Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </form>
                </v-flex>
                <v-flex xs12 mt-5>
                  <form @submit.prevent="changePass()">
                    <v-card>
                      <v-toolbar dark dense color="secondary">
                        <v-toolbar-title>Cambiar contraseña</v-toolbar-title>
                        <v-spacer />
                      </v-toolbar>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-container grid-list-sm class="pa-4">
                          <v-layout row wrap>
                            <v-flex xs12 sm6>
                              <v-text-field
                                label="Nueva contraseña"
                                v-model="password.new"
                                :error="password.newPassError"
                                type="password"
                                required
                              />
                            </v-flex>
                            <v-flex xs12 sm6>
                              <v-text-field
                                label="Repita la contraseña"
                                v-model="password.repeated"
                                :error="password.repeatedPassError"
                                type="password"
                                required
                              />
                            </v-flex>
                            <v-flex xs12 pr-5 pl-5>
                              <v-alert
                                v-model="password.diffPassError"
                                type="error"
                                dismissible
                              >Las contraseñas no coinciden.</v-alert>

                              <v-alert
                                v-model="password.smallPassword"
                                type="error"
                                dismissible
                              >La contraseña es muy corta.</v-alert>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn type="submit" color="secondary">
                          <v-icon>save</v-icon>Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </form>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import AccountPageController from './AccountPageController'

export default AccountPageController
</script>
