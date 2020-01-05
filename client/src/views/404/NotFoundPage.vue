<template>
    <div>
        <div id="notfound">
            <div class="notfound">
                <div class="notfound-404"></div>
                <h1>404</h1>
                <h2>¡Uy! Página no encontrada</h2>
                <p>Lo sentimos, pero la página que busca no existe o no está disponible temporalmente.</p>
                <a @click="$router.push({name:'AuthenticationPage'})">Ir al sitio</a>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
  @import "@/views/404/NotFoundPage.sass"
</style>
