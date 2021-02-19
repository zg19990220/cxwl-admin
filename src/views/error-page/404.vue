<template>
  <div class="page404 noPadding">
    <exception-page type="404" />
  </div>
</template>

<script>
import ExceptionPage from "@/views/exception/ExceptionPage"
export default {
  components:{ExceptionPage}
}
</script>
<style scoped lang="scss">
.page404 {
  // background: #fff !important;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
