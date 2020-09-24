<template>
  <Calendar
    :locale="locale"
    :date="receivedDate"
    :initial-date="initialDate"
    :enable-grid-switch="enableGridSwitch"
    :minimum-date="minimumDate"
    :maximum-date="maximumDate"
    :modifiers="modifiers"
    :modifiers-class-names="modifiersClassNames"
    @clickDate="handleClickDate"
  />
</template>

<script>
import { parse, isValid, format, isSameDay } from 'date-fns'
import { isSelectable } from './utils'
import Calendar from './Calendar'
import { GRID_DAY } from './constants'

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
        if (this.receivedDate && isSameDay(parsedDate, this.receivedDate)) return
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
    isValidAndSelectable (date) {
      const options = { minimumDate: this.minimumDate, maximumDate: this.maximumDate }
      return isValid(date) && isSelectable(date, options) && this.validator(date)
    },
    handleClickDate (date, type) {
      this.$emit('clickDate', date, type)
      const dateString = format(date, this.format, { locale: this.locale })
      // for Using this component independently
      if (type === GRID_DAY || this.date) {
        this.$emit('update:date', dateString)
      }
    },
    changeLastValidDate (date) {
      if (date instanceof Date) {
        date = format(date, this.format, { locale: this.locale })
      }
      this.$emit('changeLastValidDate', date)
    }
  }
}
</script>
