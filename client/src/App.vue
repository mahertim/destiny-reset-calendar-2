<template>
  <div id="app">
    <div id="header">
      <h1 class="header-text">Destiny 2 Powerful Engram Reset Calendar 2.0</h1>
    </div>
    <CalendarView />
    <div class="grid-container-footer">
      <div id="weekly-reset-box" class="grid-item-footer">
        <h2 class="header-text">Weekly Resets Include:</h2>
        <div class="grid-container-weekly-list">
          <div class="grid-item-weekly-list"><ul><li>Spider's Powerful Bounty</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Raids</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Weekly Crucible</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Weekly Gambit</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Nightfall</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Nightfall High Score</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Clan XP</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Petra's Weekly Bouties</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Flashpoints</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Weekly Story Playlist</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Weekly Vanguard Strikes</li></ul></div>
          <div class="grid-item-weekly-list"><ul><li>Werner 99-40's Weekly Bounties</li></ul></div>
        </div>
      </div>
      <div id="social-media-box" class="grid-item-footer">
        <h2 class="header-text">Social Media:</h2>
        <p class="social-link large-screen">
          Report bugs on Twitter: 
          <a href="https://twitter.com/DestinyResetNet" target="_blank">
            @DestinyResetNet
          </a>
        </p>
        <p class="social-link large-screen">
          Message me on Discord: Voqics#7624
        </p>
        <p class="social-link large-screen">
          Watch me stream on Twitch: 
          <a href="https://www.twitch.tv/voqics" target="_blank">
            Voqics
          </a>
        </p>
        <p class="social-link small-screen">
          Twitter: 
          <a href="https://twitter.com/DestinyResetNet" target="_blank">
            @DestinyResetNet
          </a>
        </p>
        <p class="social-link small-screen">
          Discord: Voqics#7624
        </p>
        <p class="social-link small-screen">
          Twitch: 
          <a href="https://www.twitch.tv/voqics" target="_blank">
            Voqics
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarView from './components/CalendarView.vue'

export default {
  name: 'app',
  components: {
    CalendarView
  }
}
</script>

<style>
body {
  background: url('./assets/background.jpg') no-repeat center center fixed;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: darkslategray;
  margin-top: 60px;
}

#header {
  background-color: black;
  color: darkgray;
  text-align: left;
  border-radius: 7px;
  padding: 5px;
  margin-bottom: 10px;
}

#weekly-reset-box {
  background-color: #3a87ad;
  color: #FFFFFF;
  text-align: left;
  border-radius: 7px;
  padding: 5px;
  margin-top: 10px;
}

#social-media-box {
  background-color: #000000;
  color: #FFFFFF;
  text-align: left;
  border-radius: 7px;
  padding: 5px;
  margin-top: 10px;
}

.large-screen {
  display: none;
}

.header-text {
  margin: 5px;
}

.grid-container-weekly-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.grid-container-footer {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 10px;
}

.social-link {
  padding: 10px;
}

a:visited{
  color: blue;
}

@media (min-width: 860px) {
  .grid-container-weekly-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1265px) {
  .grid-container-weekly-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .large-screen {
    display: inherit;
  }

  .small-screen {
    display: none;
  }
}

</style>
