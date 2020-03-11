import { mount } from '@vue/test-utils'
import { format, subYears, startOfMonth, subMonths, addMonths } from 'date-fns'
import {
  enGB
} from 'date-fns/locale'
import flushPromises from 'flush-promises'
import CalendarNavigation from '../src/CalendarNavigation'

describe('CalendarNavigation.vue', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(CalendarNavigation, {
      propsData: {
        locale: enGB
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

  it('should only display month if the year is equal to the real year', async () => {
    const date = new Date()
    const monthText = format(date, 'MMMM', enGB)
    expect(wrapper.find('.nice-dates-navigation_current').text()).toBe(monthText)
  })

  it('should display month and year if the year is different with the real year', async () => {
    const date = subYears(new Date(), 1)
    wrapper.setProps({
      month: date
    })
    const monthText = format(date, 'MMMM yyyy', enGB)
    await flushPromises()
    expect(wrapper.find('.nice-dates-navigation_current').text()).toBe(monthText)
  })

  it('should emit an event when click the previous button', async () => {
    const month = startOfMonth(subMonths(new Date(), 1))
    const button = wrapper.find('.nice-dates-navigation_previous')
    button.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('monthChange')[0]).toEqual([month])
    button.trigger('touchend')
    await flushPromises()
    expect(wrapper.emitted('monthChange')[0]).toEqual([month])
  })

  it('should emit an event when click the next button', async () => {
    const month = startOfMonth(addMonths(new Date(), 1))
    const button = wrapper.find('.nice-dates-navigation_next')
    button.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('monthChange')[0]).toEqual([month])
    button.trigger('touchend')
    await flushPromises()
    expect(wrapper.emitted('monthChange')[0]).toEqual([month])
  })
})
