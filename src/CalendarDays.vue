<template>
  <div class="nice-dates-grid_wrapper">
    <div
      class="nice-dates-grid_container"
      :class="classObject"
      :style="styleObject"
      @mouseleave.prevent="handleMouseLeaveDates"
    >
      <calendar-day
        v-for="day in days"
        :key="lightFormat(day)"
        :date="day"
        :locale="locale"
        :style="styleForItem"
        :modifiers="generateModifiers(day)"
        :modifiers-class-names="modifiersClassNames"
        @click.native.prevent="handleClickDate(day)"
        @mouseenter.native.prevent="handleMouseEnterDate(day)"
        @touch.native.passive="handleClickDate(day)"
      />
    </div>
  </div>
</template>

<script>
import {
  eachDayOfInterval,
  isSameMonth,
  lightFormat,
  startOfMonth,
  addWeeks,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  endOfMonth,
  endOfWeek,
  isAfter,
  startOfWeek,
  isSameDay
} from 'date-fns'
import {
  ORIGIN_BOTTOM,
  ORIGIN_TOP,
  TRANSITION_DURATION,
  GRID_DAY
} from './constants'
import CalendarDay from './CalendarDay'
import { invokeModifiers } from './utils'

export default {
  name: 'CalendarDays',
  components: {
    CalendarDay
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
      offset: 0,
      origin: ORIGIN_TOP,
      transition: false,
      transitionDuration: TRANSITION_DURATION,
      days: [],
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
      return { height: this.cellHeight + 'px' }
    }
  },
  watch: {
    initialDate(newValue, oldValue) {
      if (isSameMonth(newValue, oldValue)) return
      this.transitionToCurrentDate(newValue, oldValue)
    }
  },
  created() {
    this.initDates()
  },
  beforeDestroy() {
    clearTimeout(this.$data.$timeoutId)
  },
  methods: {
    initDates(date = this.initialDate) {
      this.startDate = this.getStartDate(date, this.locale)
      this.endDate = this.getEndDate(date, this.locale)
      this.offset = 0
      this.transition = false
      this.generateDays()
    },
    generateDays({ startDate = this.startDate, endDate = this.endDate } = {}) {
      this.days = eachDayOfInterval({
        start: startDate,
        end: endDate
      })
    },
    handleClickDate(date) {
      this.$emit('clickDate', date, GRID_DAY)
    },
    handleMouseEnterDate(date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates() {
      this.$emit('mouseLeaveDates')
    },
    generateModifiers(date) {
      return {
        selected: isSameDay(date, this.date || null),
        ...invokeModifiers(this.modifiers, date, GRID_DAY),
        outside: !isSameMonth(date, this.initialDate),
        wide: this.isWide
      }
    },
    lightFormat(date, format = 'yyyy-MM-dd') {
      return lightFormat(date, format)
    },
    getStartDate(date, locale) {
      return startOfWeek(startOfMonth(date), { locale })
    },
    getEndDate(date, locale) {
      return endOfWeek(
        addWeeks(endOfMonth(date), 6 - this.rowsInMonth(date, locale)),
        { locale }
      )
    },
    rowsInMonth(date, locale) {
      return this.rowsBetweenDates(startOfMonth(date), endOfMonth(date), locale)
    },
    rowsBetweenDates(startDate, endDate, locale) {
      return differenceInCalendarWeeks(endDate, startDate, { locale }) + 1
    },
    transitionToCurrentDate(date, oldDate) {
      clearTimeout(this.$data.$timeoutId)
      const diffs = differenceInCalendarMonths(date, oldDate)
      if (Math.abs(diffs) < 3) {
        this.transition = true
        date = startOfMonth(date)
        if (isAfter(date, oldDate)) {
          const rows =
            this.rowsBetweenDates(this.startDate, date, this.locale) - 1
          this.offset = -rows * this.cellHeight
          const endDate = this.getEndDate(date, this.locale)
          this.generateDays({ endDate })
          this.origin = ORIGIN_TOP
        } else {
          const gridHeight = this.cellHeight * 6
          const rows = this.rowsBetweenDates(date, this.endDate, this.locale)
          const startDate = this.getStartDate(date, this.locale)
          this.generateDays({ startDate })
          this.offset = rows * this.cellHeight - gridHeight
          this.origin = ORIGIN_BOTTOM
        }
        this.$data.$timeoutId = setTimeout(() => {
          this.initDates(date)
        }, this.transitionDuration)
      } else {
        this.initDates(date)
      }
    }
  }
}
</script>
