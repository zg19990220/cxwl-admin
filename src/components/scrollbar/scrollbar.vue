<template>
  <el-scrollbar class="scrollbar">
    <slot></slot>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>