<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>TITLE.</span>
      </div>
      <div class="box">
        TODO.
      </div>
    </el-card>
  </div>
</template>

<script>
// import {  } from "@/api/robot";
export default {
  data() {
    return {
      
    };
  },
  created() {
    
  },
  filters: {},
  methods: {

  },
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
</style>
