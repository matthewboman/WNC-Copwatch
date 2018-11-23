<template>
  <div class="header">
    <nav class="navbar">
      <router-link class="nav-item" activeClass="active" to="/">About</router-link>
      <router-link class="nav-item" activeClass="active" to="/map">Map</router-link>
      <router-link class="nav-item" activeClass="active" to="/studies">Studies</router-link>
      <router-link class="nav-item" activeClass="active" to="/documentation">Documentation</router-link>
    </nav>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  .header {
    background-color: #5f00ba;
    color: #fff;
    margin-bottom: 24px;

    .navbar {
      padding: 18px 15%;

      .nav-item {
        color: #fff;
        text-decoration: none;
        padding: 12px;

        &:hover {
          cursor: pointer;
          font-weight: 600;
        }
      }

      .router-link-exact-active {
        font-weight: 600;
      }
    }
  }
</style>
