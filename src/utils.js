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
      ? (date, type) =>
          baseModifiers[name](date, type) || newModifiers[name](date, type)
      : newModifiers[name]
  })

  return modifiers
}

export const invokeModifiers = (modifiers, date, type) => {
  const ret = {}
  Object.keys(modifiers).map(key => {
    ret[key] = modifiers[key](date, type)
  })
  return ret
}

export const triggerBlurForTouchDevice = () => {
  if ('ontouchstart' in window) {
    const element = document.activeElement
    element && element.blur()
  }
}
