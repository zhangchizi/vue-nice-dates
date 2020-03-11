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
import { Calendar } from '../src'

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
          return this.dates.indexOf(date) > -1
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
