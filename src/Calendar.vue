<template>
  <div>
    <CalendarNavigation
      :locale="locale"
      :minimum-date="minimumDate"
      :maximum-date="maximumDate"
      :month="receivedMonth"
      @monthChange="handleMonthChange"
    />

    <CalendarWeekHeader :locale="locale" />

    <CalendarGrid
      :locale="locale"
      :modifiers="mergedModifiers"
      :modifiers-class-names="modifiersClassNames"
      :month="receivedMonth"
      @clickDate="handleClickDate"
      @mouseEnterDate="handleMouseEnterDate"
      @mouseLeaveDates="handleMouseLeaveDates"
    />
  </div>
</template>

<script>
import { isSelectable, mergeModifiers } from './utils'
import CalendarNavigation from './CalendarNavigation'
import CalendarWeekHeader from './CalendarWeekHeader'
import CalendarGrid from './CalendarGrid'

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
      validator (value) {
        return value instanceof Date || value === ''
      }
    },
    month: {
      type: Date,
      default: undefined
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
    minimumDate: {
      type: Date,
      default: null
    },
    maximumDate: {
      type: Date,
      default: null
    }
  },
  data () {
    return {
      receivedMonth: this.date || this.month || this.minimumDate || new Date(),
      $isChangedFromInput: true
    }
  },
  computed: {
    mergedModifiers () {
      const options = { minimumDate: this.minimumDate, maximumDate: this.maximumDate }
      return mergeModifiers(
        { disabled: date => !isSelectable(date, options) },
        this.modifiers
      )
    }
  },
  watch: {
    date (newValue) {
      if (this.$data.$isChangedFromInput) {
        if (!newValue) {
          this.receivedMonth = this.month || this.minimumDate || new Date()
          return
        }
        this.receivedMonth = newValue
      }
      this.$data.$isChangedFromInput = true
    },
    month (newValue) {
      this.receivedMonth = newValue
    }
  },
  methods: {
    handleMonthChange (month) {
      this.receivedMonth = month
      this.$emit('monthChange', month)
    },
    handleClickDate (date) {
      this.$data.$isChangedFromInput = false
      this.$emit('clickDate', date)
    },
    handleMouseEnterDate (date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates () {
      this.$emit('mouseLeaveDates')
    }
  }
}
</script>
