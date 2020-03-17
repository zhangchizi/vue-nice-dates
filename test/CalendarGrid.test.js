import { shallowMount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarGrid from '../src/CalendarGrid'
import CalendarDays from '../src/CalendarDays'

describe('CalendarGrid.vue', () => {
  let wrapper = null
  const requiedProps = {
    month: new Date(),
    locale: enGB
  }
  beforeEach(() => {
    wrapper = shallowMount(CalendarGrid, {
      propsData: requiedProps
    })
  })

  it('should emit events', async () => {
    const daysWrapper = wrapper.find(CalendarDays)
    const date = new Date()
    daysWrapper.vm.$emit('clickDate', date)
    daysWrapper.vm.$emit('mouseEnterDate', date)
    daysWrapper.vm.$emit('mouseLeaveDates')
    await flushPromises()
    expect(wrapper.emitted().clickDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseEnterDate[0]).toEqual([date])
    expect(wrapper.emitted().mouseLeaveDates[0]).toBeTruthy()
  })
})
