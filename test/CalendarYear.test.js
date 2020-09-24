import {
  mount
} from '@vue/test-utils'
import {
  enGB
} from 'date-fns/locale'
import { format } from 'date-fns'
import CalendarYear from '../src/CalendarYear'

function factory (props) {
  return mount(CalendarYear, {
    propsData: {
      locale: enGB,
      ...props
    }
  })
}

describe('CalendarYear.vue', () => {
  it('should display year', () => {
    const date = new Date()
    const wrapper = factory({
      date
    })
    const text = format(date, 'yyyy', { locale: enGB })
    expect(wrapper.get('.nice-dates-year_item').text()).toBe(text)
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
    expect(wrapper.vm.yearClassNames).toMatchObject({
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
