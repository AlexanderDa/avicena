<template>
    <v-card>
        <v-toolbar class="mb-1">
            <v-toolbar-title v-if="form">PERSONAL</v-toolbar-title>
            <v-toolbar-title v-else>{{(elementIndex===-1)?'NUEVO PERSONAL':'EDITAR PERSONAL'}}</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-text-field
                v-if="form"
                v-model="search"
                solo
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
            />
            <v-spacer></v-spacer>
            <v-btn v-if="form" color="secondary" dark icon @click="findElements()">
                <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn v-if="form" color="secondary" dark icon @click="form=!form">
                <v-icon>add</v-icon>
            </v-btn>
            <v-btn v-else color="secondary" dark icon @click="close()">
                <v-icon>list</v-icon>
            </v-btn>
        </v-toolbar>

        <v-data-table
            v-if="form"
            :headers="headers"
            :search="search"
            :items="elements"
            hide-default-footer
            sort-by="lastName"
        >
            <template v-slot:item.image="{ item }">
                <v-avatar color="grey">
                    <v-img v-if="item.image" :src="item.image" />
                    <v-icon v-else large dark>account_circle</v-icon>
                </v-avatar>
            </template>
            <template v-slot:item.action="{ item }">
                <v-btn @click="toEditElement(item)" icon>
                    <v-icon>edit</v-icon>
                </v-btn>
                <Delete @onDelete="deleteElement(item)" />
            </template>
        </v-data-table>

        <form-wizard
            v-else
            shape="tab"
            :color="$vuetify.theme.themes.light.secondary"
            title
            subtitle
            class="mt-0"
        >
            <tab-content title="Perfil" icon="material-icons contacts">
                <v-card>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm6 class="text-center">
                                            <v-avatar size="150">
                                                <v-img
                                                    v-if="element.image"
                                                    :src="element.image"
                                                    aspect-ratio="1.75"
                                                ></v-img>
                                                <v-img
                                                    v-else
                                                    src="@/assets/user.svg"
                                                    aspect-ratio="1.75"
                                                ></v-img>
                                            </v-avatar>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-flex xs12>
                                                <v-text-field
                                                    label="Nombres"
                                                    v-model="element.firstName"
                                                />
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    label="Apellidos"
                                                    v-model="element.lastName"
                                                />
                                            </v-flex>
                                        </v-flex>
                                    </v-layout>
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
                                    <v-text-field
                                        v-model="element.regProfessional"
                                        label="Registro profesional"
                                    />
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field v-model="element.address" label="Dirección" />
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                        v-model="element.emailAddress"
                                        label="Correo electrónico"
                                    />
                                </v-flex>

                                <v-flex xs6>
                                    <v-switch
                                        inset
                                        color="secondary"
                                        v-model="element.isHired"
                                        label="Profesional contratado"
                                    />
                                </v-flex>
                                <v-flex xs6>
                                    <v-switch
                                        inset
                                        :disabled="elementIndex!==-1 && hasAccount"
                                        color="secondary"
                                        v-model="hasAccount"
                                        label="¿Tiene una cuenta de usuario?"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
            </tab-content>

            <!--tab-content title="Horario" icon="material-icons perm_contact_calendar">
                <v-card>horaryio de trabajo</v-card>
            </tab-content-->
            <tab-content title="Cuenta" icon="material-icons account_circle">
                <v-card>
                    <v-card-text>
                        <v-container grid-list-sm class="pa-4">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm5 class="text-center">
                                            <v-avatar size="150">
                                                <v-img
                                                    v-if="element.image"
                                                    :src="element.image"
                                                    aspect-ratio="1.75"
                                                ></v-img>
                                                <v-img
                                                    v-else
                                                    src="@/assets/user.svg"
                                                    aspect-ratio="1.75"
                                                ></v-img>
                                            </v-avatar>
                                        </v-flex>
                                        <v-flex xs12 sm7>
                                            <v-flex xs12>
                                                <v-text-field
                                                    disabled
                                                    label="Nombres del usuario"
                                                    v-model="element.firstName"
                                                />
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    disabled
                                                    label="Apellidos del usuario"
                                                    v-model="element.lastName"
                                                />
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    disabled
                                                    label="Correo electrónico"
                                                    v-model="element.emailAddress"
                                                />
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-autocomplete
                                                    v-model.trim="user.roleId"
                                                    :items="roles"
                                                    item-text="name"
                                                    item-value="id"
                                                    label="Rol de usuario"
                                                />
                                            </v-flex>
                                            <v-flex xs12 v-if="elementIndex !== -1">
                                                <v-switch
                                                    inset
                                                    color="primary"
                                                    v-model="user.isActive"
                                                    :label="(user.isActive)?'Desactivar al usuario':'Activar al usuario'"
                                                />
                                            </v-flex>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-alert v-if="!user.id" type="warning">
                            No existe la cuenta
                            <b>{{element.emailAddress}}</b>
                        </v-alert>
                    </v-card-text>
                </v-card>
            </tab-content>
        </form-wizard>
    </v-card>
</template>

<script lang="ts">
import ProfessionalAdminPage from './ProfessionalAdminPageController'
export default ProfessionalAdminPage
</script>
