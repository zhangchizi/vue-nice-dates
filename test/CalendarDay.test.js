import { mount } from '@vue/test-utils'
import { setDate } from 'date-fns'
import { enGB } from 'date-fns/locale'
import CalendarDay from '../src/CalendarDay'

function factory(props) {
  return mount(CalendarDay, {
    propsData: {
      locale: enGB,
      ...props
    }
  })
}

describe('CalendarDay.vue', () => {
  it('should display day', () => {
    const date = new Date()
    const wrapper = factory({
      date
    })
    expect(wrapper.get('.nice-dates-day_item').text()).toBe(
      date.getDate().toString()
    )
  })

  it('should display month if it is the first day of month', () => {
    let date = new Date()
    date = setDate(date, 1)
    const wrapper = factory({
      date
    })
    const month = enGB.localize.month(date.getMonth())
    expect(wrapper.get('.nice-dates-day_month').text()).toBe(month.substr(0, 3))
  })

  it('should not display month if it is not the first day of month', () => {
    let date = new Date()
    date = setDate(date, 2)
    const wrapper = factory({
      date
    })
    expect(wrapper.contains('.nice-dates-day_month')).toBe(false)
  })

  it('should map class names to boolean', () => {
    const date = new Date()
    const modifiers = {
      disabled: false,
      selected: true
    }
    const wrapper = factory({
      date,
      modifiers
    })
    expect(wrapper.vm.dayClassNames).toMatchObject({
      '-disabled': false,
      '-selected': true
    })
  })

  it('should add class names and styles to container', () => {
    const date = new Date()
    const modifiers = {
      disabled: false,
      selected: true
    }
    const wrapper = factory({
      date,
      modifiers
    })
    expect(wrapper.classes()).toContain('-selected')
    expect(wrapper.classes()).not.toContain('-disabled')
  })
})
