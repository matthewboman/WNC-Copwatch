<template>
  <div class="container">
    <div class="top">
      <h1 class="title">WNC Copwatch</h1>
      <div class="what-we-do">
        <div class="block">
        <div class="q"><span>What we do</span></div>
        <span class="a">
          WNC Copwatch makes it easy for community members to analyze police data and document systemic discrimination.
        </span>
      </div>
      <div class="block">
        <div class="q"><span>Our goals</span></div>
        <span class="a">
          We hope to provide tools and visualizations to empower members of the community to hold the Asheville Police Department accountable.
          <br />
          <br />
          While it's common to hear people share stories of abuse and mistreatment, these are unfortunately often ignored as they lack data, and even when there is evidence, it is often covered up.
        </span>
      </div>
      <div class="block">
        <div class="q"><span>Working together</span></div>
        <span class="a">
          This tool is a work in progress and always expanding in capability. If there are any particular analyses you would like us to develop, please reach out.
        </span>
      </div>
      </div>
    </div>

    <div class="center">
      <div class="left">
        <div class="content">
          <p>
            This map compares all times a driver, passenger, and/or vehicle were searched in October 2017. The red dots represent cases in which consent to a search was given, whereas the green represents times that the parties gave no consent.
          </p>
          <p>
            By using our map, one could toggle not only between these two views, but also see in which cases an officer cited "probable cause".
          </p>
        </div>
      </div>
      <div class="right">
        <img class="demo-map-1" src="/public/images/october2017_searches.png" title="october 2017 searches" alt="A map showing searches where the individuals did not consent" />
      </div>
    </div>
    <div class="bottom">
      <div class="notes">
        <h2 class="title">A few notes on the data we provide</h2>
        <div class="block">
          <div class="q"><span>Accurancy</span></div>
          <span class="a">
             While (or prehaps because) it comes directly from Asheville's traffic stop data and APD's daily bulletins, we cannot guarantee the accurancy of the data we present.
          </span>
        </div>
        <div class="block">
          <div class="q"><span>Crime</span></div>
          <span class="a">
            This is not, nor is it intended to be, a map of crime. Conceptions of where crime occurs are self-reinforcing. It is not that crime has a higher occurence in some areas over others; police find crime where they look for it, which is most-often a result of conscious or subconscious biases.
          </span>
        </div>
      </div>
      <div class="about">
        <p>
          This applications is developed and maintained by volunteers. We're always looking to grow and expand our services. We're also open to suggestions. If you'd like to get involved, you can <a href="mailto:alvcommunityaction@gmail.com">email us</a> or <a href="https://github.com/crashspringfield/WNC-Copwatch" target="_blank">checkout our code repository</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  .container {

    .top {
      padding: 0 25%;
      min-height: 90vh;

      .what-we-do {

      }
    }

    .center {
      padding: 5% 15%;
      background-color: #5f00ba;
      margin-bottom: 80px;
      display: flex;
      flex-wrap: nowrap;

      @media (max-width: 767px) {
        flex-wrap: wrap;
      }

      .left {
        flex-grow: 1;
        flex-basis: 50%;
        margin-right: 64px;
        display: flex;
        align-items: center;

        .content {
          p {
            font-size: 28px;
            line-height: 32px;
            color: #fff;
          }
        }
      }

      .right {
        flex-grow: 1;
        flex-basis: 50%;

        .demo-map-1 {
          max-width: 100%;
          border-radius: 6px;
          box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);
        }
      }
    }

    .bottom {
      padding: 0 25%;

      .notes {
        margin-bottom: 64px;
      }

      .about {
        border-top: 1px solid #a09be7;
        padding-top: 64px;
        padding-bottom: 32px;

        p {
          font-size: 24px;
          line-height: 28px
        }
      }
    }
  }

  a {
    color: #863ddc;
    text-decoration: none;

    &:hover {
      color: #5f00ba;
      cursor: pointer;
    }
  }

  /* classes for `top` and `bottom` */
  .title {
    font-weight: 400;
    font-size: 48px;
    text-align: center;
    margin-bottom: 64px;
    margin-top: 32px;
  }

  .block {
    display: flex;
    margin-bottom: 64px;
    border-radius: 6px;
    box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);

    .q {
      flex-basis: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 4px solid #5f00ba;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      background-color: #a09be7;

      span {
        font-size: 32px;
        color: white;
      }
    }
    .a {
      font-size: 28px;
      line-height: 32px;
      flex-basis: 70%;
      padding: 24px;
    }
  }

</style>
