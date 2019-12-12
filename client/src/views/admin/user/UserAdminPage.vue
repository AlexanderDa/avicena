<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="elements"
      :search="search"
      hide-default-footer
      sort-by="username"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>USUARIOS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            solo
            v-model="search"
            label="Buscar"
            append-icon="search"
            hide-details
            clearable
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark icon @click="findElements()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn color="primary" icon @click="dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar color="grey">
          <v-img v-if="item.image" :src="item.image" />
          <v-icon v-else large dark>account_circle</v-icon>
        </v-avatar>
      </template>
      <template v-slot:item.status="{ item }">
         <v-chip :color="(item.isActive)?'success':'error'" dark>{{ (item.isActive)?'Activo':'Inactivo' }}</v-chip>
      </template>
      <template v-slot:item.roleId="{ item }">
         <v-chip>{{getRole(item.roleId)}}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon @click="toEditElement(item)">edit</v-icon>
        <Delete @onDelete="deleteElement(item)" />
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="findElements">Reset</v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" scrollable persistent max-width="500px">
       <form @submit.prevent="submit()">
        <v-card>
          <v-toolbar dark color="secondary">
            <v-toolbar-title>{{(elementIndex===-1)?'Nuevo':'Editar'}}</v-toolbar-title>
            <v-spacer />
            <v-btn icon dark @click="close()">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-container grid-list-sm class="pa-4">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs12 md5 class="text-center">
                      <v-badge color="transparent" bottom>
                        <template v-slot:badge>
                          <v-btn icon color="secondary" @click="pickFile">
                            <v-icon>camera_alt</v-icon>
                          </v-btn>
                        </template>
                        <v-avatar size="150">
                          <v-img v-if="imageData" :src="imageData" aspect-ratio="1.75"></v-img>
                          <v-img
                            v-else-if="element.image"
                            :src="element.image"
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
                    <v-flex xs12 md7>
                      <v-flex xs12>
                        <v-text-field
                          label="Nombre de usuario"
                          v-model.trim="element.username"
                          required
                        />
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Correo electrónico" v-model.trim="element.emailAddress" required />
                      </v-flex>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model.trim="element.roleId"
                    :items="roles"
                    item-text="name"
                    item-value="id"
                    label="Rol"
                  />
                </v-flex>
                <v-flex xs12 v-if="elementIndex !== -1">
                  <v-switch
                    inset
                    color="primary"
                    v-model="element.isActive"
                    :label="(element.isActive)?'Desactivar al usuario':'Activar al usuario'"
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
    </v-dialog>
  </div>
</template>

<script lang="ts">
import UserAdminPage from './UserAdminPageController'

export default UserAdminPage
</script>
