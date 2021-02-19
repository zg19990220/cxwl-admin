<template>
  <div>
    <i class="el-icon-full-screen iconFont" @click="toggleFull"></i>
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  methods: {
    //全屏
    toggleFull() {
      if (!screenfull.enabled) {
        this.$message({
          type: 'warning',
          message: 'you browser can not work'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>
