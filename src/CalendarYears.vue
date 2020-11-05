<template>
  <div class="nice-dates-grid_wrapper">
    <div
      class="nice-dates-grid_container"
      :class="classObject"
      :style="styleObject"
      @mouseleave.prevent="handleMouseLeaveDates"
    >
      <CalendarYear
        v-for="(item, index) in years"
        :key="lightFormat(item)"
        :locale="locale"
        :date="item"
        :is-wide="isWide"
        :style="styleForItem"
        :modifiers="generateModifiers(item, index)"
        :modifiers-class-names="modifiersClassNames"
        @click.native.prevent="handleClickDate(item)"
        @mouseenter.native.prevent="handleMouseEnterYear(item)"
        @touch.native.passive="handleClickDate(item)"
      />
    </div>
  </div>
</template>

<script>
import {
  startOfYear,
  eachYearOfInterval,
  addYears,
  getYear,
  isSameYear,
  isAfter,
  subYears,
  lightFormat
} from 'date-fns'
import CalendarYear from './CalendarYear'
import { invokeModifiers } from './utils'
import {
  ORIGIN_BOTTOM,
  ORIGIN_TOP,
  TRANSITION_DURATION,
  GRID_YEAR
} from './constants'

const GRID_ROWS = 5
const GRID_COLS = 4

export default {
  name: 'CalendarYears',
  components: {
    CalendarYear
  },
  props: {
    locale: {
      required: true,
      type: Object
    },
    initialDate: {
      required: true,
      type: Date
    },
    date: {
      type: [Date, String],
      default: '',
      validator(value) {
        return value instanceof Date || value === ''
      }
    },
    cellHeight: {
      required: true,
      type: Number
    },
    isWide: {
      type: Boolean,
      default: false
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
  data() {
    return {
      startDate: null,
      endDate: null,
      years: [],
      offset: 0,
      origin: ORIGIN_TOP,
      transition: false,
      transitionDuration: TRANSITION_DURATION,
      $timeoutId: null
    }
  },
  computed: {
    classObject() {
      return {
        '-moving': !!this.offset,
        '-origin-bottom': this.origin === ORIGIN_BOTTOM,
        '-origin-top': this.origin === ORIGIN_TOP,
        '-transition': !!this.transition
      }
    },
    styleObject() {
      return {
        transform: `translate3d(0, ${this.offset}px, 0)`,
        transitionDuration: `${this.transitionDuration}ms`
      }
    },
    styleForItem() {
      return { height: (this.cellHeight * 6) / GRID_ROWS + 'px' }
    }
  },
  watch: {
    initialDate(newValue, oldValue) {
      this.transitionToCurrentDate(newValue, oldValue)
    }
  },
  created() {
    this.initYears()
  },
  beforeDestroy() {
    clearTimeout(this.$data.$timeoutId)
  },
  methods: {
    initYears() {
      this.startDate = startOfYear(this.initialDate)
      this.endDate = addYears(this.startDate, GRID_COLS * GRID_ROWS - 1)
      this.offset = 0
      this.transition = false
      this.generateYears()
    },
    generateYears({ startDate = this.startDate, endDate = this.endDate } = {}) {
      this.years = eachYearOfInterval({
        start: startDate,
        end: endDate
      })
    },
    handleClickDate(date) {
      this.$emit('clickDate', date, GRID_YEAR)
    },
    handleMouseEnterYear(date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates() {
      this.$emit('mouseLeaveDates')
    },
    generateModifiers(year, index) {
      return {
        selected: isSameYear(year, this.date || null),
        outside: index > 10,
        ...invokeModifiers(this.modifiers, year),
        wide: this.isWide
      }
    },
    transitionToCurrentDate(date, oldDate) {
      clearTimeout(this.$data.$timeoutId)
      const total = GRID_ROWS * GRID_COLS
      const diffYears = Math.abs(getYear(date) - getYear(oldDate))
      const diffs = Math.floor(diffYears / total)
      if (diffs > 0 && diffs < 3) {
        this.transition = true
        const offset = this.cellHeight * 6 * diffs
        if (isAfter(date, oldDate)) {
          this.offset = -offset
          const endDate = addYears(this.endDate, total * diffs)
          this.generateYears({ endDate })
          this.origin = ORIGIN_TOP
        } else {
          this.offset = offset
          const startDate = subYears(this.startDate, total * diffs)
          this.generateYears({ startDate })
          this.origin = ORIGIN_BOTTOM
        }
        this.$data.$timeoutId = setTimeout(() => {
          this.initYears(date)
        }, this.transitionDuration)
      } else {
        this.initYears(date)
      }
    },
    lightFormat(date, format = 'yyyy-MM-dd') {
      return lightFormat(date, format)
    }
  }
}
</script>
