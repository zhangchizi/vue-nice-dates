<template>
  <div
    ref="gridElementRef"
    class="nice-dates-grid"
    :style="styleObjectGrid"
  >
    <CalendarDays
      :locale="locale"
      :month="month"
      :cell-height="cellHeight"
      :is-wide="isWide"
      :modifiers="modifiers"
      :modifiers-class-names="modifiersClassNames"
      @clickDate="handleClickDate"
      @mouseEnterDate="handleMouseEnterDate"
      @mouseLeaveDates="handleMouseLeaveDates"
    />
  </div>
</template>
<script>

import CalendarDays from './CalendarDays'

const CELL_WIDTH_BREAKPOINT = 60

export default {
  name: 'CalendarGrid',
  components: {
    CalendarDays
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
    }
  },
  data () {
    return {
      cellHeight: 0,
      isWide: false
    }
  },
  computed: {
    styleObjectGrid () {
      return { height: this.cellHeight * 6 + 'px' }
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
        this.cellHeight = Math.round(cellWidth * 0.75)
        this.isWide = true
      } else {
        this.cellHeight = Math.round(cellWidth)
        this.isWide = false
      }
    },
    handleClickDate (date) {
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
