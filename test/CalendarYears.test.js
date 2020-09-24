import { shallowMount } from '@vue/test-utils'
import { subYears, addYears } from 'date-fns'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarYears from '../src/CalendarYears'
import CalendarYear from '../src/CalendarYear'

describe('CalendarYears.vue', () => {
  let wrapper = null
  const initialDate = new Date(2020, 2, 2)
  const requiedProps = {
    initialDate,
    locale: enGB,
    cellHeight: 20
  }
  beforeEach(() => {
    wrapper = shallowMount(CalendarYears, {
      propsData: requiedProps
    })
  })

  it('should render month accroding to the initialDate prop', async () => {
    await flushPromises()
    expect(wrapper.vm.years.length).toBe(20)
    expect(wrapper.find('.nice-dates-grid_container').element.children.length).toBe(20)
    expect(wrapper.vm.startDate).toEqual(new Date(2020, 0, 1))
    expect(wrapper.vm.endDate).toEqual(new Date(2039, 0, 1))
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
    it('should call the transitionToCurrentDate() function', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'transitionToCurrentDate')
      wrapper.setMethods({ transitionToCurrentDate: spyFn })
      wrapper.setProps({
        initialDate: addYears(initialDate, 1)
      })
      await flushPromises()
      expect(spyFn).toHaveBeenCalled()
    })

    describe('when the difference between the new initialDate and the old is less than 3 * 20 years', () => {
      it('should call "generateYears()" twice if the new initialDate is after the old', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'generateYears')
        wrapper.setMethods({ generateYears: spyFn })
        wrapper.setProps({
          initialDate: addYears(initialDate, 59)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalled()
        jest.runAllTimers()
        expect(spyFn).toHaveBeenCalledTimes(2)
      })

      it('should call "generateYears()" twice if the new initialDate is before the old', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'generateYears')
        wrapper.setMethods({ generateYears: spyFn })
        wrapper.setProps({
          initialDate: subYears(initialDate, 40)
        })
        await flushPromises()
        expect(spyFn).toHaveBeenCalled()
        jest.runAllTimers()
        await flushPromises()
        expect(spyFn).toHaveBeenCalledTimes(2)
      })

      it('should generate new grid of days and add class names during transition', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'initYears')
        wrapper.setMethods({ initYears: spyFn })
        wrapper.setProps({
          initialDate: subYears(initialDate, 20)
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

    describe('when the difference between the new month and the old is more than 3 * 20 years', () => {
      it('should change the startDate and the endDate directly', async () => {
        const spyFn = jest.spyOn(wrapper.vm, 'initYears')
        wrapper.setMethods({ initYears: spyFn })
        wrapper.setProps({
          initialDate: subYears(initialDate, 60)
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
    expect(mockFn).toHaveBeenCalledTimes(20)
    const lastDate = subYears(initialDate, 1)
    expect(wrapper.vm.generateModifiers(lastDate)).toEqual({
      a: true,
      outside: false,
      selected: false,
      wide: false
    })
  })

  it('should emit events', async () => {
    const calendarDayWrapper = wrapper.find(CalendarYear)
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
