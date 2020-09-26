const code = `
<template>
  <div>
    <DatePickerCalendar
      :date.sync="date"
      :locale="locale"
      :modifiers="modifiers"
      :modifiers-class-names="modifiersClassNames"
      enable-grid-switch
    />
  </div>
</template>

<script>
import { enGB } from 'date-fns/locale'
import { getDay } from 'date-fns'
import { DatePickerCalendar, GRID_DAY } from 'vue-nice-dates'
import 'vue-nice-dates/dist/style.css'

const modifiers = {
  disabled: (date, type) => type === GRID_DAY && getDay(date) === 6, // Disables Saturdays
  highlight: (date, type) => type === GRID_DAY && getDay(date) === 2 // Highlights Tuesdays
}
const modifiersClassNames = {
  highlight: '-highlight'
}

// In your CSS:
// .nice-dates-day.-highlight { color: orange; }

export default {
  name: 'ModifiersExample',
  components: {
    DatePickerCalendar
  },
  data () {
    return {
      date: '',
      locale: enGB,
      modifiers,
      modifiersClassNames
    }
  }
}
</script>

`

export default code
