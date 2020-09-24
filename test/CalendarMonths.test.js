import { shallowMount } from '@vue/test-utils'
import { addYears, subYears, addDays } from 'date-fns'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarMonths from '../src/CalendarMonths'
import CalendarMonth from '../src/CalendarMonth'

describe('CalendarMonths.vue', () => {
  let wrapper = null
  const initialDate = new Date(2020, 2, 2)
  const requiedProps = {
    initialDate,
    locale: enGB
  }
  beforeEach(() => {
    wrapper = shallowMount(CalendarMonths, {
      propsData: requiedProps
    })
  })

  it('should render month accroding to the initialDate prop', async () => {
    await flushPromises()
    expect(wrapper.vm.months.length).toBe(20)
    expect(wrapper.find('.nice-dates-grid_container').element.children.length).toBe(20)
    expect(wrapper.vm.startDate).toEqual(new Date(2019, 8, 1))
    expect(wrapper.vm.endDate).toEqual(new Date(2021, 3, 1))
  })

  it('should add class names to the container when mounted', async () => {
    await flushPromises()
    const container = wrapper.find('.nice-dates-grid_container')
    expect(container.classes('-origin-top')).toBe(true)
  })

  it('should add styles to the container when mounted', async () => {
    await flushPromises()
    const container = wrapper.find('.nice-dates-grid_container')
    expect(container.element.style.transform).toBeTruthy()
    expect(container.element.style.transitionDuration).toBeTruthy()
  })

  describe('when the initialDate prop changed', () => {
    it('should do nothing if the new initialDate is equal to the old one', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'transitionToCurrentDate')
      wrapper.setMethods({ transitionToCurrentDate: spyFn })
      wrapper.setProps({
        initialDate: addDays(initialDate, 1)
      })
      await flushPromises()
      expect(spyFn).not.toHaveBeenCalled()
    })

    it('should call the transitionToCurrentDate() function', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'transitionToCurrentDate')
      wrapper.setMethods({ transitionToCurrentDate: spyFn })
      wrapper.setProps({
        initialDate: addYears(initialDate, 1)
      })
      await flushPromises()
      expect(spyFn).toHaveBeenCalled()
    })

    describe('when the difference between the new initialDate and the old is less than 3 years', () => {
      it('should call "generateMonths()" twice if the new initialDate is after the old', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'generateMonths')
        wrapper.setMethods({ generateMonths: spyFn })
        wrapper.setProps({
          initialDate: addYears(initialDate, 1)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalled()
        jest.runAllTimers()
        expect(spyFn).toHaveBeenCalledTimes(2)
      })

      it('should call "generateMonths()" twice if the new initialDate is before the old', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'generateMonths')
        wrapper.setMethods({ generateMonths: spyFn })
        wrapper.setProps({
          initialDate: subYears(initialDate, 1)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalled()
        jest.runAllTimers()
        expect(spyFn).toHaveBeenCalledTimes(2)
      })

      it('should generate new grid of months and add class names during transition', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'initMonths')
        wrapper.setMethods({ initMonths: spyFn })
        wrapper.setProps({
          initialDate: subYears(initialDate, 1)
        })
        await flushPromises()
        const container = wrapper.find('.nice-dates-grid_container')
        expect(container.classes('-transition')).toBe(true)
        expect(container.classes('-origin-bottom')).toBe(true)
        jest.runAllTimers()
        expect(spyFn).toHaveBeenCalledTimes(1)
        await flushPromises()
        expect(container.classes('-transition')).toBe(false)
      })
    })

    describe('when the difference between the new month and the old is more than 2 years', () => {
      it('should change the startDate and the endDate directly', async () => {
        const spyFn = jest.spyOn(wrapper.vm, 'initMonths')
        wrapper.setMethods({ initMonths: spyFn })
        wrapper.setProps({
          initialDate: subYears(initialDate, 3)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalledTimes(1)
      })
    })
  })

  it('should generate modifiers according to the modifiers prop', async () => {
    const mockFn = jest.fn()
    mockFn.mockReturnValue(true)
    wrapper.setProps({
      modifiers: {
        a: mockFn
      }
    })
    await flushPromises()
    expect(mockFn).toHaveBeenCalledTimes(20)
    const lastDate = subYears(initialDate, 1)
    expect(wrapper.vm.generateModifiers(lastDate)).toEqual({
      a: true,
      selected: false,
      outside: true,
      wide: false
    })
  })

  it('should emit events', async () => {
    const calendarDayWrapper = wrapper.find(CalendarMonth)
    calendarDayWrapper.trigger('click')
    calendarDayWrapper.trigger('mouseenter')
    calendarDayWrapper.trigger('touch')
    const containerWrapper = wrapper.find('.nice-dates-grid_container')
    containerWrapper.trigger('mouseleave')
    await flushPromises()
    expect(wrapper.emitted().clickDate.length).toBe(2)
    expect(wrapper.emitted().mouseEnterDate).toBeTruthy()
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()
  })
})
