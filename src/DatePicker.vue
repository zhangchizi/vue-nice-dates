<template>
  <div
    ref="containerRef"
    class="nice-dates"
  >
    <slot></slot>
    <Popover :is-open="receivedIsFocus">
      <DatePickerCalendar
        :locale="locale"
        :format="format"
        :date="receivedDate"
        :initial-date="initialDate"
        :minimum-date="minimumDate"
        :maximum-date="maximumDate"
        :enable-grid-switch="enableGridSwitch"
        :modifiers="modifiers"
        :modifiers-class-names="modifiersClassNames"
        :validator="validator"
        @changeLastValidDate="changeLastValidDate"
        @clickDate="handleClickDate"
      />
    </Popover>
  </div>
</template>
<script>
import { format } from 'date-fns'
import DatePickerCalendar from './DatePickerCalendar'
import Popover from './Popover'
import { triggerBlurForTouchDevice } from './utils'
import { GRID_DAY } from './constants'

export default {
  name: 'DatePicker',
  components: {
    DatePickerCalendar,
    Popover
  },
  props: {
    locale: {
      required: true,
      type: Object
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    date: {
      required: true,
      type: String
    },
    initialDate: {
      type: Date,
      default: undefined
    },
    format: {
      type: String,
      default: 'dd/MM/yyyy'
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
      receivedDate: this.date,
      receivedIsFocus: this.isFocus,
      $lastValidDate: this.date
    }
  },
  watch: {
    date (newValue) {
      this.receivedDate = newValue
    },
    isFocus (newValue) {
      this.receivedIsFocus = newValue
    }
  },
  mounted () {
    document.addEventListener('mousedown', this.handleOutsideClick)
    document.addEventListener('focusin', this.handleFocusIn)
  },
  beforeDestroy () {
    document.removeEventListener('mousedown', this.handleOutsideClick)
    document.removeEventListener('focusin', this.handleFocusIn)
  },
  methods: {
    handleClickDate (date, type) {
      const dateString = format(date, this.format, { locale: this.locale })
      if (type === GRID_DAY) {
        this.receivedIsFocus = false
        triggerBlurForTouchDevice()
      }
      if (type === GRID_DAY || this.date) {
        this.$emit('update:date', dateString)
      }
    },
    changeLastValidDate (dateString) {
      this.$data.$lastValidDate = dateString
    },
    handleOutsideClick (e) {
      if (!this.receivedIsFocus) return
      this.$emit('update:date', this.$data.$lastValidDate)
      const containerRef = this.$refs.containerRef
      if (!containerRef.contains(e.target)) {
        this.receivedIsFocus = false
      }
    },
    handleFocusIn (e) {
      if (this.receivedIsFocus) return
      const containerRef = this.$refs.containerRef
      if (containerRef.contains(e.target)) {
        this.receivedIsFocus = true
      }
    }
  }
}
</script>
