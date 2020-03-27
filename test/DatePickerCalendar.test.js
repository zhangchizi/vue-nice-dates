import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import DatePickerCalendar from '../src/DatePickerCalendar'
import Calendar from '../src/Calendar'

describe('DatePickerCalendar.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(DatePickerCalendar, {
      propsData: {
        date: '',
        locale: enGB
      }
    })
  })

  it('props have default values', () => {
    expect(wrapper.vm.format).toBe('dd/MM/yyyy')
  })

  describe('when created', () => {
    it('should clear the date if it is invalid', async () => {
      const wrapper = shallowMount(DatePickerCalendar, {
        propsData: {
          locale: enGB,
          date: '2020-2-2'
        }
      })
      await flushPromises()
      expect(wrapper.emitted()['update:date'][0]).toEqual([''])
    })

    it('should save the parsed date if it is valid', async () => {
      const wrapper = shallowMount(DatePickerCalendar, {
        propsData: {
          locale: enGB,
          date: '02/02/2020'
        }
      })
      await flushPromises()
      expect(wrapper.vm.receivedDate).toEqual(new Date(2020, 1, 2))
    })
  })

  describe('when the date prop changed', () => {
    it('should validate the date if the date exists', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'isValidAndSelectable')
      wrapper.setMethods({
        isValidAndSelectable: spyFn
      })
      wrapper.setProps({
        date: '02/02/2020'
      })
      await flushPromises()
      expect(spyFn.mock.results[0].value).toBe(true)
      wrapper.setProps({
        date: '2020/02/02'
      })
      await flushPromises()
      expect(spyFn.mock.results[1].value).toBe(false)
    })

    it('should emit the changeLastValidDate event if the date is valid', async () => {
      const dateString = '02/02/2020'
      wrapper.setProps({
        date: dateString
      })
      await flushPromises()
      expect(wrapper.emitted().changeLastValidDate[0]).toEqual([dateString])
      wrapper.setProps({
        date: ''
      })
      await flushPromises()
      expect(wrapper.emitted().changeLastValidDate[1]).toEqual([''])
    })

    it('should not emit "changeLastValidDate" event if the date is invalid ', async () => {
      wrapper.setProps({
        date: '2020/02/02'
      })
      await flushPromises()
      expect(wrapper.emitted().changeLastValidDate).toBeFalsy()
    })

    it('can use custom validator to validate the date prop', async () => {
      const mockFn = jest.fn()
      mockFn.mockReturnValue(false)
      wrapper.setProps({
        validator: mockFn,
        date: '02/02/2020'
      })
      await flushPromises()
      expect(mockFn).toHaveBeenCalled()
      expect(wrapper.emitted().changeLastValidDate).toBeFalsy()
    })
  })

  it('isSelected() determines whether a date has been seleted', async () => {
    expect(wrapper.vm.isSelected()).toBe(false)
    wrapper.setProps({
      date: '02/02/2020'
    })
    await flushPromises()
    expect(wrapper.vm.isSelected(new Date(2020, 1, 2))).toBe(true)
  })

  it('should merge "selected" and "disabled" modifiers', () => {
    expect(wrapper.vm.mergeModifiers().selected).toBeTruthy()
    expect(wrapper.vm.mergeModifiers().disabled).toBeTruthy()
  })

  it('should emit events', async () => {
    const calendarWrapper = wrapper.find(Calendar)
    const date = new Date()
    calendarWrapper.vm.$emit('clickDate', date)
    calendarWrapper.vm.$emit('mouseEnterDate', date)
    calendarWrapper.vm.$emit('monthChange', date)
    calendarWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted()['update:date']).toBeTruthy()
    expect(wrapper.emitted().clickDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().monthChange[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()
  })
})
