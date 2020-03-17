<template>
  <div class="nice-dates-grid">
    <div
      ref="containerElementRef"
      class="nice-dates-grid_container"
    >
      <div
        v-for="item in monthsText"
        :key="item"
        class="nice-dates-month"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarMonths',
  props: {
    locale: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      monthsText: []
    }
  },
  created () {
    this.initMonths()
  },
  methods: {
    initMonths () {
      const { month } = this.locale.localize
      const arr = []
      for (let i = 0; i < 12; i++) {
        arr[i] = month(i)
      }
      this.monthsText = arr
    }
  }
}
</script>

<style lang="scss">
    .nice-dates-month{
        width: calc(100% / 4);
    }
</style>
