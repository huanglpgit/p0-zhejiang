<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <TheHeader msg="Welcome to Your Vue.js App"/>
    {{username}}
  </div>
  
</template>

<script>
// @ is an alias to /src
import TheHeader from '@/components/TheHeader.vue'

export default {
  name: 'home',
  components: {
    TheHeader
  },
  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    }
  },
}
</script>
