import { shallowMount } from '@vue/test-utils'
import { addMonths, subMonths, addDays, endOfDay } from 'date-fns'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarDays from '../src/CalendarDays'
import CalendarDay from '../src/CalendarDay'

describe('CalendarDays.vue', () => {
  let wrapper = null
  const initialDate = new Date(2020, 2, 2)
  const requiedProps = {
    initialDate,
    locale: enGB
  }
  beforeEach(() => {
    wrapper = shallowMount(CalendarDays, {
      propsData: requiedProps
    })
  })

  it('should render days accroding to the initialDate prop', async () => {
    await flushPromises()
    expect(wrapper.vm.days.length).toBe(42)
    expect(
      wrapper.find('.nice-dates-grid_container').element.children.length
    ).toBe(42)
    expect(wrapper.vm.startDate).toEqual(new Date(2020, 1, 24))
    expect(wrapper.vm.endDate).toEqual(endOfDay(new Date(2020, 3, 5)))
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
        initialDate: addMonths(initialDate, 1)
      })
      await flushPromises()
      expect(spyFn).toHaveBeenCalled()
    })

    describe('when the difference between the new initialDate and the old is less than 3 months', () => {
      it('should call "generateDays()" twice if the new initialDate is after the old', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'generateDays')
        wrapper.setMethods({ generateDays: spyFn })
        wrapper.setProps({
          initialDate: addMonths(initialDate, 1)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalled()
        jest.runAllTimers()
        expect(spyFn).toHaveBeenCalledTimes(2)
      })

      it('should call "generateDays()" twice if the new initialDate is before the old', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'generateDays')
        wrapper.setMethods({ generateDays: spyFn })
        wrapper.setProps({
          initialDate: subMonths(initialDate, 1)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalled()
        jest.runAllTimers()
        expect(spyFn).toHaveBeenCalledTimes(2)
      })

      it('should generate new grid of days and add class names during transition', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'initDates')
        wrapper.setMethods({ initDates: spyFn })
        wrapper.setMethods({ initDates: spyFn })
        wrapper.setProps({
          initialDate: subMonths(initialDate, 1)
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

    describe('when the difference between the new month and the old is more than 2 months', () => {
      it('should change the startDate and the endDate directly', async () => {
        const spyFn = jest.spyOn(wrapper.vm, 'initDates')
        wrapper.setMethods({ initDates: spyFn })
        wrapper.setProps({
          initialDate: subMonths(initialDate, 3)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalledTimes(1)
      })
    })
  })

  it('should generate modifiers according to the modifiers prop', async () => {
    const mockFn = jest.fn()
    mockFn.mockReturnValue(true)
    const modifiers = {
      a: mockFn
    }
    wrapper.setProps({
      modifiers
    })
    await flushPromises()
    expect(mockFn).toHaveBeenCalledTimes(42)
    const lastDate = subMonths(initialDate, 1)
    expect(wrapper.vm.generateModifiers(lastDate)).toEqual({
      a: true,
      outside: true,
      selected: false,
      wide: false
    })
  })

  it('should emit events', async () => {
    const calendarDayWrapper = wrapper.find(CalendarDay)
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
