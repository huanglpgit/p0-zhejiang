<template>
  <div class="abnormal">
    <!-- 面包屑 -->
    <!-- <div class="gi-bread">
				<a-breadcrumb>
	        <a-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</a-breadcrumb-item> 
				</a-breadcrumb>
			</div> -->
  </div>
</template>
<script>
  export default {
    name:'abnormal',
    created(){
     document.title = '异常检测'
    },
    computed:{
      breadcrumb(){
        return this.$route.meta.breadcrumbList
      }
    }
  }
 </script>

