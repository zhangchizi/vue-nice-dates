<template>
  <div>
    <input
      v-model.trim="date"
      type="text"
      :readonly="isReadOnly"
      placeholder="dd/mm/yyyy"
      @focusout="handleFocusOut"
    />
    <DatePickerCalendar
      :date.sync="date"
      :locale="locale"
      @changeLastValidDate="changeLastValidDate"
    />
  </div>
</template>
<script>
import { enGB } from 'date-fns/locale'
import { DatePickerCalendar } from '../src'

export default {
  name: 'DatePickerCalendarExample',
  components: {
    DatePickerCalendar
  },
  data() {
    return {
      date: '',
      lastValidDate: '',
      locale: enGB,
      isReadOnly: 'ontouchstart' in window
    }
  },
  methods: {
    changeLastValidDate(date) {
      this.lastValidDate = date
    },
    handleFocusOut() {
      this.date = this.lastValidDate
    }
  }
}
</script>
