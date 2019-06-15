<template>
  <div class="grid-container">
    <div
      class="grid-item day"
      v-for="(day, index) in days"
      v-bind:key="index"
      v-bind:class="{ today: isToday(day)}"
    >
      {{ formatDate(day) }}
    </div>

    <calendar-view-item
      v-bind:events="currentWeeklies"
      v-bind:days="days"
      v-bind:today="today"
    />
    <calendar-view-item
      v-bind:events="currentCrucibles"
      v-bind:days="days"
      v-bind:today="today"
    />
    <calendar-view-item
      v-bind:events="currentAdventures"
      v-bind:days="days"
      v-bind:today="today"
    />
    <calendar-view-item
      v-bind:events="currentVanguards"
      v-bind:days="days"
      v-bind:today="today"
    />
    <calendar-view-item
      v-bind:events="currentGambits"
      v-bind:days="days"
      v-bind:today="today"
    />
    <calendar-view-item
      v-bind:events="currentOther"
      v-bind:days="days"
      v-bind:today="today"
    />

  </div>
</template>

<script>
import CalendarViewItem from './CalendarViewItem.vue'
import EventService from '../EventService';

export default {
  name: 'calendar_view',
  components: {
    CalendarViewItem
  },
  data: function () { return {
    currentWeeklies: [],
    currentCrucibles: [],
    currentAdventures: [],
    currentVanguards: [],
    currentGambits: [],
    currentOther: [],
    error: '',
    today: new Date(),
    days: [
      this.subDays(new Date(), 2),
      this.subDays(new Date(), 1),
      new Date(),
      this.addDays(new Date(), 1),
      this.addDays(new Date(), 2),
      this.addDays(new Date(), 3),
      this.addDays(new Date(), 4),
    ],
    daysOfTheWeek: ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
  }},
  async created() {
    try {
      var currentEvents = await EventService.getCurrentEvents();
      this.currentWeeklies = currentEvents
        .filter(event => event.type == "Weekly Reset")
        .sort((event1, event2) => {return event1.start - event2.start});
      this.currentCrucibles = currentEvents
        .filter(event => event.type == "Crucible Daily")
        .sort((event1, event2) => {return event1.start - event2.start});
      this.currentAdventures = currentEvents
        .filter(event => event.type == "Daily Heroic Adventure")
        .sort((event1, event2) => {return event1.start - event2.start});
      this.currentVanguards = currentEvents
        .filter(event => event.type == "Vanguard Daily Strike")
        .sort((event1, event2) => {return event1.start - event2.start});
      this.currentGambits = currentEvents
        .filter(event => event.type == "Gambit Daily")
        .sort((event1, event2) => {return event1.start - event2.start});
      this.currentOther = currentEvents
        .filter(
          event => !(
            ["Weekly Reset","Crucible Daily","Daily Heroic Adventure","Vanguard Daily Strike","Gambit Daily"]
              .includes(event.type)
          )
        ).sort((event1, event2) => {return event1.start - event2.start});
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    formatDate(date) {
      return `${this.daysOfTheWeek[date.getDay()]} (${date.getMonth()}/${date.getDate()})`;
    },
    addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    subDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() - days);
      return result;
    },
    isToday(date) {
      return date.getDate() == this.today.getDate() &&
        date.getMonth() == this.today.getMonth() &&
        date.getFullYear() == this.today.getFullYear();
    },
  }
}
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
}

.grid-item {
  margin: 2px;
  padding: 2px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 7px;
}

.day {
  border: 2px solid black;
  background: grey;
  color: #ffffff;
  grid-column: span 2;
}

.today {
  background: #ffffff;
  color: grey;
}

.full-week {
  grid-column: 2 / 14;
}

.event {
  border: 4px solid black;
}

.start-last-week {
  border-left: none;
  grid-column-start: 1;
  border-radius: 0px 7px 7px 0px;
}

.end-next-week {
  border-right: none;
  grid-column-end: 15;
  border-radius: 7px 0px 0px 7px;
}

.start-day-0 {
  grid-column-start: 2;
}

.end-day-0 {
  grid-column-end: 2;
}

.start-day-1 {
  grid-column-start: 4;
}

.end-day-1 {
  grid-column-end: 4;
}

.start-day-2 {
  grid-column-start: 6;
}

.end-day-2 {
  grid-column-end: 6;
}

.start-day-3 {
  grid-column-start: 8;
}

.end-day-3 {
  grid-column-end: 8;
}

.start-day-4 {
  grid-column-start: 10;
}

.end-day-4 {
  grid-column-end: 10;
}

.start-day-5 {
  grid-column-start: 12;
}

.end-day-5 {
  grid-column-end: 12;
}

.start-day-6 {
  grid-column-start: 14;
}

.end-day-6 {
  grid-column-end: 14;
}

.gambit {
  background: #0b7b4d;
  color: #FFFFFF;
}

.vanguard {
  background: #f36621;
  color: #FFFFFF;
}

.crucible {
  background: #c62b29;
  color: #FFFFFF;
}

.weekly {
  background: #3a87ad;
  color: #FFFFFF;
}

.special {
  background: #DAA520;
  color: #FFFFFF;
}

.heroic-adventure {
  background: #232b57;
  color: #FFFFFF;
}

.future-gambit {
  background: #466d5d;
  color: #FFFFFF;
}

.future-vanguard {
  background: #ec976e;
  color: #FFFFFF;
}

.future-crucible {
  background: #c15d5b;
  color: #FFFFFF;
}

.future-weekly {
  background: #7194a5;
  color: #FFFFFF;
}

.future-heroic-adventure {
  background: #383b4f;
  color: #FFFFFF;
}

.future-special {
  background: #E8C979;
  color: #FFFFFF;
}

.past {
  background: #9e9e9e;
}
</style>