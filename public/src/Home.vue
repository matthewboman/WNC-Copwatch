<template>
  <div class="container">
    <div class="upper">
      <div class="map-container">
        <app-map></app-map>
        <app-legend></app-legend>
      </div>
      <div class="filter-legend-container">
        <app-filters></app-filters>
      </div>
    </div>
    <div class="lower">
      <div class="report-container">
        <app-records></app-records>
      </div>
      <div class="temp"></div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Legend, Map, Records } from './components'
  import Filters from './components/filters/Filters'

  export default {
    components: {
      appFilters: Filters,
      appLegend: Legend,
      appMap: Map,
      appRecords: Records
    },
    mounted() {
      this.getOpenDataReports()
      this.getBulletinReports()
    },
    methods: {
      ...mapActions({
        getBulletinReports: 'getBulletinReports',
        getOpenDataReports: 'getOpenDataReports'
      }),
    }
  }

</script>

<style lang="scss">
  /* global */
  body {
    font-family: Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, h4, h5, h6, p, span, label {
    margin-top: 0;
  }

  $color-primary: #863ddc;
  $color-primary-dark: #5f00ba;
  $color-primary-light: #a09be7;
  $color-secondary: #b0ff92;

  $font-color-dark: #444444;
  $font-color-med: #666;
  $font-color-light: white;
  $font-base: 14px;
  $font-ratio: 1.2;
  $font-light: 300;
  $font-normal: 400;
  $font-bold: 600;

  $text-xs: $font-base;
  $text-sm: calc(#{$font-base} * #{$font-ratio} );
  $text-md: calc(#{$font-base} * #{$font-ratio} * #{$font-ratio} );
  $text-lg: calc(#{$font-base} * #{$font-ratio} * #{$font-ratio}  * #{$font-ratio} );
  $text-xl: calc(#{$font-base} * #{$font-ratio} * #{$font-ratio}  * #{$font-ratio} * #{$font-ratio} );

  h1 {
    font-size: $text-xl;
    font-weight: $font-bold;
    margin-bottom: $text-lg;
    color: $font-color-dark;
  }

  h2, h3 {
    font-size: $text-lg;
    font-weight: $font-bold;
    margin-bottom: $text-md;
    color: $font-color-dark;
  }

  h4, h5, h6 {
    font-size: $text-md;
    margin-bottom: $text-sm;
    color: $font-color-dark;
  }

  p, span {
    font-size: $text-sm;
    font-weight: $font-light;
    color: $font-color-med;
  }

  p {
    line-height: $text-md;
  }

  label {
    font-size: $text-sm;
    font-weight: $font-normal;
    color: $font-color-med;
  }

  button {
    background-color: $color-primary;
    color: $font-color-light;
    font-size: $text-sm;
    font-weight: $font-bold;
    border: none;
    border-radius: 20px;
    padding: 12px 18px;

    &:hover {
      background-color: $color-primary-dark;
      cursor: pointer;
    }
  }

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

<style lang="scss" scoped>
  .container {

    .upper {
      display: flex;
      flex-wrap: nowrap;
      padding: 20px;

      @media (max-width: 767px) {
        flex-wrap: wrap;
      }

        .map-container {
          flex-grow: 2;
          flex-basis: 75%;
          padding: 18px;
          box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);
          transition: all .3s ease;
          position: relative;
          border-radius: 6px;
        }

        .filter-legend-container {
          flex-grow: 1;
          flex-basis: 25%;
          padding: 18px;
        }
    }

    .lower {
      display: flex;
      flex-wrap: nowrap;

      .report-container {
        flex-grow: 2;
        flex-basis: 75%;
        padding: 20px;
      }

      .temp {
        flex-grow: 1;
        flex-basis: 25%;
        padding: 20px;
      }
    }
  }
</style>
