import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import { START_DATE } from '../src/constants'
import DateRangePicker from '../src/DateRangePicker'
import DateRangePickerCalendar from '../src/DateRangePickerCalendar'

describe('DateRangePicker.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(DateRangePicker, {
      propsData: {
        locale: enGB
      }
    })
  })

  it('should render slot', async () => {
    const slot = '123'
    const wrapper = shallowMount(DateRangePicker, {
      propsData: {
        locale: enGB
      },
      slots: {
        default: slot
      }
    })
    await flushPromises()
    expect(wrapper.text()).toBe(slot)
  })

  it('props have default values', () => {
    expect(wrapper.vm.focusName).toBe(START_DATE)
    expect(wrapper.vm.validator).toEqual(expect.any(Function))
    expect(wrapper.vm.validator()).toBe(true)
  })

  it('has default data', async () => {
    wrapper.setProps({
      focusName: ''
    })
    await flushPromises()
    expect(wrapper.vm.receivedFocusName).toBe(START_DATE)
  })

  it('synchronize the values of the startDate and the receivedStartDate', async () => {
    const dataString = '02/02/2020'
    wrapper.setProps({
      startDate: dataString
    })
    await flushPromises()
    expect(wrapper.vm.receivedStartDate).toBe(dataString)
  })

  it('synchronize the values of the endDate and the receivedEndDate', async () => {
    const dataString = '02/02/2020'
    wrapper.setProps({
      endDate: dataString
    })
    await flushPromises()
    expect(wrapper.vm.receivedEndDate).toBe(dataString)
  })

  it('should save the status of whether the startDate or the endDate exists', async () => {
    const wrapper = shallowMount(DateRangePicker, {
      propsData: {
        startDate: '02/02/2020',
        endDate: '03/02/2020',
        locale: enGB
      }
    })
    await flushPromises()
    expect(wrapper.vm.$data.$hasTouchedStartDate).toBe(true)
    expect(wrapper.vm.$data.$hasTouchedEndDate).toBe(true)
  })

  describe('when to open popover or not', () => {
    it('should close popover when mounted', async () => {
      expect(wrapper.vm.receivedIsFocus).toBe(false)
    })

    it('should open popover if the isFocus prop is true', async () => {
      wrapper.setProps({
        isFocus: true
      })
      await flushPromises()
      expect(wrapper.vm.receivedIsFocus).toBe(true)
    })

    it('should close popover if the startDate and the endDate both exist ', async () => {
      wrapper.setProps({
        isFocus: true
      })
      const calendarWrapper = wrapper.find(DateRangePickerCalendar)
      calendarWrapper.vm.$emit('clickDate', new Date())
      await flushPromises()
      calendarWrapper.vm.$emit('clickDate', new Date())
      await flushPromises()
      expect(wrapper.vm.receivedIsFocus).toBe(false)
    })

    it('should close popover and emit event when clicked outside the container', async () => {
      const wrapper = shallowMount(DateRangePicker, {
        propsData: {
          date: '',
          isFocus: true,
          locale: enGB
        },
        attachToDocument: true
      })
      await flushPromises()
      document.dispatchEvent(new Event('mousedown'))
      expect(wrapper.vm.receivedIsFocus).toBe(false)
      expect(wrapper.emitted()['update:startDate'][0]).toEqual([wrapper.vm.$data.$lastValidStartDate])
      expect(wrapper.emitted()['update:endDate'][0]).toEqual([wrapper.vm.$data.$lastValidEndDate])
      wrapper.destroy()
    })

    it('should not close popover when clicked inside the container', async () => {
      const wrapper = shallowMount(DateRangePicker, {
        propsData: {
          isFocus: true,
          locale: enGB
        },
        attachToDocument: true
      })
      wrapper.trigger('mousedown')
      await flushPromises()
      expect(wrapper.vm.receivedIsFocus).toBe(true)
      wrapper.destroy()
    })

    it('should open popover when the input in the container focused', async () => {
      const wrapper = shallowMount(DateRangePicker, {
        propsData: {
          isFocus: false,
          locale: enGB
        },
        attachToDocument: true
      })
      wrapper.trigger('focusin')
      await flushPromises()
      expect(wrapper.vm.receivedIsFocus).toBe(true)
      wrapper.destroy()
    })

    it('should not open popover when the input outside the container focused', async () => {
      const wrapper = shallowMount(DateRangePicker, {
        propsData: {
          isFocus: false,
          locale: enGB
        },
        attachToDocument: true
      })
      document.dispatchEvent(new Event('focusin'))
      await flushPromises()
      expect(wrapper.vm.receivedIsFocus).toBe(false)
      wrapper.destroy()
    })
  })

  it('should clear the startDate if triggered update:startDate() with empty string argument ', async () => {
    wrapper.setProps({
      startDate: '02/02/2020'
    })
    await flushPromises()
    const calendarWrapper = wrapper.find(DateRangePickerCalendar)
    calendarWrapper.vm.$emit('update:startDate', '')
    await flushPromises()
    expect(wrapper.vm.receivedStartDate).toBe('')
    expect(wrapper.emitted()['update:startDate'][0]).toEqual([''])
  })

  it('should clear the endDate if triggered update:endDate() with empty string argument ', async () => {
    wrapper.setProps({
      endDate: '02/02/2020'
    })
    await flushPromises()
    const calendarWrapper = wrapper.find(DateRangePickerCalendar)
    calendarWrapper.vm.$emit('update:endDate', '')
    await flushPromises()
    expect(wrapper.vm.receivedEndDate).toBe('')
    expect(wrapper.emitted()['update:endDate'][0]).toEqual([''])
  })

  it('should save the last valid date', async () => {
    const calendarWrapper = wrapper.find(DateRangePickerCalendar)
    const dateString = '02/02/2020'
    calendarWrapper.vm.$emit('changeLastValidStartDate', dateString)
    calendarWrapper.vm.$emit('changeLastValidEndDate', dateString)
    await flushPromises()
    expect(wrapper.vm.$data.$lastValidStartDate).toBe(dateString)
    expect(wrapper.vm.$data.$lastValidEndDate).toBe(dateString)
  })

  it('should emit events', async () => {
    const calendarWrapper = wrapper.find(DateRangePickerCalendar)
    const date = new Date()
    calendarWrapper.vm.$emit('update:startDate', date)
    calendarWrapper.vm.$emit('update:endDate', date)
    calendarWrapper.vm.$emit('mouseEnterDate', date)
    calendarWrapper.vm.$emit('monthChange', date)
    calendarWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted()['update:startDate'][0]).toEqual([date])
    expect(wrapper.emitted()['update:endDate'][0]).toEqual([date])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().monthChange[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()
  })
})
