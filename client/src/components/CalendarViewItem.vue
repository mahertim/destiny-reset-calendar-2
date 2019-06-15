<template>
  <div class="grid-container start-last-week end-next-week">
    <div
      class="grid-item event"
      v-for="event in events"
      v-bind:key="event.index"
      v-bind:class="classesForEvent(event)"
    >
      {{ event.type }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    events: Array,
    days: Array,
    today: Date,
    colorClass: String,
  },
  methods: {
    classesForEvent: function(event) {
      var classes = [];

      // Position event
      var started = false;
      var ended = false;
      this.days.forEach((day, index) => {
        if (this.sameDay(event.start, day)) {
          classes = [...classes, `start-day-${index}`];
          started = true;
        }
        if (this.sameDay(event.end, day)) {
          classes = [...classes, `end-day-${index}`];
          ended = true;
        }
      });
      if (!started) {
        classes = [...classes, "start-last-week"];
      }
      if (!ended) {
        classes = [...classes, "end-next-week"];
      }

      // Assign color
      // Check if event ended in the past
      if (event.end < this.today) {
        classes = [...classes, "past"]
      }
      // Check if event starts in the future
      else if (event.start > this.today) {
        classes = [...classes, this.futureColorClassForType(event.type)]
      }
      // Event must be current
      else {
        classes = [...classes, this.currentColorClassForType(event.type)];
      }

      // Return computed class list
      return classes;
    },
    sameDay(date1, date2) {
      return date1.getDate() == date2.getDate() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getFullYear() == date2.getFullYear();
    },
    currentColorClassForType(type) {
      switch(type) {
        case "Weekly Reset":
          return "weekly";
        case "Crucible Daily":
          return "crucible"
        case "Daily Heroic Adventure":
          return "heroic-adventure"
        case "Vanguard Daily Strike":
          return "vanguard"
        case "Gambit Daily":
          return "gambit"
        default:
          return "special"
      }
    },
    futureColorClassForType(type) {
      switch(type) {
        case "Weekly Reset":
          return "future-weekly";
        case "Crucible Daily":
          return "future-crucible"
        case "Daily Heroic Adventure":
          return "future-heroic-adventure"
        case "Vanguard Daily Strike":
          return "future-vanguard"
        case "Gambit Daily":
          return "future-gambit"
        default:
          return "future-special"
      }
    },
  }
}
</script>

<style>
</style>
