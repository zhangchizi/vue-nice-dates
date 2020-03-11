<template>
  <div class="nice-dates-navigation">
    <a
      class="nice-dates-navigation_previous"
      :class="{'-disabled': isMinimumMonth}"
      @click.prevent="handlePrevious"
      @touchend.prevent="handlePrevious"
    ></a>

    <span class="nice-dates-navigation_current">
      {{ monthText }}
    </span>

    <a
      class="nice-dates-navigation_next"
      :class="{'-disabled': isMaximumMonth}"
      @click.prevent="handleNext"
      @touchend.prevent="handleNext"
    ></a>
  </div>
</template>
<script>
import { addMonths, getYear, startOfMonth, subMonths, format, isSameMonth } from 'date-fns'

export default {
  name: 'CalendarNavigation',
  props: {
    locale: {
      required: true,
      type: Object
    },
    month: {
      type: Date,
      default () {
        return new Date()
      }
    },
    minimumDate: {
      type: Date,
      default: null
    },
    maximumDate: {
      type: Date,
      default: null
    }
  },
  computed: {
    isMinimumMonth () {
      if (!this.minimumDate) return false
      return isSameMonth(this.month, this.minimumDate)
    },
    isMaximumMonth () {
      if (!this.maximumDate) return false
      return isSameMonth(this.month, this.maximumDate)
    },
    monthText () {
      const type = getYear(this.month) === getYear(new Date()) ? 'MMMM' : 'MMMM yyyy'
      return format(this.month, type, { locale: this.locale })
    }
  },
  methods: {
    handlePrevious () {
      const month = startOfMonth(subMonths(this.month, 1))
      this.$emit('monthChange', month)
    },
    handleNext () {
      const month = startOfMonth(addMonths(this.month, 1))
      this.$emit('monthChange', month)
    }
  }
}
</script>
