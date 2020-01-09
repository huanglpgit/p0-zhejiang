<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <TheHeader v-if="this.$route.path!='/login'" />
      <TheBread />
      <!-- <div id="nav">
      <router-link to="/opcomponent/abnormal">异常检测</router-link>|
      <router-link to="/opcomponent/rerules">告警关系规则</router-link>
      </div>-->
      <router-view />
    </div>
  </a-locale-provider>
</template>
<style lang="less">
//全局引入
@import "../public/less/giop-default";
#app {
  width: 100%;
  height: 100%;
}
</style>
<script>
import TheHeader from "@/components/TheHeader";
import TheBread from "@/components/TheBread";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "app",
  data() {
    return {
      zh_CN
    };
  },
  components: {
    TheHeader,
    TheBread
  }
};
</script>


