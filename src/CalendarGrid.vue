<template>
  <div
    ref="gridElementRef"
    class="nice-dates-grid"
    :style="styleObjectGrid"
  >
    <transition
      :name="transitionName"
      appear
      mode="out-in"
    >
      <keep-alive>
        <component
          :is="componentName"
          :locale="locale"
          :initial-date="initialDate"
          :date="date"
          :cell-height="cellHeight"
          :is-wide="isWide"
          :modifiers="modifiers"
          :modifiers-class-names="modifiersClassNames"
          @clickDate="handleClickDate"
          @mouseEnterDate="handleMouseEnterDate"
          @mouseLeaveDates="handleMouseLeaveDates"
        />
      </keep-alive>
    </transition>
  </div>
</template>
<script>

import CalendarDays from './CalendarDays'
import CalendarMonths from './CalendarMonths'
import CalendarYears from './CalendarYears'
import { GRID_DAY, GRID_MONTH, GRID_YEAR, TRANSITION_NAME_IN, TRANSITION_NAME_OUT } from './constants'

const CELL_WIDTH_BREAKPOINT = 60

export default {
  name: 'CalendarGrid',
  components: {
    CalendarDays,
    CalendarMonths,
    CalendarYears
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
    initialDate: {
      required: true,
      type: Date
    },
    gridType: {
      required: true,
      type: String
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
    }
  },
  data () {
    return {
      cellHeight: 0,
      isWide: false,
      transitionName: TRANSITION_NAME_IN
    }
  },
  computed: {
    styleObjectGrid () {
      return { height: this.cellHeight * 6 + 'px' }
    },
    componentName () {
      return `calendar-${this.gridType}s`
    }
  },
  watch: {
    gridType (newValue, oldValue) {
      const map = {
        [GRID_DAY]: 0,
        [GRID_MONTH]: 1,
        [GRID_YEAR]: 2
      }
      if (map[newValue] > map[oldValue]) {
        this.transitionName = TRANSITION_NAME_IN
      } else {
        this.transitionName = TRANSITION_NAME_OUT
      }
    }
  },
  mounted () {
    this.initCell()
    window.addEventListener('resize', this.initCell)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.initCell)
  },
  methods: {
    initCell () {
      const containerWidth = this.$refs.gridElementRef.offsetWidth
      const cellWidth = containerWidth / 7
      if (cellWidth > CELL_WIDTH_BREAKPOINT) {
        // 0.75 is Corrosponding to the style in the style.scss
        this.cellHeight = Math.round(cellWidth * 0.75)
        this.isWide = true
      } else {
        this.cellHeight = cellWidth
        this.isWide = false
      }
    },
    handleClickDate (date, type) {
      this.$emit('clickDate', date, type)
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
