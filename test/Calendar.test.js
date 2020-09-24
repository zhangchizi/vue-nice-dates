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
        locale: enGB,
        initialDate: new Date()
      }
    })
  })

  it('the "receivedInitialDate" has default value when created', async () => {
    expect(wrapper.vm.receivedInitialDate).toBeInstanceOf(Date)
  })

  describe('when the "date" prop changed', () => {
    it('should update the "receivedInitialDate"', async () => {
      const newDate = new Date()
      wrapper.setProps({
        date: newDate
      })
      await flushPromises()
      expect(wrapper.vm.receivedInitialDate).toEqual(newDate)
    })
    it('"receivedInitalDate" should be a date even the data is an empty string', async () => {
      wrapper.setProps({
        date: ''
      })
      await flushPromises()
      expect(wrapper.vm.receivedInitialDate).toBeInstanceOf(Date)
    })
  })

  it('should merge "disabled" modifier', () => {
    expect(wrapper.vm.mergedModifiers.disabled).toBeTruthy()
    expect(wrapper.vm.mergedModifiers.disabled(new Date())).toBe(false)
  })

  it('"getGridType()" should work', () => {
    const getGridType = wrapper.vm.getGridType
    expect(getGridType('year')).toBe('month')
    expect(getGridType('month')).toBe('day')
    expect(getGridType('day', true)).toBe('month')
    expect(getGridType('month', true)).toBe('year')
    expect(getGridType('year', true)).toBe('year')
  })

  it('should call relative functions if the CalendarNavigation component emits events', async () => {
    const spyFn1 = jest.spyOn(wrapper.vm, 'handleClickTitle')
    const spyFn2 = jest.spyOn(wrapper.vm, 'handleNavigate')
    wrapper.setMethods({
      handleClickTitle: spyFn1,
      handleNavigate: spyFn2
    })
    const CalendarNavigationWapper = wrapper.find(CalendarNavigation)
    CalendarNavigationWapper.vm.$emit('clickTitle')
    CalendarNavigationWapper.vm.$emit('navigate')
    await flushPromises()
    expect(spyFn1).toHaveBeenCalled()
    expect(spyFn2).toHaveBeenCalled()
  })

  it('should emit events', async () => {
    const CalendarGridWrapper = wrapper.find(CalendarGrid)
    const date = new Date()
    const type = 'type'
    CalendarGridWrapper.vm.$emit('clickDate', date, type)
    CalendarGridWrapper.vm.$emit('mouseEnterDate', date)
    CalendarGridWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted().clickDate[0]).toEqual([date, type])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates).toBeTruthy()
  })
})
