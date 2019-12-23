<template>
  <div>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="elements"
      hide-default-footer
      sort-by="lastName"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>PROFESIONALES</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            solo
            append-icon="search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="secondary" dark icon @click="findElements()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn color="secondary" dark icon @click="dialog=!dialog">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn @click="toEditElement(item)" icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <Delete @onDelete="deleteElement(item)" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" scrollable persistent max-width="650px">
      <v-card>
        <v-toolbar dark color="secondary">
          <v-toolbar-title>{{(elementIndex===-1)?'Nuevo':'Editar'}}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-stepper v-model="stepper">
            <v-stepper-items>
              <v-stepper-content class="pa-0" step="1">
                <v-card height="420px">
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs6>
                          <v-text-field v-model="element.lastName" label="Apellidos" />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field v-model="element.firstName" label="Nombres" />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field
                            v-model="element.dni"
                            label="Cédula"
                            v-mask="'#########-#'"
                          />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field v-model="element.passport" label="Pasaporte" />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field
                            v-model="element.telephone"
                            label="Teléfono fijo"
                            v-mask="['# ### ###','### ### ###']"
                          />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field
                            v-model="element.mobile"
                            label="Teléfono celular"
                            v-mask="'### ### ####'"
                          />
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="element.address" label="Dirección" />
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="element.emailAddress" label="Correo electrónico" />
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  {{stepper}}
                </v-card>
              </v-stepper-content>

              <v-stepper-content class="pa-0" step="2">
                <v-card height="420px">
                  <v-card-text>
                    <v-container grid-list-sm class="pa-4">
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs12 sm5 class="text-center">
                              <v-avatar size="150">
                                <v-img v-if="user.image" :src="user.image" aspect-ratio="1.75"></v-img>
                                <v-img v-else src="@/assets/user.svg" aspect-ratio="1.75"></v-img>
                              </v-avatar>
                            </v-flex>
                            <v-flex xs12 sm7>
                              <v-flex xs12>
                                <v-text-field
                                  disabled
                                  label="Nombre de usuario"
                                  v-model="user.username"
                                />
                              </v-flex>
                              <v-flex xs12>
                                <v-text-field
                                  disabled
                                  label="Correo electrónico"
                                  v-model="user.emailAddress"
                                />
                              </v-flex>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field disabled label="Rol de usuario" :value="user.roleId" />
                        </v-flex>
                        <v-flex xs12>
                          <v-switch
                            inset
                            color="primary"
                            v-model="element.isHired"
                            label="Profesional contratado"
                          />
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <v-alert v-if="!user.id" type="warning">
                      No existe la cuenta
                      <b>{{element.emailAddress}}</b>
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn v-if="stepper>1" color="secondary" @click="stepper--">
            <v-icon>arrow_back</v-icon>Atras
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="stepper===2" color="secondary" @click="submit()">
            <v-icon>save</v-icon>Guardar
          </v-btn>
          <v-btn v-else color="secondary" @click="stepper++">
            siguiente
            <v-icon>arrow_forward</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import ProfessionalAdminPage from './ProfessionalAdminPageController'
export default ProfessionalAdminPage
</script>
