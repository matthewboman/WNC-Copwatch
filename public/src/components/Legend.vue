<template>
  <div class="row">
    <div class="col col-md-6 forces">
      <h3>Icons</h3>
      <div class="inline">
        <span class="icon apd"></span>
        <span class="force-name">Asheville Police</span>
        <!-- <span class="icon sheriff"></span>
        <span class="force-name">Buncombe County Sheriff</span> -->
        <span class="icon open"></span>
        <span class="force-name">Traffic Control Records</span>
      </div>
    </div>
    <div class="col col-md-6 beats">
      <h3>Beats</h3>
      <div class="inline">
        <span class="beat-color adam"></span>
        <span class="beat-name">Adam</span>
        <span class="beat-color charlie"></span>
        <span class="beat-name">Charlie</span>
        <span class="beat-color baker"></span>
        <span class="beat-name">Baker</span>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>

  .inline {
    display: inline-block;
  }

  .forces {

    .force-name {
      margin-right: 12px;
    }

    .icon {
      height: 20px;
      width: 20px;
      background-size: cover;
      display: inline-block;
    }

    .apd {
      background-image: url("../../icons/apd.png");
    }
    .sheriff {
      background-image: url("../../icons/sheriff.png");
    }
    .open {
      background-image: url("../../icons/open-icon.png")
    }

  }

  .beats {

    .beat-name {
      margin-right: 12px;
    }

    .beat-color {
      height: 20px;
      width: 20px;
      display: inline-block;
    }

    .adam {
      background-color: green;
    }

    .charlie {
      background-color: yellow;
    }

    .baker {
      background-color: red;
    }
  }
</style>
