<template>
  <div
    class="nice-dates-year"
    :class="yearClassNames"
  >
    <span class="nice-dates-year_item">{{ yearText }}</span>
  </div>
</template>
<script>
import { format, isSameYear } from 'date-fns'

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
  name: 'CalendarYear',
  props: {
    locale: {
      required: true,
      type: Object
    },
    date: {
      required: true,
      type: Date
    },
    modifiers: {
      type: Object,
      default () {
        return {}
      }
    },
    modifiersClassNames: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    yearText () {
      return format(this.date, 'yyyy', { locale: this.locale })
    },
    computedModifiersClassNames () {
      return { ...defaultModifiersClassNames, ...this.modifiersClassNames }
    },
    computedModifiers () {
      return { today: isSameYear(this.date, new Date()), ...this.modifiers }
    },
    yearClassNames () {
      const result = {}
      Object.keys(this.computedModifiers).forEach(name => {
        result[this.computedModifiersClassNames[name]] = this.computedModifiers[name]
      })
      return result
    }
  }
}
</script>
