<template>
  <pre><code :class="className"><slot></slot></code></pre>
</template>

<script>
import Prism from 'prismjs'
export default {
  name: 'CodeHighlight',
  props: {
    language: {
      type: String,
      default: 'js'
    }
  },
  computed: {
    className() {
      return `language-${this.language}`
    }
  },
  mounted() {
    Prism.highlightAll()
  }
}
</script>

<style></style>
