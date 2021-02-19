<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="hsla(0,0%,100%,.65)"
        active-text-color="#ffffff"
        mode="vertical"
        :router="true"
        :collapse-transition="false"
        :collapse="opened"
      >
        <sidebar-item
          v-for="item in routes"
          :key="item.path"
          :item="item" 
          :basePath="item.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SideBarItem'
import { mapGetters } from 'vuex'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['routes', 'opened']),

    activeMenu() {
      return this.$route.path
    }
  },
  created(){
    
  }
}
</script>
