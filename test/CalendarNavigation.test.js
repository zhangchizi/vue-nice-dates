import { mount } from '@vue/test-utils'
import {
  enGB
} from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarNavigation from '../src/CalendarNavigation'
import { GRID_DAY, GRID_MONTH, GRID_YEAR } from '../src/constants'

describe('CalendarNavigation.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(CalendarNavigation, {
      propsData: {
        locale: enGB,
        date: new Date(),
        gridType: GRID_DAY
      }
    })
  })

  it('should not disable the previous button without passing the minimumDate', () => {
    expect(wrapper.find('.nice-dates-navigation_previous').classes()).not.toContain('-disabled')
  })

  it('should disable the previous button if the month is equal to the month of minimumDate', async () => {
    wrapper.setProps({
      minimumDate: new Date()
    })
    await flushPromises()
    expect(wrapper.find('.nice-dates-navigation_previous').classes()).toContain('-disabled')
  })

  it('should not disable the next button without passing the maximumDate', () => {
    expect(wrapper.find('.nice-dates-navigation_next').classes()).not.toContain('-disabled')
  })

  it('should disable the next button if the month is equal to the month of maximumDate', async () => {
    wrapper.setProps({
      maximumDate: new Date()
    })
    await flushPromises()
    expect(wrapper.find('.nice-dates-navigation_next').classes()).toContain('-disabled')
  })

  it('should display month and year if the gridType is "day"', async () => {
    const date = new Date(2020, 2, 2)
    wrapper.setProps({
      date,
      gridType: GRID_DAY
    })
    await flushPromises()
    expect(wrapper.find('.nice-dates-navigation_current').text()).toBe('March 2020')
  })

  it('should display year if the gridType is "month"', async () => {
    const date = new Date(2020, 2, 2)
    wrapper.setProps({
      date,
      gridType: GRID_MONTH
    })
    await flushPromises()
    expect(wrapper.find('.nice-dates-navigation_current').text()).toBe('2020')
  })

  it('should display year if the gridType is "year"', async () => {
    const date = new Date(2020, 2, 2)
    wrapper.setProps({
      date,
      gridType: GRID_YEAR
    })
    await flushPromises()
    expect(wrapper.find('.nice-dates-navigation_current').text()).toBe('2020 - 2039')
  })

  it('should emit an event when click the previous button', async () => {
    const button = wrapper.find('.nice-dates-navigation_previous')
    button.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('navigate')[0]).toBeTruthy()
    button.trigger('touchend')
    await flushPromises()
    expect(wrapper.emitted('navigate')[0]).toBeTruthy()
  })

  it('should emit an event when click the next button', async () => {
    const button = wrapper.find('.nice-dates-navigation_next')
    button.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('navigate')[0]).toBeTruthy()
    button.trigger('touchend')
    await flushPromises()
    expect(wrapper.emitted('navigate')[0]).toBeTruthy()
  })

  it('should emit an event when click the title', async () => {
    const button = wrapper.find('.nice-dates-navigation_current')
    button.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('clickTitle')[0]).toBeTruthy()
    button.trigger('touchend')
    await flushPromises()
    expect(wrapper.emitted('clickTitle')[0]).toBeTruthy()
  })
})
