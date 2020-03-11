import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Popover from '../src/Popover'

describe('Popover.vue', () => {
  it('should render slot', async () => {
    const slot = '123'
    const wrapper = mount(Popover, {
      slots: {
        default: slot
      }
    })
    await flushPromises()
    expect(wrapper.text()).toBe(slot)
  })

  it('should not add "-open" class name to root without passing "isOpen"', () => {
    const wrapper = mount(Popover)
    expect(wrapper.classes('-open')).toBe(false)
  })

  it('should not add "-open" class name to root if the isOpen prop is true', async () => {
    const wrapper = mount(Popover, {
      propsData: {
        isOpen: true
      }
    })
    await flushPromises()
    expect(wrapper.classes('-open')).toBe(true)
  })
})
