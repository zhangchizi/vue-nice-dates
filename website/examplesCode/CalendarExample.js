const code = `
<template>
  <div>
    <Calendar
      :locale="locale"
      :modifiers="modifiers"
      @clickDate="handleClickDate"
    />
  </div>
</template>
<script>
import { enGB } from 'date-fns/locale'
import { isSameDay } from 'date-fns'
import { Calendar } from 'vue-nice-dates'
import 'vue-nice-dates/dist/style.css'

export default {
  name: 'CalendarExample',
  components: {
    Calendar
  },
  data () {
    return {
      dates: [],
      locale: enGB
    }
  },
  computed: {
    modifiers () {
      return {
        selected: (date) => {
          return this.dates.some(item => isSameDay(item, date))
        }
      }
    }
  },
  methods: {
    handleClickDate (date) {
      this.dates.push(date)
    }
  }
}
</script>

`

export default code
