<template>
  <div>
    <CalendarNavigation
      :locale="locale"
      :minimum-date="minimumDate"
      :maximum-date="maximumDate"
      :date="receivedInitialDate"
      :grid-type="gridType"
      @navigate="handleNavigate"
      @clickTitle="handleClickTitle"
    />

    <CalendarWeekHeader :locale="locale" :grid-type="gridType" />

    <CalendarGrid
      :locale="locale"
      :modifiers="mergedModifiers"
      :modifiers-class-names="modifiersClassNames"
      :date="date"
      :grid-type="gridType"
      :initial-date="receivedInitialDate"
      @clickDate="handleClickDate"
      @mouseEnterDate="handleMouseEnterDate"
      @mouseLeaveDates="handleMouseLeaveDates"
    />
  </div>
</template>

<script>
import { isSameDay, getYear, setYear, getDate, setDate } from 'date-fns'
import { isSelectable, mergeModifiers } from './utils'
import CalendarNavigation from './CalendarNavigation'
import CalendarWeekHeader from './CalendarWeekHeader'
import CalendarGrid from './CalendarGrid'
import { GRID_DAY, GRID_MONTH, GRID_YEAR } from './constants'

export default {
  name: 'Calendar',
  components: {
    CalendarNavigation,
    CalendarWeekHeader,
    CalendarGrid
  },
  props: {
    locale: {
      required: true,
      type: Object
    },
    date: {
      type: [Date, String],
      default: '',
      validator(value) {
        return value instanceof Date || value === ''
      }
    },
    initialDate: {
      type: Date,
      default: undefined
    },
    enableGridSwitch: {
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
      receivedInitialDate:
        this.date || this.initialDate || this.minimumDate || new Date(),
      gridType: GRID_DAY
    }
  },
  computed: {
    mergedModifiers() {
      const options = {
        minimumDate: this.minimumDate,
        maximumDate: this.maximumDate
      }
      return mergeModifiers(
        { disabled: date => !isSelectable(date, options) },
        this.modifiers
      )
    }
  },
  watch: {
    date(newValue, oldValue) {
      if (!newValue) {
        this.receivedInitialDate =
          this.initialDate || this.minimumDate || new Date()
        return
      }
      if (oldValue && isSameDay(newValue, oldValue)) return
      this.receivedInitialDate = newValue
    }
  },
  methods: {
    handleClickTitle() {
      if (!this.enableGridSwitch) {
        this.gridType = GRID_DAY
        return
      }
      this.gridType = this.getGridType(this.gridType, true)
    },
    handleNavigate(date) {
      this.receivedInitialDate = date
    },
    handleClickDate(date, type) {
      this.gridType = this.getGridType(type)
      let resolvedDate = date
      if (this.date instanceof Date) {
        if (type === GRID_MONTH) {
          resolvedDate = setDate(date, getDate(this.date))
        } else if (type === GRID_YEAR) {
          resolvedDate = setYear(this.date, getYear(date))
        }
      }
      this.receivedInitialDate = resolvedDate
      this.$emit('clickDate', resolvedDate, type)
    },
    handleMouseEnterDate(date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates() {
      this.$emit('mouseLeaveDates')
    },
    getGridType(type, isReverse) {
      switch (type) {
        case GRID_YEAR:
          return isReverse ? GRID_YEAR : GRID_MONTH
        case GRID_MONTH:
          return isReverse ? GRID_YEAR : GRID_DAY
        case GRID_DAY:
          return isReverse ? GRID_MONTH : GRID_DAY
        default:
          return GRID_DAY
      }
    }
  }
}
</script>
