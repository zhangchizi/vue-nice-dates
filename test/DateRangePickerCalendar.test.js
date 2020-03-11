import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import { START_DATE, END_DATE } from '../src/constants'
import DateRangePickerCalendar from '../src/DateRangePickerCalendar'
import Calendar from '../src/Calendar'

describe('DateRangePickerCalendar.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(DateRangePickerCalendar, {
      propsData: {
        locale: enGB
      }
    })
  })
  it('props have default values', () => {
    expect(wrapper.vm.format).toBe('dd/MM/yyyy')
    expect(wrapper.vm.focusName).toBe(START_DATE)
  })

  describe('when a day in the the calendar was clicked', () => {
    it('should clear the endDate if the startDate is after it', async () => {
      wrapper.setProps({
        endDate: '02/02/2020'
      })
      await flushPromises()
      const calendarWrapper = wrapper.find(Calendar)
      calendarWrapper.vm.$emit('clickDate', new Date(2020, 3, 3))
      await flushPromises()
      expect(wrapper.emitted()['update:endDate'][0]).toEqual([''])
      expect(wrapper.emitted()['update:startDate'][0]).toEqual(['03/04/2020'])
    })

    it('should clear the startDate if the endDate is before it', async () => {
      wrapper.setProps({
        startDate: '02/02/2020',
        focusName: END_DATE
      })
      await flushPromises()
      const calendarWrapper = wrapper.find(Calendar)
      calendarWrapper.vm.$emit('clickDate', new Date(2020, 1, 1))
      await flushPromises()
      expect(wrapper.emitted()['update:startDate'][0]).toEqual([''])
      expect(wrapper.emitted()['update:endDate'][0]).toEqual(['01/02/2020'])
    })
  })

  describe('when the startDate and the endDate props changed', () => {
    it('should validate the startDate and the endDate if they exist', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'isValidAndSelectable')
      wrapper.setMethods({
        isValidAndSelectable: spyFn
      })
      wrapper.setProps({
        startDate: '02/02/2020',
        endDate: '2020/03/02'
      })
      await flushPromises()
      expect(spyFn.mock.results[0].value).toBe(true)
      expect(spyFn.mock.results[1].value).toBe(false)
    })

    it('should emit events if the new startDate or the new endDate is empty string', async () => {
      wrapper.setProps({
        startDate: '02/02/2020',
        endDate: '2020/03/02'
      })
      await flushPromises()
      wrapper.setProps({
        startDate: '',
        endDate: ''
      })
      await flushPromises()
      expect(wrapper.emitted()['update:startDate'][0]).toEqual([''])
      expect(wrapper.emitted()['update:endDate'][0]).toEqual([''])
    })

    it('should save the values if the startDate or the endDate is valid', async () => {
      const startDate = '02/02/2020'
      const endDate = '03/02/2020'
      wrapper.setProps({
        startDate,
        endDate
      })
      await flushPromises()
      expect(wrapper.emitted().changeLastValidStartDate[0]).toEqual([startDate])
      expect(wrapper.emitted().changeLastValidEndDate[0]).toEqual([endDate])

      wrapper.setProps({
        startDate: '',
        endDate: ''
      })
      await flushPromises()
      expect(wrapper.emitted().changeLastValidStartDate[1]).toEqual([''])
      expect(wrapper.emitted().changeLastValidEndDate[1]).toEqual([''])
    })

    it('should not emit event if the startDate or the startDate is invalid ', async () => {
      wrapper.setProps({
        startDate: '2020/02/02',
        endDate: '2020/03/02'
      })
      await flushPromises()
      expect(wrapper.emitted().changeLastValidStartDate).toBeFalsy()
      expect(wrapper.emitted().changeLastValidEndDate).toBeFalsy()
    })

    it('should clear the startDate if the new endDate is before the startDate', async () => {
      wrapper.setProps({
        startDate: '02/02/2020',
        endDate: '03/03/2020'
      })
      await flushPromises()
      wrapper.setProps({
        endDate: '01/01/2020'
      })
      await flushPromises()
      expect(wrapper.emitted()['update:startDate'][0]).toEqual([''])
      expect(wrapper.emitted().changeLastValidStartDate[1]).toEqual([''])
    })

    it('should clear the endDate if the new startDate is after the endDate', async () => {
      wrapper.setProps({
        startDate: '02/02/2020',
        endDate: '03/03/2020'
      })
      await flushPromises()
      wrapper.setProps({
        startDate: '04/04/2020'
      })
      await flushPromises()
      expect(wrapper.emitted()['update:endDate'][0]).toEqual([''])
      expect(wrapper.emitted().changeLastValidEndDate[1]).toEqual([''])
    })

    it('can use custom validator to validate the startDate and the endDate props', async () => {
      const mockFn = jest.fn()
      mockFn.mockReturnValueOnce(false)
        .mockReturnValue(true)
      wrapper.setProps({
        validator: mockFn,
        startDate: '02/02/2020',
        endDate: '03/02/2020'
      })
      await flushPromises()
      expect(mockFn).toHaveBeenCalled()
      expect(wrapper.emitted().changeLastValidStartDate).toBeFalsy()
      expect(wrapper.emitted().changeLastValidEndDate).toBeTruthy()
    })
  })

  describe('methods', () => {
    describe('when call the isStartDate() method', () => {
      it('should return false if the startDate or the endDate does not exist', async () => {
        expect(wrapper.vm.isStartDate(new Date())).toBe(false)
        wrapper.setProps({
          startDate: '02/02/2020'
        })
        await flushPromises()
        expect(wrapper.vm.isStartDate(new Date())).toBe(false)
      })

      it('should return true if the date is equal to the startDate', async () => {
        wrapper.setProps({
          startDate: '02/02/2020',
          endDate: '03/03/2020'
        })
        await flushPromises()
        expect(wrapper.vm.isStartDate(new Date(2020, 1, 2))).toBe(true)
        expect(wrapper.vm.isStartDate(new Date(2020, 2, 3))).toBe(false)
      })
    })

    describe('when call the isMiddleDate() method', () => {
      it('should return false if the startDate or the endDate does not exist', async () => {
        expect(wrapper.vm.isMiddleDate(new Date())).toBe(false)
        wrapper.setProps({
          startDate: '02/02/2020'
        })
        await flushPromises()
        expect(wrapper.vm.isMiddleDate(new Date())).toBe(false)
      })

      it('should return true if the date is between the startDate and the endDate', async () => {
        wrapper.setProps({
          startDate: '02/02/2020',
          endDate: '03/03/2020'
        })
        await flushPromises()
        expect(wrapper.vm.isMiddleDate(new Date(2020, 2, 2))).toBe(true)
        expect(wrapper.vm.isMiddleDate(new Date(2020, 3, 3))).toBe(false)
      })
    })

    describe('when call the isEndDate() method', () => {
      it('should return false if the startDate or the endDate does not exist', async () => {
        expect(wrapper.vm.isEndDate(new Date())).toBe(false)
        wrapper.setProps({
          startDate: '02/02/2020'
        })
        await flushPromises()
        expect(wrapper.vm.isEndDate(new Date())).toBe(false)
      })

      it('should return true if the date is between the startDate and the endDate', async () => {
        wrapper.setProps({
          startDate: '02/02/2020',
          endDate: '03/03/2020'
        })
        await flushPromises()
        expect(wrapper.vm.isEndDate(new Date(2020, 2, 3))).toBe(true)
        expect(wrapper.vm.isEndDate(new Date(2020, 1, 2))).toBe(false)
      })
    })
  })

  describe('merged modifiers', () => {
    describe('the selected() modifier', () => {
      it('should return true if the date satisfies the isStartDate(), isMiddleDate(), isEndDate()', async () => {
        wrapper.setProps({
          startDate: '02/02/2020',
          endDate: '03/03/2020'
        })
        const modifiers = wrapper.vm.mergeModifiers()
        await flushPromises()
        expect(modifiers.selected(new Date(2020, 1, 2))).toBe(true)
        expect(modifiers.selected(new Date(2020, 1, 3))).toBe(true)
        expect(modifiers.selected(new Date(2020, 2, 3))).toBe(true)
      })

      it('should return true if the date is equal to the startDate when the endDate does not exist', async () => {
        wrapper.setProps({
          startDate: '02/02/2020'
        })
        const modifiers = wrapper.vm.mergeModifiers()
        await flushPromises()
        expect(modifiers.selected(new Date(2020, 1, 2))).toBe(true)
      })

      it('should return true if the date is equal to the endDate when the startDate does not exist', async () => {
        wrapper.setProps({
          endDate: '03/03/2020'
        })
        const modifiers = wrapper.vm.mergeModifiers()
        await flushPromises()
        expect(modifiers.selected(new Date(2020, 2, 3))).toBe(true)
      })
    })

    describe('the disabled() modifier', () => {
      it('should return true if the date is equal to the startDate when to choose the endDate', async () => {
        wrapper.setProps({
          startDate: '02/02/2020',
          endDate: '03/03/2020',
          focusName: END_DATE
        })
        const modifiers = wrapper.vm.mergeModifiers()
        await flushPromises()
        expect(modifiers.disabled(new Date(2020, 1, 2))).toBe(true)
      })

      it('should return true if the date is equal to the endDate when to choose the startDate', async () => {
        wrapper.setProps({
          startDate: '02/02/2020',
          endDate: '03/03/2020'
        })
        const modifiers = wrapper.vm.mergeModifiers()
        await flushPromises()
        expect(modifiers.disabled(new Date(2020, 2, 3))).toBe(true)
      })
    })
  })

  it('should reset the hoveredDate when the mouse leaved the container', async () => {
    const calendarWrapper = wrapper.find(Calendar)
    const date = new Date()
    calendarWrapper.vm.$emit('mouseEnterDate', date)
    await flushPromises()
    expect(wrapper.vm.hoveredDate).toEqual(date)
    calendarWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.vm.hoveredDate).toBeNull()
  })

  it('should emit events', async () => {
    const calendarWrapper = wrapper.find(Calendar)
    const date = new Date()
    calendarWrapper.vm.$emit('clickDate', date)
    calendarWrapper.vm.$emit('mouseEnterDate', date)
    calendarWrapper.vm.$emit('monthChange', date)
    calendarWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted().clickDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().monthChange[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()
  })
})
