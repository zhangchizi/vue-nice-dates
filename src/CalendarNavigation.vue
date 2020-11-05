<template>
  <div class="nice-dates-navigation">
    <a
      class="nice-dates-navigation_previous"
      :class="{ '-disabled': isMinimumDate }"
      @click.prevent="handlePrevious"
      @touchend.prevent="handlePrevious"
    ></a>

    <span class="nice-dates-navigation_current" @click="handleClickTitle">
      {{ monthText }}
    </span>

    <a
      class="nice-dates-navigation_next"
      :class="{ '-disabled': isMaximumDate }"
      @click.prevent="handleNext"
      @touchend.prevent="handleNext"
    ></a>
  </div>
</template>
<script>
import {
  addMonths,
  subMonths,
  format,
  isSameMonth,
  subYears,
  addYears,
  isSameYear
} from 'date-fns'
import {
  TRANSITION_DURATION,
  GRID_DAY,
  GRID_MONTH,
  GRID_YEAR
} from './constants'

const GRID_ROWS = 5
const GRID_COLS = 4

export default {
  name: 'CalendarNavigation',
  props: {
    locale: {
      required: true,
      type: Object
    },
    date: {
      required: true,
      type: Date
    },
    gridType: {
      required: true,
      type: String
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
  data() {
    return {
      $lastNavigateTime: 0
    }
  },
  computed: {
    isMinimumDate() {
      if (!this.minimumDate) return false
      if (this.gridType === GRID_DAY) {
        return isSameMonth(this.date, this.minimumDate)
      } else if (this.gridType === GRID_MONTH) {
        return isSameYear(this.date, this.minimumDate)
      } else {
        return false
      }
    },
    isMaximumDate() {
      if (!this.maximumDate) return false
      if (this.gridType === GRID_DAY) {
        return isSameMonth(this.date, this.maximumDate)
      } else if (this.gridType === GRID_MONTH) {
        return isSameYear(this.date, this.maximumDate)
      } else {
        return false
      }
    },
    formatType() {
      switch (this.gridType) {
        case GRID_DAY:
          return 'MMMM yyyy'
        default:
          return 'yyyy'
      }
    },
    monthText() {
      const date = format(this.date, this.formatType, { locale: this.locale })
      if (this.gridType === GRID_YEAR) {
        return `${date} - ${+date + GRID_ROWS * GRID_COLS - 1}`
      }
      return date
    }
  },
  methods: {
    handleClickTitle() {
      this.$emit('clickTitle')
    },
    handlePrevious() {
      const flag =
        Date.now() - this.$data.$lastNavigateTime <= TRANSITION_DURATION
      if (flag) return
      let date = null
      if (this.gridType === GRID_DAY) {
        date = subMonths(this.date, 1)
      } else if (this.gridType === GRID_MONTH) {
        date = subYears(this.date, 1)
      } else {
        date = subYears(this.date, GRID_ROWS * GRID_COLS)
      }
      this.$emit('navigate', date)
      this.$data.$lastNavigateTime = Date.now()
    },
    handleNext() {
      const flag =
        Date.now() - this.$data.$lastNavigateTime <= TRANSITION_DURATION
      if (flag) return
      let date = null
      if (this.gridType === GRID_DAY) {
        date = addMonths(this.date, 1)
      } else if (this.gridType === GRID_MONTH) {
        date = addYears(this.date, 1)
      } else {
        date = addYears(this.date, GRID_ROWS * GRID_COLS)
      }
      this.$emit('navigate', date)
      this.$data.$lastNavigateTime = Date.now()
    }
  }
}
</script>
