import { mount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import { GRID_DAY } from '../src'
import CalendarWeekHeader from '../src/CalendarWeekHeader'

describe('CalendarWeekHeader.vue', () => {
  it('should display week names', () => {
    const wrapper = mount(CalendarWeekHeader, {
      propsData: {
        locale: enGB,
        gridType: GRID_DAY
      }
    })
    const weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    expect(wrapper.vm.weekDays()).toEqual(weekNames)

    const elements = wrapper.findAll('.nice-dates-week-header_day')
    weekNames.forEach((item, index) => {
      expect(elements.at(index).text()).toBe(item)
    })
  })
})
