<template>
  <div class="record">
    <span class="force">{{ this.formatForce(record.force) }}</span>
    <span class="date">{{ this.formatDate(record.dateTime) }}</span>
    <p class="description">{{ record.description }}</p>
    <p class="address">{{ record.address }}</p>
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
    }

  }

</script>

<style lang="scss" scoped>
  .record {
    will-change: transform;
    margin: 10px;
    padding: 10px;
    position: relative;
    border-radius: 2px;
    overflow: hidden;
    background-color: #fafafa;
    transition: all 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);

    .force {

    }

    .date {

    }

    .description {

    }

    .address {
      margin-bottom: 0;
    }
  }
</style>
