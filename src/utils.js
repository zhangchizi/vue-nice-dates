import { isAfter, isBefore, startOfDay } from 'date-fns'

export const isSelectable = (date, { minimumDate, maximumDate }) =>
  !isBefore(date, startOfDay(minimumDate)) && !isAfter(date, maximumDate)

export const mergeModifiers = (baseModifiers, newModifiers) => {
  if (!Object.keys(newModifiers).length) {
    return baseModifiers
  }
  const modifiers = { ...baseModifiers }
  Object.keys(newModifiers).forEach(name => {
    modifiers[name] = baseModifiers[name]
      ? date => baseModifiers[name](date) || newModifiers[name](date)
      : newModifiers[name]
  })

  return modifiers
}

export const triggerBlurForTouchDevice = () => {
  if ('ontouchstart' in window) {
    const element = document.activeElement
    element && element.blur()
  }
}
