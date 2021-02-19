<template>
  <div class="wrapper" :class="{ closeBar: opened }">
    <m-header></m-header>
    <div class="wrapper_con">
      <side-bar></side-bar>
      <page-main></page-main>
    </div>
  </div>
</template>

<script>
import SideBar from "./components/sideBar";
import MHeader from "./components/header";
import PageMain from "./components/PageMain";
import { mapGetters } from "vuex";
export default {
  name: "layout",
  computed: {
    ...mapGetters(["opened"]),
  },
  components: {
    SideBar,
    MHeader,
    PageMain
  },
};
</script>
