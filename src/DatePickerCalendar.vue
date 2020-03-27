<template>
  <Calendar
    :locale="locale"
    :date="receivedDate"
    :month="month"
    :minimum-date="minimumDate"
    :maximum-date="maximumDate"
    :modifiers="mergeModifiers()"
    :modifiers-class-names="modifiersClassNames"
    @clickDate="handleClickDate"
    @mouseEnterDate="handleMouseEnterDate"
    @mouseLeaveDates="handleMouseLeaveDates"
    @monthChange="handleMonthChange"
  />
</template>

<script>
import { parse, isSameDay, isValid, format, isEqual } from 'date-fns'
import { mergeModifiers, isSelectable, triggerBlurForTouchDevice } from './utils'
import Calendar from './Calendar'

export default {
  name: 'DatePickerCalendar',
  components: {
    Calendar
  },
  props: {
    locale: {
      required: true,
      type: Object
    },
    format: {
      type: String,
      default: 'dd/MM/yyyy'
    },
    date: {
      required: true,
      type: String
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
    },
    validator: {
      type: Function,
      default: () => {
        return true
      }
    }
  },
  data () {
    return {
      receivedDate: null
    }
  },
  watch: {
    date (newValue) {
      if (newValue === '') {
        this.receivedDate = newValue
        this.changeLastValidDate(newValue)
        return
      }
      const parsedDate = parse(newValue, this.format, new Date())
      const isValid = this.isValidAndSelectable(parsedDate)
      if (isValid) {
        if (this.receivedDate && isEqual(parsedDate, this.receivedDate)) return
        this.receivedDate = parsedDate
        this.changeLastValidDate(parsedDate)
      }
    }
  },
  created () {
    this.initDate()
  },
  methods: {
    initDate () {
      if (!this.date) {
        return
      }
      const parsedDate = parse(this.date, this.format, new Date())
      const isValid = this.isValidAndSelectable(parsedDate)
      if (isValid) {
        this.receivedDate = parsedDate
        this.changeLastValidDate(this.date)
      } else {
        this.$emit('update:date', '')
      }
    },
    isSelected (date) {
      if (!this.receivedDate) return false
      const options = { minimumDate: this.minimumDate, maximumDate: this.maximumDate }
      return isSameDay(date, this.receivedDate) && isSelectable(date, options)
    },
    isValidAndSelectable (date) {
      const options = { minimumDate: this.minimumDate, maximumDate: this.maximumDate }
      return isValid(date) && isSelectable(date, options) && this.validator(date)
    },
    mergeModifiers () {
      const baseModifiers = { selected: this.isSelected, disabled: this.isSelected }
      return mergeModifiers(baseModifiers, this.modifiers)
    },
    handleClickDate (date) {
      this.$emit('clickDate', date)
      const dateString = format(date, this.format, { locale: this.locale })
      this.$emit('update:date', dateString)
      triggerBlurForTouchDevice()
    },
    changeLastValidDate (date) {
      if (date instanceof Date) {
        date = format(date, this.format, { locale: this.locale })
      }
      this.$emit('changeLastValidDate', date)
    },
    handleMouseEnterDate (date) {
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates () {
      this.$emit('mouseLeaveDates')
    },
    handleMonthChange (month) {
      this.$emit('monthChange', month)
    }
  }
}
</script>
