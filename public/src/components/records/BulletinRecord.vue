<template>
  <div class="record">
    <div class="left primary-background">
      <span class="date">{{ this.formatDate(record.dateTime) }}</span>
    </div>
    <div class="right">
      <p class="force">{{ this.formatForce(record.force) }}</p>
      <p class="description" v-if="record.description">{{this.removeTrailingComma(record.description)}}</p>
      <p class="address">{{ this.removeTrailingComma(record.address) }}</p>
    </div>
  </div>
</template>

<script>

  export default {
    props: [ 'record' ],
    methods: {
      formatForce: str => str.includes('apd')
        ? "Asheville Poilce Department"
        : "Buncome County Sheriff",
      formatDate: date => new Date(date).toDateString(),
      removeTrailingComma: str => (str.slice(-1) == ',')
        ? str.slice(0, -1)
        : str
    }
  }

</script>

<style lang="scss" scoped>
  .record {
    will-change: transform;
    margin: 18px 0;
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
      padding: 10px;

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
