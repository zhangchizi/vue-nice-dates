import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarGrid from '../src/CalendarGrid'
import CalendarDays from '../src/CalendarDays'
import {
  GRID_DAY,
  GRID_MONTH,
  TRANSITION_NAME_IN,
  TRANSITION_NAME_OUT
} from '../src/constants'

describe('CalendarGrid.vue', () => {
  let wrapper = null
  const requiedProps = {
    initialDate: new Date(),
    locale: enGB,
    gridType: GRID_DAY
  }
  beforeEach(() => {
    wrapper = shallowMount(CalendarGrid, {
      propsData: requiedProps
    })
  })

  it('set transition name according to the gridtype prop', async () => {
    wrapper.setProps({
      gridType: GRID_MONTH
    })
    await flushPromises()
    expect(wrapper.vm.transitionName).toBe(TRANSITION_NAME_IN)
    wrapper.setProps({
      gridType: GRID_DAY
    })
    await flushPromises()
    expect(wrapper.vm.transitionName).toBe(TRANSITION_NAME_OUT)
  })

  it('should emit events', async () => {
    const daysWrapper = wrapper.find(CalendarDays)
    const date = new Date()
    const type = 'type'
    daysWrapper.vm.$emit('clickDate', date, type)
    daysWrapper.vm.$emit('mouseEnterDate', date)
    daysWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted().clickDate[0]).toEqual([date, type])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates[0]).toBeTruthy()
  })
})
