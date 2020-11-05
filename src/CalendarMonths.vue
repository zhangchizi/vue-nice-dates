<template>
  <div class="nice-dates-grid_wrapper">
    <div
      class="nice-dates-grid_container"
      :class="classObject"
      :style="styleObject"
      @mouseleave.prevent="handleMouseLeaveDates"
    >
      <CalendarMonth
        v-for="item in months"
        :key="lightFormat(item)"
        :locale="locale"
        :date="item"
        :is-wide="isWide"
        :style="styleForItem"
        :modifiers="generateModifiers(item)"
        :modifiers-class-names="modifiersClassNames"
        @click.native.prevent="handleClickDate(item)"
        @mouseenter.native.prevent="handleMouseEnterDate(item)"
        @touch.native.passive="handleClickDate(item)"
      />
    </div>
  </div>
</template>

<script>
import {
  endOfYear,
  startOfYear,
  eachMonthOfInterval,
  addMonths,
  subMonths,
  isSameYear,
  isSameMonth,
  startOfMonth,
  getYear,
  isAfter,
  lightFormat
} from 'date-fns'
import CalendarMonth from './CalendarMonth'
import { invokeModifiers } from './utils'
import {
  ORIGIN_BOTTOM,
  ORIGIN_TOP,
  TRANSITION_DURATION,
  GRID_MONTH
} from './constants'

const GRID_ROWS = 5
const GRID_COLS = 4

export default {
  name: 'CalendarMonths',
  components: {
    CalendarMonth
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
      type: Number,
      default: 0
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
      months: [],
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
      if (isSameYear(newValue, oldValue)) return
      this.transitionToCurrentDate(newValue, oldValue)
    }
  },
  created() {
    this.initMonths()
  },
  beforeDestroy() {
    clearTimeout(this.$data.$timeoutId)
  },
  methods: {
    initMonths(date = this.initialDate) {
      this.startDate = subMonths(startOfYear(date), GRID_COLS)
      this.endDate = addMonths(startOfMonth(endOfYear(date)), GRID_COLS)
      this.offset = 0
      this.transition = false
      this.generateMonths()
    },
    generateMonths({
      startDate = this.startDate,
      endDate = this.endDate
    } = {}) {
      this.months = eachMonthOfInterval({
        start: startDate,
        end: endDate
      })
    },
    handleClickDate(date) {
      this.$emit('clickDate', date, GRID_MONTH)
    },
    handleMouseEnterDate(date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates() {
      this.$emit('mouseLeaveDates')
    },
    generateModifiers(month) {
      return {
        selected: isSameMonth(month, this.date || null),
        ...invokeModifiers(this.modifiers, month, GRID_MONTH),
        outside: !isSameYear(month, this.initialDate),
        wide: this.isWide
      }
    },
    transitionToCurrentDate(date, oldDate) {
      clearTimeout(this.$data.$timeoutId)
      const diffs = Math.abs(getYear(date) - getYear(oldDate))
      if (diffs < 3) {
        this.transition = true
        const offset = ((this.cellHeight * 6) / GRID_ROWS) * 3
        const count = GRID_COLS * (GRID_ROWS - 1)
        if (isAfter(date, oldDate)) {
          this.offset = -offset
          const endDate = addMonths(this.endDate, count)
          this.generateMonths({ endDate })
          this.origin = ORIGIN_TOP
        } else {
          this.offset = offset
          const startDate = subMonths(this.startDate, count)
          this.generateMonths({ startDate })
          this.origin = ORIGIN_BOTTOM
        }
        this.$data.$timeoutId = setTimeout(() => {
          this.initMonths(date)
        }, this.transitionDuration)
      } else {
        this.initMonths(date)
      }
    },
    lightFormat(date, format = 'yyyy-MM-dd') {
      return lightFormat(date, format)
    }
  }
}
</script>
