<template>
  <div class="pageMain">
    <tag/>
    <transition
      :name="$route.name == 'Dashbord' ? '' : 'fade-page'"
      mode="out-in"
    >
    
      <keep-alive name="a" :include="routesName">
        <router-view ></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import tag from "./tag";
import { mapGetters } from "vuex";
export default {
  components: { tag },
  computed: {
    ...mapGetters(["tabsRoute"]),
    routesName(){
      return this.tabsRoute.map((route) => {
        return route.name;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
