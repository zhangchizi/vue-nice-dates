const code = `
<template>
  <div>
    <input
      v-model.trim="date"
      type="text"
      :readonly="isReadOnly"
      placeholder="dd/mm/yyyy"
      @focusout="handleFocusOut"
    >
    <DatePickerCalendar
      :date.sync="date"
      :locale="locale"
      @changeLastValidDate="changeLastValidDate"
    />
  </div>
</template>
<script>
import { enGB } from 'date-fns/locale'
import { DatePickerCalendar } from 'vue-nice-dates'
import 'vue-nice-dates/dist/style.css'

export default {
  name: 'DatePickerCalendarExample',
  components: {
    DatePickerCalendar
  },
  data () {
    return {
      date: '',
      lastValidDate: '',
      locale: enGB,
      isReadOnly: 'ontouchstart' in window
    }
  },
  methods: {
    // you don't need this if set "readonly=true" to <input>
    changeLastValidDate (date) {
      this.lastValidDate = date
    },
    // you don't need this if set "readonly=true" to <input>
    handleFocusOut () {
      this.date = this.lastValidDate
    }
  }
}

</script>

`

export default code
