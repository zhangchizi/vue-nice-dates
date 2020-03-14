import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import Calendar from '../src/Calendar'
import CalendarGrid from '../src/CalendarGrid'
import CalendarNavigation from '../src/CalendarNavigation'

describe('Calendar.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(Calendar, {
      propsData: {
        locale: enGB
      }
    })
  })

  it('the receivedMonth has default value when created', async () => {
    expect(wrapper.vm.receivedMonth).toBeInstanceOf(Date)
  })

  describe('when the date prop changed', () => {
    it('should update the receivedMonth if the change is from the input', async () => {
      const newDate = new Date()
      wrapper.setProps({
        date: newDate
      })
      await flushPromises()
      expect(wrapper.vm.receivedMonth).toEqual(newDate)

      wrapper.setProps({
        date: ''
      })
      await flushPromises()
      expect(wrapper.vm.receivedMonth).toBeInstanceOf(Date)
    })

    it('should not update the receivedMonth if the change is from clicking a day in the calendar', async () => {
      const CalendarGridWrapper = wrapper.find(CalendarGrid)
      CalendarGridWrapper.vm.$emit('clickDate')
      const newDate = new Date()
      wrapper.setProps({
        date: newDate
      })
      await flushPromises()
      expect(wrapper.vm.receivedMonth).not.toEqual(newDate)
    })
  })

  describe('when the month prop changed', () => {
    it('should update the receivedMonth', async () => {
      const month = new Date(2020, 1, 1)
      wrapper.setProps({
        month
      })
      await flushPromises()
      expect(wrapper.vm.receivedMonth).toEqual(month)
    })
  })

  it('should merge "disabled" modifier', () => {
    expect(wrapper.vm.mergedModifiers.disabled).toBeTruthy()
    expect(wrapper.vm.mergedModifiers.disabled(new Date())).toBe(false)
  })

  it('should emit events', async () => {
    const CalendarGridWrapper = wrapper.find(CalendarGrid)
    const date = new Date()
    CalendarGridWrapper.vm.$emit('clickDate', date)
    CalendarGridWrapper.vm.$emit('mouseEnterDate', date)
    CalendarGridWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted().clickDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()

    const navigationWrapper = wrapper.find(CalendarNavigation)
    navigationWrapper.vm.$emit('monthChange', date)
    await flushPromises()
    expect(wrapper.emitted().monthChange[0]).toEqual([date])
  })
})
