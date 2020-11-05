import { mount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'
import { format } from 'date-fns'
import CalendarMonth from '../src/CalendarMonth'

function factory(props) {
  return mount(CalendarMonth, {
    propsData: {
      locale: enGB,
      ...props
    }
  })
}

describe('CalendarMonth.vue', () => {
  it('should display month', () => {
    const date = new Date()
    const wrapper = factory({
      date
    })
    const text = format(date, 'MMM', { locale: enGB })
    expect(wrapper.get('.nice-dates-month_item').text()).toBe(text)
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
    expect(wrapper.vm.monthClassNames).toMatchObject({
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
