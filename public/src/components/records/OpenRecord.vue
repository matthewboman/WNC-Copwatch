<template>
  <div class="record">
    <div class="left primary-background">
      <span class="date">{{ this.formatDate(record.dateTime) }}</span>
    </div>
    <div class="right">
      <p class="force">APD Open Data</p>
      <p class="address">{{ this.removeTrailingComma(record.address) }}</p>
    </div>
  </div>
</template>

<script>
  import { removeTrailingComma } from '../../vuex/functions'

  export default {
    props: [ 'record' ],
    methods: {
      formatDate: date => new Date(date).toDateString(),
      removeTrailingComma: str => removeTrailingComma(str)
    }
  }

</script>

<style lang="scss" scoped>
  .record {
    will-change: transform;
    margin: 18px 0;
    position: relative;
    border-radius: 6px;
    box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);
    transition: all .3s ease;
    position: relative;
    display: flex;
    flex-wrap: nowrap;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      flex-basis: 15%;

      .date {
        color: #fff;
      }
    }

    .right {
      flex-basis: 85%;
      margin-left: 10px;
      padding: 10px;s

      .force {

      }
      .description {

      }

      .address {
        margin-bottom: 0;
      }
    }
  }
</style>
