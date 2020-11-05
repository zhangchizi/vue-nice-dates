import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import { GRID_DAY } from '../src/constants'
import DatePicker from '../src/DatePicker'
import DatePickerCalendar from '../src/DatePickerCalendar'

describe('DatePicker.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        date: '',
        locale: enGB
      }
    })
  })

  it('should render slot', async () => {
    const slot = '123'
    const wrapper = shallowMount(DatePicker, {
      propsData: {
        date: '',
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
    expect(wrapper.vm.validator).toEqual(expect.any(Function))
    expect(wrapper.vm.validator()).toBe(true)
  })

  it('should change the receivedDate to the date prop', async () => {
    const dateString = '02/02/2020'
    wrapper.setProps({
      date: dateString
    })
    await flushPromises()
    expect(wrapper.vm.receivedDate).toBe(dateString)
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

    it('should close popover if a day in the calendar is clicked and the type of grid is "day"', async () => {
      wrapper.setProps({
        isFocus: true
      })
      await flushPromises()
      const calendarWrapper = wrapper.find(DatePickerCalendar)
      calendarWrapper.vm.$emit('clickDate', new Date(), GRID_DAY)
      await flushPromises()
      expect(wrapper.vm.receivedIsFocus).toBe(false)
    })

    it('should close popover and emit event when clicked outside the container', async () => {
      const wrapper = shallowMount(DatePicker, {
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
      expect(wrapper.emitted()['update:date'][0]).toEqual([
        wrapper.vm.$data.$lastValidDate
      ])
      wrapper.destroy()
    })

    it('should not close popover when clicked inside the container', async () => {
      const wrapper = shallowMount(DatePicker, {
        propsData: {
          date: '',
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
      const wrapper = shallowMount(DatePicker, {
        propsData: {
          date: '',
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
      const wrapper = shallowMount(DatePicker, {
        propsData: {
          date: '',
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

  it('should save the last valid date', async () => {
    const calendarWrapper = wrapper.find(DatePickerCalendar)
    const dateString = '02/02/2020'
    calendarWrapper.vm.$emit('changeLastValidDate', dateString)
    await flushPromises()
    expect(wrapper.vm.$data.$lastValidDate).toBe(dateString)
  })
})
