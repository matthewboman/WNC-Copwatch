<template>
  <div>
    <section class="top">
      <div class="container">
        <h1 class="title">Asheville Policing Statistics</h1>
        <div class="what-we-do">
          <div class="block">
          <div class="q"><h3>What we do</h3></div>
          <span class="a">
            This application makes it easy for community members to analyze police data and document systemic discrimination.
          </span>
        </div>
        <div class="block">
          <div class="q"><h3>Our goals</h3></div>
          <span class="a">
            We hope to provide tools and visualizations to empower members of the community to hold the Asheville Police Department accountable.
            <br />
            <br />
            While it's common to hear people share stories of abuse and mistreatment, these are unfortunately often ignored as they lack data, and even when there is evidence, it is often covered up.
          </span>
        </div>
        <div class="block">
          <div class="q"><h3>Working together</h3></div>
          <span class="a">
            This tool is a work in progress and always expanding in capability. If there are any particular analyses you would like us to develop, please reach out.
          </span>
        </div>
        </div>
      </div>
    </section>

    <section class="center">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <p>
              This map compares all times a driver, passenger, and/or vehicle were searched in October 2017. The red dots represent cases in which consent to a search was given, whereas the green represents times that the parties gave no consent.
            </p>
            <p>
              By using <a class="white-link" href="/map">our map</a>, one could toggle not only between these two views, but also see cases in which an officer cited "probable cause".
            </p>
            <p>
              <a class="white-link" href="/studies">Our studies</a> also breakdown stops, searches, and arrests for further analysis.
            </p>
          </div>
          <div class="col-md-6 col-sm-12">
            <img class="demo-map-1" src="../../images/october2017_searches.png" title="october 2017 searches" alt="A map showing searches where the individuals did not consent" />
          </div>
        </div>
      </div>
    </section>

    <section class="bottom">
      <div class="container">
        <div class="notes">
          <h2 class="title">A few notes on the data we provide</h2>
          <div class="block">
            <div class="q"><h3>Accuracy</h3></div>
            <span class="a">
               While (or perhaps because) it comes directly from Asheville's traffic stop data and APD's daily bulletins, we cannot guarantee the accuracy of the data we present.
            </span>
          </div>
          <div class="block">
            <div class="q"><h3>Crime</h3></div>
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
    </section>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>

  .top {

    .what-we-do {

    }
  }

  .center {
    padding-top: 10%;
    padding-bottom: 10%;
    background-color: rgb(110, 64, 170);
    margin-bottom: 80px;

    p {
      vertical-align: middle;
      font-size: 1.5rem;
      line-height: 2rem;
      color: #fff;

      @media (max-width: 768px) {
        font-size: 1rem;
        line-height: 1.2rem;
      }
    }

    .white-link {
      color: white;
      font-weight: 600;

      &:hover {
        color: white;
        // text-decoration: none;
      }
    }


    .demo-map-1 {
      max-width: 100%;
      border-radius: 6px;
      box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);
    }
  }

  .bottom {

    .notes {
      margin-bottom: 64px;
    }

    .about {
      border-top: 1px solid #a09be7;
      padding-top: 64px;
      padding-bottom: 32px;
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
      border-right: 4px solid rgb(110, 64, 170);
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      background-color: #a09be7;
      padding: 12px;

      h3 {
        color: white;
      }
    }
    .a {
      line-height: 1.5rem;
      flex-basis: 70%;
      padding: 24px;
    }
  }

</style>
