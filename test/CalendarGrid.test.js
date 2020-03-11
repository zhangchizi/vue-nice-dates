import { shallowMount } from '@vue/test-utils'
import { addMonths, subMonths, addDays, endOfDay } from 'date-fns'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarGrid from '../src/CalendarGrid'
import CalendarDay from '../src/CalendarDay'

describe('CalendarGrid.vue', () => {
  let wrapper = null
  const dateForTest = new Date(2020, 2, 2)
  const requiedProps = {
    date: dateForTest,
    month: dateForTest,
    locale: enGB
  }
  beforeEach(() => {
    wrapper = shallowMount(CalendarGrid, {
      propsData: requiedProps
    })
  })

  it('should render days accroding to the month prop', async () => {
    await flushPromises()
    expect(wrapper.vm.days.length).toBe(42)
    expect(wrapper.find('.nice-dates-grid_container').element.children.length).toBe(42)
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

  describe('when the month prop changed', () => {
    it('should do nothing if the new month is equal to the old one', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'transitionToCurrentMonth')
      wrapper.setMethods({ transitionToCurrentMonth: spyFn })
      wrapper.setProps({
        month: addDays(dateForTest, 1)
      })
      await flushPromises()
      expect(spyFn).not.toHaveBeenCalled()
    })

    it('should call transitionToCurrentMonth()', async () => {
      const spyFn = jest.spyOn(wrapper.vm, 'transitionToCurrentMonth')
      wrapper.setMethods({ transitionToCurrentMonth: spyFn })
      wrapper.setProps({
        month: addMonths(dateForTest, 1)
      })
      await flushPromises()
      expect(spyFn).toHaveBeenCalled()
    })

    describe('when the difference between the new month and the old is less than 3 months', () => {
      it('should change the endDate first if the new month is after the old', async () => {
        jest.useFakeTimers()
        wrapper.setProps({
          month: addMonths(dateForTest, 1)
        })
        await flushPromises()
        expect(wrapper.vm.startDate).toEqual(new Date(2020, 1, 24))
        expect(wrapper.vm.endDate).toEqual(endOfDay(new Date(2020, 4, 10)))
        jest.runAllTimers()
        expect(wrapper.vm.startDate).toEqual(new Date(2020, 2, 30))
        expect(wrapper.vm.endDate).toEqual(endOfDay(new Date(2020, 4, 10)))
      })

      it('should change the starDate first if the new month is before the old', async () => {
        jest.useFakeTimers()
        wrapper.setProps({
          month: subMonths(dateForTest, 1)
        })
        await flushPromises()
        expect(wrapper.vm.startDate).toEqual(new Date(2020, 0, 27))
        expect(wrapper.vm.endDate).toEqual(endOfDay(new Date(2020, 3, 5)))
        jest.runAllTimers()
        expect(wrapper.vm.startDate).toEqual(new Date(2020, 0, 27))
        expect(wrapper.vm.endDate).toEqual(endOfDay(new Date(2020, 2, 8)))
      })

      it('should add class names to the container', async () => {
        jest.useFakeTimers()
        const spyFn = jest.spyOn(wrapper.vm, 'resetData')
        wrapper.setMethods({ resetData: spyFn })
        wrapper.setProps({
          month: subMonths(dateForTest, 1)
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
        const spyFn = jest.spyOn(wrapper.vm, 'resetData')
        wrapper.setMethods({ resetData: spyFn })
        wrapper.setProps({
          month: subMonths(dateForTest, 3)
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
    const lastMonth = subMonths(dateForTest, 1)
    expect(wrapper.vm.generateModifiers(lastMonth)).toEqual({
      a: true,
      outside: true,
      wide: false
    })
  })

  it('should emit events', async () => {
    const calendarDayWrapper = wrapper.find(CalendarDay)
    calendarDayWrapper.trigger('click')
    calendarDayWrapper.trigger('mouseenter')
    calendarDayWrapper.trigger('touch')
    const containerWrapper = wrapper.find({ ref: 'containerElementRef' })
    containerWrapper.trigger('mouseleave')
    await flushPromises()
    expect(wrapper.emitted().clickDate.length).toBe(2)
    expect(wrapper.emitted().mouseEnterDate).toBeTruthy()
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()
  })
})
