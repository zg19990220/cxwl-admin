<template>
  <div class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="data.total_count"
      :page-count="data.page_count"
      :page-size="data.page_size"
      @current-change="change"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default(){
        return {}
      }
    },
  },
  methods: {
    change(page) {
      this.$emit("change", page);
    },
  },
};
</script>

<style lang="scss">
.pagination {
  padding: 20px 0;
  display: flex;
  justify-content: flex-end;
}
</style>