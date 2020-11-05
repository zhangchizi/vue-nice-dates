<template>
  <div ref="containerRef" class="nice-dates">
    <slot></slot>
    <Popover :is-open="receivedIsFocus">
      <DateRangePickerCalendar
        :locale="locale"
        :start-date="receivedStartDate"
        :end-date="receivedEndDate"
        :initial-date="initialDate"
        :focus-name="receivedFocusName"
        :minimum-date="minimumDate"
        :maximum-date="maximumDate"
        :enable-grid-switch="enableGridSwitch"
        :modifiers="modifiers"
        :modifiers-class-names="modifiersClassNames"
        :validator="validator"
        @update:startDate="updateReceivedStartDate"
        @update:endDate="updateReceivedEndDate"
        @changeLastValidStartDate="changeLastValidStartDate"
        @changeLastValidEndDate="changeLastValidEndDate"
        @clickDate="handleClickDate"
      />
    </Popover>
  </div>
</template>
<script>
import { END_DATE, START_DATE, GRID_DAY } from './constants'
import { triggerBlurForTouchDevice } from '../src/utils'
import DateRangePickerCalendar from './DateRangePickerCalendar'
import Popover from './Popover'

const KEY_FOR_FOCUS = 'niceDates'

function camelcaseToDash(str) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

export default {
  name: 'DateRangePicker',
  components: {
    DateRangePickerCalendar,
    Popover
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
    initialDate: {
      type: Date,
      default: undefined
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    focusName: {
      type: String,
      default: START_DATE,
      validator(value) {
        return [START_DATE, END_DATE, ''].indexOf(value) > -1
      }
    },
    enableGridSwitch: {
      type: Boolean,
      default: false
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
    validator: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      receivedStartDate: this.startDate,
      receivedEndDate: this.endDate,
      receivedIsFocus: this.isFocus,
      receivedFocusName: this.focusName || START_DATE,
      $lastValidStartDate: this.startDate,
      $lastValidEndDate: this.endDate,
      $hasTouchedStartDate: false,
      $hasTouchedEndDate: false
    }
  },
  watch: {
    startDate(newValue) {
      this.receivedStartDate = newValue
    },
    endDate(newValue) {
      this.receivedEndDate = newValue
    },
    isFocus(newValue) {
      this.receivedIsFocus = newValue
    },
    receivedFocusName(newValue) {
      this.$emit('update:focusName', newValue)
    }
  },
  created() {
    if (this.receivedStartDate) {
      this.$data.$hasTouchedStartDate = true
    }
    if (this.receivedEndDate) {
      this.$data.$hasTouchedEndDate = true
    }
  },
  mounted() {
    document.addEventListener('mousedown', this.handleOutsideClick)
    document.addEventListener('focusin', this.handleFocusIn)
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleOutsideClick)
    document.removeEventListener('focusin', this.handleFocusIn)
  },
  methods: {
    handleClickDate(date, type) {
      if (type !== GRID_DAY && !this.date) return

      // Triggered after 'receivedStartDate' and 'receivedEndDate' updated.
      this.$nextTick(() => {
        if (this.receivedFocusName === START_DATE) {
          this.$data.$hasTouchedStartDate = true
          if (!this.receivedEndDate) {
            this.triggerFocusEvent(END_DATE)
            this.receivedFocusName = END_DATE
          }
        } else if (this.receivedFocusName === END_DATE) {
          this.$data.$hasTouchedEndDate = true
          if (!this.receivedStartDate) {
            this.triggerFocusEvent(START_DATE)
            this.receivedFocusName = START_DATE
          }
        }
        if (this.$data.$hasTouchedStartDate && this.$data.$hasTouchedEndDate) {
          this.receivedIsFocus = false
          triggerBlurForTouchDevice()
        }
      })
    },
    changeLastValidStartDate(dateString) {
      this.$data.$lastValidStartDate = dateString
    },
    changeLastValidEndDate(dateString) {
      this.$data.$lastValidEndDate = dateString
    },
    updateReceivedStartDate(dataString) {
      if (!dataString) {
        // update 'receivedStartDate' before 'handleClickDate()'
        this.receivedStartDate = dataString
        this.$data.$hasTouchedStartDate = false
      }
      this.$emit('update:startDate', dataString)
    },
    updateReceivedEndDate(dataString) {
      if (!dataString) {
        // update 'receivedStartDate' before 'handleClickDate()'
        this.receivedEndDate = dataString
        this.$data.$hasTouchedEndDate = false
      }
      this.$emit('update:endDate', dataString)
    },
    handleOutsideClick(e) {
      if (!this.receivedIsFocus) return
      this.$emit('update:startDate', this.$data.$lastValidStartDate)
      this.$emit('update:endDate', this.$data.$lastValidEndDate)
      const containerRef = this.$refs.containerRef
      if (!containerRef.contains(e.target)) {
        this.receivedIsFocus = false
      }
    },
    handleFocusIn(e) {
      const containerRef = this.$refs.containerRef
      if (containerRef.contains(e.target)) {
        this.receivedIsFocus = true
        this.receivedFocusName = e.target.dataset[KEY_FOR_FOCUS]
      }
    },
    triggerFocusEvent(receivedFocusName) {
      const containerRef = this.$refs.containerRef
      const inputElement = containerRef.querySelector(
        `[data-${camelcaseToDash(KEY_FOR_FOCUS)}="${receivedFocusName}"]`
      )
      inputElement && inputElement.focus()
    }
  }
}
</script>
