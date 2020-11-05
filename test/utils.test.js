import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { subDays, addDays } from 'date-fns'
import {
  isSelectable,
  mergeModifiers,
  triggerBlurForTouchDevice
} from '../src/utils'

describe('utils.js', () => {
  describe('isSelectable should work', () => {
    it('should return true if "minimumDate" and "maximumDate" are null', () => {
      const options = {
        minimumDate: null,
        maximumDate: null
      }
      expect(isSelectable(new Date(), options)).toBe(true)
    })

    it('should return false if the date is after "maximumDate"', () => {
      const date = new Date()
      const options = {
        minimumDate: null,
        maximumDate: subDays(date, 1)
      }
      expect(isSelectable(date, options)).toBe(false)
    })

    it('should return false if the date is before "minimumDate"', () => {
      const date = new Date()
      const options = {
        minimumDate: addDays(date, 1),
        maximumDate: null
      }
      expect(isSelectable(date, options)).toBe(false)
    })

    it('should return true if the date is between "minimumDate" and "maximumDate"', () => {
      const date = new Date()
      const options1 = {
        minimumDate: date,
        maximumDate: date
      }
      expect(isSelectable(date, options1)).toBe(true)

      const options2 = {
        minimumDate: date,
        maximumDate: null
      }
      expect(isSelectable(date, options2)).toBe(true)

      const options3 = {
        minimumDate: null,
        maximumDate: date
      }
      expect(isSelectable(date, options3)).toBe(true)
    })
  })

  describe('mergeModifiers should work', () => {
    it('should return baseModifiers if newModifiers is an empty object', () => {
      const baseModifiers = {
        a: true
      }
      const newModifiers = {}
      expect(mergeModifiers(baseModifiers, newModifiers)).toEqual(baseModifiers)
    })

    it('should merge baseModifiers with newModifiers', () => {
      const mockFnA1 = jest.fn()
      mockFnA1.mockReturnValueOnce(true).mockReturnValue(false)
      const mockFnA2 = jest.fn()
      const mockFnB = jest.fn()
      const baseModifiers = {
        a: mockFnA1
      }
      const newModifiers = {
        a: mockFnA2,
        b: mockFnB
      }
      const result = mergeModifiers(baseModifiers, newModifiers)
      expect(Object.keys(result).length).toBe(2)
      result.a()
      expect(mockFnA1).toHaveBeenCalled()
      expect(mockFnA2).not.toHaveBeenCalled()
      result.a()
      expect(mockFnA1).toHaveBeenCalled()
      expect(mockFnA2).toHaveBeenCalled()
      result.b()
      expect(mockFnB).toHaveBeenCalled()
    })
  })

  it('triggerBlurForTouchDevice() should work', async () => {
    const component = {
      template: '<input ref="input" type="text">',
      mounted() {
        this.$refs.input.focus()
      }
    }
    const wrapper = mount(component, {
      attachToDocument: true
    })
    await flushPromises()
    expect(document.activeElement.tagName).toBe('INPUT')
    global.ontouchstart = true
    triggerBlurForTouchDevice()
    expect(document.activeElement.tagName).not.toBe('INPUT')
    wrapper.destroy()
  })
})
