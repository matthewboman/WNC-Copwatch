<template>
  <div class="endpoint-doc">
    <h3 class="title">{{ endpoint.title }}</h3>
    <p class="description">{{ endpoint.description }}</p>
    <p>URL: <a :href="BASE_URL + endpoint.url" class="url" target="_blank">{{ endpoint.url }}</a></p>
    <p v-if="endpoint.parameters.length" >
    Parameters:
    </p>
      <ul class="parameters">
        <li v-for="parameter in endpoint.parameters" class="parameter">{{ parameter }}</li>
      </ul>
    <div class="example-block">
      <div class="url" @click="displayResult = !displayResult">
        <span class="label">Example URL: </span>
        <span class="example">{{ endpoint.example }}</span>
        <span class="carat" ></span>
      </div>
      <transition name="open" mode="out-in">
        <pre class="result" v-show="displayResult">
          {{ endpoint.result }}
        </pre>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    props: [ 'endpoint' ],
    data() {
      return {
        BASE_URL: 'http://copwatch.avlcommunityaction.com',
        displayResult: false
      }
    },
  }
</script>

<style lang="scss" scoped>
  .endpoint-doc {
    margin-bottom: 48px;

    .description {
      font-weight: 400;
    }

    .url {
      color: #863ddc;

      &:hover {
        color: #5f00ba;
        cursor: pointer;
      }
    }

    .example-block {
      background-color: #dddcf8;
      padding: 12px;

      .url {
        text-align: center;

        .label {
          font-weight: 600;
        }

        .example {
          margin-left: 12px;
        }

        .carat {
          margin-left: 12px;
          padding-right: 24px;
          background-image: url('/public/icons/carat-down.png');
          background-size: 24px;
          background-repeat: no-repeat;
          background-position: right;
          margin-bottom: 12px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .result {
        // height: 200px;
      }
    }
  }

  /* animations */
  .open-enter {
    max-height: 0px;
    opacity: 0;
  }
  .open-enter-active {
    transition: all 0.5s ease;
  }
  .open-enter-to {
    max-height: 1000px;
    opacity: 1;
  }

  .open-leave {
    opacity: 1;
    max-height: 1000px;
  }

  .open-leave-active {
    transition: all 0.5s ease;
  }

  .open-leave-to {
    opacity: 0;
    max-height: 0px;
  }
</style>
