<template>
  <div class="header">
    <nav class="navbar navbar-expand-md navbar-dark">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
        v-on:click="toggleNavbar()">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="container">
        <div class="collapse navbar-collapse" id="navigation">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" >About</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/map">Map</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/studies">Studies</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/documentation">Documentation</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    methods: {
      toggleNavbar() {
        const nav = document.getElementById("navigation")
        nav.classList.toggle('collapse');
        nav.classList.toggle('in')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar-dark {
    background-color: rgb(110, 64, 170);
  }
</style>
