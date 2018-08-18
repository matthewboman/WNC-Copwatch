<template>
  <div>
    <h2>Map legend</h2>
    <div class="forces">
      <p>
        <span class="force-name">
          Asheville Police
          <span class="icon apd"></span>
        </span>
        <span class="force-name">
          Buncombe County Sheriff
          <span class="icon sheriff"></span>
        </span>
      </p>
    </div>
    <div class="beats">
      <h3>Beats</h3>
      <p>
        <span class="beat-name">Adam: <span class="beat-color adam"></span></span>
        <span class="beat-name">Charlie: <span class="beat-color charlie"></span></span>
        <span class="beat-name">Baker: <span class="beat-color baker"></span></span>
      </p>
    </div>
  </div>
</template>

<script>

  export default {

  }

</script>

<style lang="scss" scoped>
  .forces {
    .force-name {
      margin-right: 10px;
    }

    .icon {
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

  }

  .beats {

    .beat-name {
      margin-right: 10px;
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
