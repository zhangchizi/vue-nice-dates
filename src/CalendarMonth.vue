<template>
  <div class="nice-dates-month" :class="monthClassNames">
    <span class="nice-dates-month_item">{{ monthText }}</span>
  </div>
</template>
<script>
import { format, isSameMonth } from 'date-fns'

const defaultModifiersClassNames = {
  today: '-today',
  outside: '-outside',
  wide: '-wide',
  disabled: '-disabled',
  selected: '-selected'
}

export default {
  name: 'CalendarMonth',
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
      default() {
        return {}
      }
    },
    modifiersClassNames: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    monthText() {
      return format(this.date, 'MMM', { locale: this.locale })
    },
    computedModifiersClassNames() {
      return { ...defaultModifiersClassNames, ...this.modifiersClassNames }
    },
    computedModifiers() {
      return { today: isSameMonth(this.date, new Date()), ...this.modifiers }
    },
    monthClassNames() {
      const result = {}
      Object.keys(this.computedModifiers).forEach(name => {
        result[this.computedModifiersClassNames[name]] = this.computedModifiers[
          name
        ]
      })
      return result
    }
  }
}
</script>
