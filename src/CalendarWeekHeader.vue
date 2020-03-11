<template>
  <div class="nice-dates-week-header">
    <span
      v-for="day in weekDays()"
      :key="day"
      class="nice-dates-week-header_day"
    >
      {{ day }}
    </span>
  </div>
</template>
<script>
import { eachDayOfInterval, endOfWeek, startOfWeek, format } from 'date-fns'

export default {
  name: 'CalendarWeekHeader',
  props: {
    locale: {
      required: true,
      type: Object
    }
  },
  methods: {
    weekDays () {
      const today = new Date()
      const options = {
        locale: this.locale
      }
      return eachDayOfInterval({
        start: startOfWeek(today, options),
        end: endOfWeek(today, options)
      }).map(date => format(date, 'eee', options))
    }
  }
}
</script>
