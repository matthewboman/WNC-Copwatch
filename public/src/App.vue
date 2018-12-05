<template>
  <div>
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import { Header } from './components'
  import { Documentation, Home, Map } from './pages'

  export default {
    components: {
      appHeader: Header
    }
  }
</script>

<style lang="scss">
  /* global */
  body {
    font-family: Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
  }

  $color-primary: #863ddc;
  $color-primary-dark: #5f00ba;
  $color-primary-light: #a09be7;
  $color-secondary: #b0ff92;

  $font-color-dark: #444444;
  $font-color-med: #666;
  $font-color-light: white;
  $font-light: 300;
  $font-normal: 400;
  $font-bold: 500;

  $text-xs: 12px;
  $text-sm: 16px;
  $text-md: 24px;
  $text-lg: 36px;
  $text-xl: 48px;

  // button {
  //   background-color: $color-primary;
  //   color: $font-color-light;
  //   font-size: $text-sm;
  //   font-weight: $font-bold;
  //   border: none;
  //   border-radius: 20px;
  //   padding: 12px 18px;
  //
  //   &:hover {
  //     background-color: $color-primary-dark;
  //     cursor: pointer;
  //   }
  // }

  select {
    font-weight: $font-light;
    border: 2px solid $color-primary-light;
    border-radius: 6px;
    padding: 10px;
    padding-right: 14px;
    -moz-appearance: none;
    -webkit-appearance:none;
    appearance: none;
    background-image: url("/public/icons/carat-down.png");
    background-position: right;
    background-size: 24px;
    background-repeat: no-repeat;
    background-color: white;

    &:hover {
      cursor: pointer;
    }

    option {
      font-weight: $font-light;
    }
  }

  input {

    &:hover {
      cursor: pointer;
    }
  }

  .primary-background {
    background-color: $color-primary-light;
    color: $font-color-light;
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
  }

  .border-bottom {
    padding-bottom: 18px;
    margin-bottom: 12px;
    border-bottom: 1px solid $color-primary-light;
  }

</style>
