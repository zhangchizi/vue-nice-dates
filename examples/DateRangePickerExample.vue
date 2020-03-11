<template>
  <div>
    <DateRangePicker
      :start-date.sync="startDate"
      :end-date.sync="endDate"
      :locale="locale"
    >
      <div class="date-range">
        <input
          v-model.trim="startDate"
          type="text"
          :data-nice-dates="START_DATE"
          :readonly="isReadOnly"
          placeholder="dd/mm/yyyy"
        >
        <span class="date-range_arrow"></span>
        <input
          v-model.trim="endDate"
          type="text"
          :data-nice-dates="END_DATE"
          :readonly="isReadOnly"
          placeholder="dd/mm/yyyy"
        >
      </div>
    </DateRangePicker>
  </div>
</template>
<script>
import { enGB } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from '../src'

export default {
  name: 'DateRangePickerExample',
  components: {
    DateRangePicker
  },
  data () {
    return {
      START_DATE,
      END_DATE,
      startDate: '',
      endDate: '',
      locale: enGB,
      isReadOnly: 'ontouchstart' in window
    }
  }
}

</script>
