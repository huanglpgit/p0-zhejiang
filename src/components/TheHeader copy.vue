<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
     
       
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper"
          ><a-icon type="setting" />
              <router-link to="abnormal"> 异常检测</router-link>
          </span
        >
        <a-menu-item-group title="Item 1">
          <a-menu-item key="setting:1">Option 1</a-menu-item>
          <a-menu-item key="setting:2">Option 2</a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="Item 2">
          <a-menu-item key="setting:3">Option 3</a-menu-item>
          <a-menu-item key="setting:4">Option 4</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-menu-item key="alipay">
        <a href="https://antdv.com" target="_blank" rel="noopener noreferrer"
          >Navigation Four - Link</a
        >
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
  export default {
    name:'TheHeader',
    data() {
      return {
        headerMenus:[],
         current: ['mail']
      };
    },
    created(){
           var that = this;
            this.$axios({
                method:'get',
                //url:'/json/header.json',
                url:'/api/security/getMenuInfo',
                data:{}
            }).then((res) =>{ 
              debugger
              that.headerMenus = res.data.data
              // alert( res)         //这里使用了ES6的语法
                //console.log(response)       //请求成功返回的数据
            }).catch(() =>{
             // alert(error)
               // console.log(error)       //请求失败返回的数据
            })
    }
        
  };
</script>