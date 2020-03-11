
const code = `
<template>
  <div>
    <DatePicker
      :date.sync="date"
      :locale="locale"
    >
      <input
        v-model.trim="date"
        type="text"
        :readonly="isReadOnly"
        placeholder="dd/mm/yyyy"
      >
    </DatePicker>
  </div>
</template>
<script>
import { enGB } from 'date-fns/locale'
import { DatePicker } from 'vue-nice-dates'

export default {
  name: 'DatePickerExample',
  components: {
    DatePicker
  },
  data () {
    return {
      date: '',
      locale: enGB,
      isReadOnly: 'ontouchstart' in window
    }
  }
}

</script>

`
export default code
