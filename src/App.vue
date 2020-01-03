<template>
  <div id="app">
     <TheHeader/>
      <TheBread/>
     <div id="nav">
      <router-link to="/opcomponent/abnormal">异常检测</router-link> |
      <router-link to="/opcomponent/rerules">告警关系规则</router-link>
    </div> 
    <router-view/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import TheBread from '@/components/TheBread'
export default {
  name:'app',
  components:{
    TheHeader,
    TheBread
  }
}
</script>


