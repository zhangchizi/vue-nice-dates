<template>
  <div
    class="nice-dates-grid"
    :style="styleObjectGrid"
  >
    <div
      ref="containerElementRef"
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
        :height="cellHeight"
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
import CalendarDay from './CalendarDay'
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
  isEqual,
  startOfWeek
} from 'date-fns'
import { ORIGIN_BOTTOM, ORIGIN_TOP } from './constants'

const CELL_WIDTH_BREAKPOINT = 60

export default {
  name: 'CalendarGrid',
  components: {
    CalendarDay
  },
  props: {
    locale: {
      required: true,
      type: Object
    },
    month: {
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
    },
    transitionDuration: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      cellHeight: 0,
      isWide: false,
      offset: 0,
      origin: ORIGIN_TOP,
      transition: false,
      days: [],
      $timeoutId: null,
      $hasMounted: false
    }
  },
  computed: {
    classObject () {
      return {
        '-moving': !!this.offset,
        '-origin-bottom': this.origin === ORIGIN_BOTTOM,
        '-origin-top': this.origin === ORIGIN_TOP,
        '-transition': !!this.transition
      }
    },
    styleObject () {
      return {
        transform: `translate3d(0, ${this.offset}px, 0)`,
        transitionDuration: `${this.transitionDuration}ms`
      }
    },
    styleObjectGrid () {
      return { height: this.cellHeight * 6 + 'px' }
    }
  },
  watch: {
    month (newValue, oldValue) {
      if (isSameMonth(newValue, oldValue)) return
      this.transitionToCurrentMonth(newValue, oldValue)
    },
    startDate (newValue, oldValue) {
      if (!this.$data.$hasMounted) return
      if (isEqual(newValue, oldValue)) return
      this.generateDays({ startDate: newValue })
    },
    endDate (newValue, oldValue) {
      if (!this.$data.$hasMounted) return
      if (isEqual(newValue, oldValue)) return
      this.generateDays({ endDate: newValue })
    }
  },
  created () {
    this.resetData()
    this.generateDays()
  },
  mounted () {
    this.initCell()
    this.$nextTick(() => {
      this.$data.$hasMounted = true
    })
    window.addEventListener('resize', this.initCell)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.initCell)
  },
  methods: {
    resetData (month = this.month) {
      this.startDate = this.getStartDate(month, this.locale)
      this.endDate = this.getEndDate(month, this.locale)
      this.offset = 0
      this.transition = false
    },
    initCell () {
      const containerWidth = this.$refs.containerElementRef.offsetWidth
      const cellWidth = containerWidth / 7
      if (cellWidth > CELL_WIDTH_BREAKPOINT) {
        this.cellHeight = Math.round(cellWidth * 0.75)
        this.isWide = true
      } else {
        this.cellHeight = Math.round(cellWidth)
        this.isWide = false
      }
    },
    generateDays ({ startDate = this.startDate, endDate = this.endDate } = {}) {
      this.days = eachDayOfInterval({
        start: startDate,
        end: endDate
      })
    },
    handleClickDate (date) {
      this.$emit('clickDate', date)
    },
    handleMouseEnterDate (date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates () {
      this.$emit('mouseLeaveDates')
    },
    generateModifiers (date) {
      return {
        ...this.computeModifiers(this.modifiers, date),
        outside: !isSameMonth(date, this.month),
        wide: this.isWide
      }
    },
    computeModifiers (modifiers, date) {
      const computedModifiers = {}
      Object.keys(modifiers).map(key => {
        computedModifiers[key] = modifiers[key](date)
      })
      return computedModifiers
    },
    lightFormat (date, format = 'yyyy-MM-dd') {
      return lightFormat(date, format)
    },
    getStartDate (date, locale) {
      return startOfWeek(startOfMonth(date), { locale })
    },
    getEndDate (date, locale) {
      return endOfWeek(addWeeks(endOfMonth(date), 6 - this.rowsInMonth(date, locale)), { locale })
    },
    rowsInMonth (date, locale) {
      return this.rowsBetweenDates(startOfMonth(date), endOfMonth(date), locale)
    },
    rowsBetweenDates (startDate, endDate, locale) {
      return differenceInCalendarWeeks(endDate, startDate, { locale }) + 1
    },
    transitionToCurrentMonth (month, oldMonth) {
      clearTimeout(this.$data.$timeoutId)
      const diffs = differenceInCalendarMonths(month, oldMonth)
      if (Math.abs(diffs) < 3) {
        this.transition = true
        month = startOfMonth(month)
        if (isAfter(month, oldMonth)) {
          const rows = this.rowsBetweenDates(this.startDate, month, this.locale) - 1
          this.offset = -rows * this.cellHeight
          this.endDate = this.getEndDate(month, this.locale)
          this.origin = ORIGIN_TOP
        } else {
          const gridHeight = this.cellHeight * 6
          const rows = this.rowsBetweenDates(month, this.endDate, this.locale)
          this.startDate = this.getStartDate(month, this.locale)
          this.offset = rows * this.cellHeight - gridHeight
          this.origin = ORIGIN_BOTTOM
        }
        this.$data.$timeoutId = setTimeout(() => {
          this.resetData(month)
        }, this.transitionDuration)
      } else {
        this.resetData(month)
      }
    }
  }
}
</script>
