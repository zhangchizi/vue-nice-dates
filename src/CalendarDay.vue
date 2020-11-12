<template>
  <div class="nice-dates-day" :class="dayClassNames">
    <span v-if="dayOfMonth === 1" class="nice-dates-day_month">{{
      monthString
    }}</span>
    <span class="nice-dates-day_item">{{ dayOfMonth }}</span>
  </div>
</template>
<script>
import { getDate, format, isToday } from 'date-fns'

const defaultModifiersClassNames = {
  today: '-today',
  outside: '-outside',
  wide: '-wide',
  disabled: '-disabled',
  selected: '-selected',
  selectedStart: '-selected-start',
  selectedMiddle: '-selected-middle',
  selectedEnd: '-selected-end'
}

export default {
  name: 'CalendarDay',
  props: {
    date: {
      required: true,
      type: Date
    },
    modifiers: {
      type: Object,
      default() {
        return {}
      }
    },
    modifiersClassNames: {
      type: Object,
      default() {
        return {}
      }
    },
    locale: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      dayOfMonth: getDate(this.date)
    }
  },
  computed: {
    computedModifiersClassNames() {
      return { ...defaultModifiersClassNames, ...this.modifiersClassNames }
    },
    computedModifiers() {
      return { today: isToday(this.date), ...this.modifiers }
    },
    dayClassNames() {
      const result = {}
      Object.keys(this.computedModifiers).forEach(name => {
        result[this.computedModifiersClassNames[name]] = this.computedModifiers[
          name
        ]
      })
      return result
    },
    monthString() {
      return format(this.date, 'MMMM', { locale: this.locale }).substring(0, 3)
    }
  }
}
</script>
