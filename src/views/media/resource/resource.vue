<template>
  <div class="className">
    <el-tabs type="border-card" v-model="active">
      <el-tab-pane label="图片" name="1">
        <tab-item group_type="1" :active="active" />
      </el-tab-pane>
      <el-tab-pane label="语音" name="2">
        <tab-item group_type="2" :active="active" />
      </el-tab-pane>
      <el-tab-pane label="视频" name="3">
        <tab-item group_type="3" :active="active" />
      </el-tab-pane>
      <el-tab-pane label="文件" name="4">
        <tab-item group_type="4" :active="active" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabItem from "./TabItem";
export default {
  name: "media.resource",
  components: { TabItem },
  data() {
    return {
      active: "1",
    };
  },
  created() {},
  activated() {
    console.log("resoure activated");
  },
  deactivated() {
    console.log("resoure deactivated");
  },
  mounted() {
    console.log("resoure mounted");
  },
  destroyed() {
    console.log("resoure destroyed");
  },
  filters: {},
  methods: {},
};
</script>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: "";
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.box {
  // display: flex;
  .item {
    padding-bottom: 50px;
    width: 300px;
    h2 {
      font-size: 18px;
      padding-bottom: 20px;
    }
  }
}
.el-tabs--border-card {
  border: none;
}
</style>
