<template>
  <div>
    <p>US English:</p>
    <DatePicker :locale="langEnUS" :date.sync="date1">
      <input
        v-model="date1"
        type="text"
        placeholder="dd/mm/yyyy"
        :readonly="isReadonly"
      />
    </DatePicker>
    <p>Spanish:</p>
    <DatePicker :locale="langEs" :date.sync="date2">
      <input
        v-model="date2"
        type="text"
        placeholder="dd/mm/yyyy"
        :readonly="isReadonly"
      />
    </DatePicker>
  </div>
</template>

<script>
import { enUS, es } from 'date-fns/locale'
import { DatePicker } from '../src'

export default {
  name: 'LocalesExample',
  components: {
    DatePicker
  },
  data() {
    return {
      langEnUS: enUS,
      langEs: es,
      date1: '',
      date2: '',
      isReadonly: 'ontouchstart' in window
    }
  }
}
</script>
