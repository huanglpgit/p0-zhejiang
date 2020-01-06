<template>
  <div id="app">
    <TheHeader v-if="this.$route.path!='/login'" />
    <TheBread v-if="this.$route.path!='/login'" />
    <!-- <div id="nav">
      <router-link to="/opcomponent/abnormal">异常检测</router-link>|
      <router-link to="/opcomponent/rerules">告警关系规则</router-link>
    </div>-->
    <router-view />
  </div>
</template>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
@import "../public/less/reset";
@import "../public/less/giop";
</style>
<script>
import TheHeader from "@/components/TheHeader";
import TheBread from "@/components/TheBread";
export default {
  name: "app",
  components: {
    TheHeader,
    TheBread
  }
};
</script>


