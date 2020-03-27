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
import { isSameDay, isAfter, isBefore, parse, isValid, isEqual, format } from 'date-fns'
import { mergeModifiers, isSelectable } from './utils'
import { START_DATE, END_DATE } from './constants'
import Calendar from './Calendar'

export default {
  name: 'DateRangePickerCalendar',
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
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    month: {
      type: Date,
      default: undefined
    },
    focusName: {
      type: String,
      default: START_DATE,
      validator (value) {
        return [START_DATE, END_DATE].indexOf(value) > -1
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
    validator: {
      type: Function,
      default: () => true
    }
  },
  data () {
    return {
      receivedStartDate: null,
      receivedEndDate: null,
      hoveredDate: null
    }
  },
  computed: {
    displayedStartDate () {
      return this.focusName === START_DATE &&
      !this.receivedStartDate &&
      this.receivedEndDate &&
      this.hoveredDate &&
      !isSameDay(this.hoveredDate, this.receivedEndDate)
        ? this.hoveredDate
        : this.receivedStartDate
    },
    displayedEndDate () {
      return this.focusName === END_DATE &&
      !this.receivedEndDate &&
      this.receivedStartDate &&
      this.hoveredDate &&
      !isSameDay(this.hoveredDate, this.receivedStartDate)
        ? this.hoveredDate
        : this.receivedEndDate
    },
    receivedDate () {
      if (this.receivedStartDate && !this.receivedEndDate) {
        return this.receivedStartDate
      } else if (!this.receivedStartDate && this.receivedEndDate) {
        return this.receivedEndDate
      }
      if (this.focusName === START_DATE) {
        return this.receivedStartDate
      }
      return this.receivedEndDate
    }
  },
  watch: {
    startDate (newValue) {
      if (newValue === '') {
        this.receivedStartDate = newValue
        this.$emit('update:startDate', newValue)
        this.changeLastValidDate('StartDate', newValue)
        return
      }
      const parsedDate = parse(newValue, this.format, new Date())
      const isValid = this.isValidAndSelectable(parsedDate)
      if (isValid) {
        if (this.receivedStartDate && isEqual(parsedDate, this.receivedStartDate)) return
        if (this.receivedEndDate && isAfter(parsedDate, this.receivedEndDate)) {
          this.$emit('update:endDate', '')
          this.changeLastValidDate('EndDate', '')
        }
        this.receivedStartDate = parsedDate
        this.changeLastValidDate('StartDate', parsedDate)
      }
    },
    endDate (newValue) {
      if (newValue === '') {
        this.receivedEndDate = newValue
        this.$emit('update:endDate', newValue)
        this.changeLastValidDate('EndDate', newValue)
        return
      }
      const parsedDate = parse(newValue, this.format, new Date())
      const isValid = this.isValidAndSelectable(parsedDate)
      if (isValid) {
        if (this.receivedEndDate && isEqual(parsedDate, this.receivedEndDate)) return
        if (this.receivedStartDate && isBefore(parsedDate, this.receivedStartDate)) {
          this.$emit('update:startDate', '')
          this.changeLastValidDate('StartDate', '')
        }
        this.receivedEndDate = parsedDate
        this.changeLastValidDate('EndDate', parsedDate)
      }
    }
  },
  created () {
    this.initStartDate()
    this.initEndDate()
    this.processInitalDate()
  },
  methods: {
    initStartDate () {
      if (this.startDate) {
        const parsedDate = parse(this.startDate, this.format, new Date())
        const isValid = this.isValidAndSelectable(parsedDate)
        if (isValid) {
          this.receivedStartDate = parsedDate
          this.changeLastValidDate('StartDate', this.startDate)
        } else {
          this.$emit('update:startDate', '')
        }
      }
    },
    initEndDate () {
      if (this.endDate) {
        const parsedDate = parse(this.endDate, this.format, new Date())
        const isValid = this.isValidAndSelectable(parsedDate)
        if (isValid) {
          this.receivedEndDate = parsedDate
          this.changeLastValidDate('EndDate', this.endDate)
        } else {
          this.$emit('update:endDate', '')
        }
      }
    },
    processInitalDate () {
      if (this.receivedEndDate && this.receivedStartDate) {
        if (!isAfter(this.receivedEndDate, this.receivedStartDate)) {
          this.$emit('update:endDate', '')
        }
      }
    },
    handleClickDate (date) {
      this.$emit('clickDate', date)
      if (this.focusName === START_DATE) {
        if (this.receivedEndDate && !isAfter(this.receivedEndDate, date)) {
          this.$emit('update:endDate', '')
        }
        // For using this component independently
        const dateString = format(date, this.format, { locale: this.locale })
        this.$emit('update:startDate', dateString)
      } else if (this.focusName === END_DATE) {
        const invalidStartDate = this.receivedStartDate && !isBefore(this.receivedStartDate, date)

        if (invalidStartDate) {
          this.$emit('update:startDate', '')
        }
        // For using this component independently
        const dateString = format(date, this.format, { locale: this.locale })
        this.$emit('update:endDate', dateString)
      }
    },
    handleMouseEnterDate (date) {
      this.hoveredDate = date
      this.$emit('mouseEnterDate', date)
    },
    handleMouseLeaveDates () {
      this.hoveredDate = null
      this.$emit('mouseLeaveDates')
    },
    handleMonthChange (month) {
      this.$emit('monthChange', month)
    },
    changeLastValidDate (name, date) {
      if (date instanceof Date) {
        date = format(date, this.format, { locale: this.locale })
      }
      this.$emit(`changeLastValid${name}`, date)
    },
    isStartDate (date) {
      if (!this.displayedStartDate || !this.displayedEndDate) return false
      return isSameDay(date, this.displayedStartDate) && isBefore(date, this.displayedEndDate)
    },
    isMiddleDate (date) {
      if (!this.displayedStartDate || !this.displayedEndDate) return false
      return isAfter(date, this.displayedStartDate) && isBefore(date, this.displayedEndDate)
    },
    isEndDate (date) {
      if (!this.displayedStartDate || !this.displayedEndDate) return false
      return isSameDay(date, this.displayedEndDate) && isAfter(date, this.displayedStartDate)
    },
    mergeModifiers () {
      const options = { minimumDate: this.minimumDate, maximumDate: this.maximumDate }
      const isSelected = date =>
        isSelectable(date, options) &&
              (
                this.isStartDate(date) ||
                this.isMiddleDate(date) ||
                this.isEndDate(date) ||
                (!!this.receivedStartDate && isSameDay(date, this.receivedStartDate)) ||
                (!!this.receivedEndDate && isSameDay(date, this.receivedEndDate))
              )
      const isDisabled = date => (this.focusName === START_DATE && this.isEndDate(date)) ||
              (this.focusName === END_DATE && this.isStartDate(date))
      return mergeModifiers(
        {
          selected: isSelected,
          selectedStart: this.isStartDate,
          selectedMiddle: this.isMiddleDate,
          selectedEnd: this.isEndDate,
          disabled: isDisabled
        },
        this.modifiers
      )
    },
    isValidAndSelectable (date) {
      const options = { minimumDate: this.minimumDate, maximumDate: this.maximumDate }
      return isValid(date) && isSelectable(date, options) && this.validator(date)
    }
  }
}
</script>
