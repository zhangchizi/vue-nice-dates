const code = `
<template>
  <div>
    <div>selected start date: {{ startDate }}</div>
    <div>selected end   date: {{ endDate }}</div>
    <div>currently selecting: {{ focusName }}</div>
    <DateRangePickerCalendar
      :start-date.sync="startDate"
      :end-date.sync="endDate"
      :locale="locale"
      :focus-name="focusName"
      @clickDate="handleClickDate"
    />
  </div>
</template>
<script>
import { enGB } from 'date-fns/locale'
import { DateRangePickerCalendar, START_DATE, END_DATE } from 'vue-nice-dates'
import 'vue-nice-dates/dist/style.css'

export default {
  name: 'DateRangePickerCalendarExample',
  components: {
    DateRangePickerCalendar
  },
  data () {
    return {
      startDate: '',
      endDate: '',
      locale: enGB,
      focusName: START_DATE
    }
  },
  methods: {
    handleClickDate () {
      if (this.focusName === START_DATE) {
        this.focusName = END_DATE
      } else {
        this.focusName = START_DATE
      }
    }
  }
}

</script>

`

export default code
