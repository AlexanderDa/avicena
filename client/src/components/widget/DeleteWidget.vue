<template>
  <v-btn v-if="!clicked" @click="onFirstClick" icon>
    <v-icon>delete</v-icon>
  </v-btn>

  <v-tooltip v-else bottom open-delay="500">
    <template v-slot:activator="{ on }">
      <v-btn color="warning" dark v-on="on" @click="onConfirmedClick" icon>
        <v-icon>info</v-icon>
      </v-btn>
    </template>
    <span>Haga clic para confirmar.</span>
  </v-tooltip>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'

@Component({ name: 'del-btn' })
export default class DeleteWidget extends Vue {
  private clicked: boolean = false;

  onFirstClick () {
    this.clicked = true
    setTimeout(() => {
      this.clicked = false
    }, 3000)
  }

  @Emit('onDelete')
  onConfirmedClick () {
    this.clicked = false
    return null
  }
}
</script>
