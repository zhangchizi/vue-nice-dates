<template>
  <div
    class="nice-dates-popover"
    :class="{'-open':isOpen}"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Popover',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  }
}
</script>
