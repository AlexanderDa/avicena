<template>
    <div id="app">
        <v-app id="inspire">
            <v-content>
                <v-container fluid fill-height>
                    <v-layout align-content-center justify-center fill-height wrap>
                        <v-flex xs12 subtitle-1 text-center mb-5>
                            <img height="100" src="@/assets/logo.svg" style="margin:100px" />
                            <br />
                            <v-progress-circular :size="100" color="primary" indeterminate>Cargando</v-progress-circular>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script lang="ts">
import RootPageController from './AuthenticationPageController'

export default RootPageController
</script>
