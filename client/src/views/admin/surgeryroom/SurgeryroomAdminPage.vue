<template>
  <div>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="elements"
      hide-default-footer
      sort-by="finishDate"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>QUIRÓFANO</v-toolbar-title>
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
          <v-btn color="primary" dark icon @click="findElements()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn color="primary" dark icon @click="dialog=!dialog">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn @click="toEditElement(item)" icon><v-icon>edit</v-icon></v-btn>
        <Delete @onDelete="deleteElement(item)"/>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="findElements">Reset</v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
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
            <v-container grid-list-md>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field v-model="element.name" label="Nombre"/>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="element.minValue" label="Valor" type="number" min="0" step=".01"/>
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
import SurgeryroomAdminPage from './SurgeryroomAdminPageComponent'
export default SurgeryroomAdminPage
</script>
