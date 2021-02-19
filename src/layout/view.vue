<template>
  <div class="view">
    <transition
      :name="$route.name == 'Dashbord' ? '' : 'fade-page'"
      mode="out-in"
    >
       <keep-alive name="b" :include="routesName">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "LayoutView",
  computed: {
    ...mapGetters(["tabsRoute"]),
    routesName() {
      return this.tabsRoute.map((route) => {
        return route.name;
      });
    },
  },
};
</script>

<style>
</style>