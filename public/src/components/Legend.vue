<template>
  <div class="legend">
    <div class="forces">
      <h3 class="legend-heading">Icons</h3>
      <div class="inline">
        <span class="force-name">Asheville Police</span>
        <span class="icon apd"></span>
        <span class="force-name">Buncombe County Sheriff</span>
        <span class="icon sheriff"></span>
        <span class="force-name">Traffic Control Records</span>
        <span class="icon open"></span>
      </div>
    </div>
    <div class="beats">
      <h3 class="legend-heading">Beats</h3>
      <div class="inline">
        <span class="beat-name">Adam: </span>
        <span class="beat-color adam"></span>
        <span class="beat-name">Charlie: </span>
        <span class="beat-color charlie"></span>
        <span class="beat-name">Baker: </span>
        <span class="beat-color baker"></span>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  .legend {
    display: flex;
    flex-wrap: nowrap;

    .legend-heading {
      margin-bottom: 12px;

      .inline {
        display: inline-block;
      }
    }
  }
  .forces {
    display: inline-block;
    flex-basis: 50%;

    .force-name {
      margin-right: 6px;
    }

    .icon {
      margin-right: 12px;
      height: 20px;
      width: 20px;
      background-size: cover;
      display: inline-block;
    }

    .apd {
      background-image: url("/public/icons/apd.png");
    }
    .sheriff {
      background-image: url("/public/icons/sheriff.png");
    }
    .open {
      background-image: url("/public/icons/open-icon.png")
    }

  }

  .beats {
    display: inline-block;
    flex-basis: 50%;

    .beat-name {
      margin-right: 6px;

    }

    .beat-color {
      margin-right: 12px;
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
