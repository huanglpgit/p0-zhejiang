<template>
    <!-- 面包屑 -->
     <div class="gi-bread" v-if="breadcrumb&&breadcrumb.length>0">
				<a-breadcrumb>
	        <a-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</a-breadcrumb-item> 
				</a-breadcrumb>
			</div>
</template>
<script>
  export default {
    name:'TheBread',
    created(){
    },
    computed:{
      breadcrumb(){
        return this.$route.meta.breadcrumbList
      }
    }
  }
 </script>
<style lang="less" scoped>
@box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
.gi-box-shadow {
    box-shadow: @box-shadow;
}
   .gi-bread {
    padding: 10px 16px;
    background: #FFFFFF;
    .gi-box-shadow;
    border-radius: 4px;
    margin: 0 24px 8px;
}
 </style>
 

