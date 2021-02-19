<template>
  <div class="user animateClass">
    <p class="user_p0">云驻停车后台管理</p>
    <p class="user_p1">欢迎您</p>
    <div class="user_img" ref="aniEnd">
      <img src="@/assets/img/logo.png" alt="vue" />
    </div>
  </div>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
.animateClass {
  .user_p0,
  .user_p1,
  .user_img {
    animation: bounceInUp 1s;
  }
}
.user {
  overflow: hidden;
  .user_p0 {
    font-size: 36px;
    text-align: center;
    padding-top: 55px;
    animation-fill-mode: forwards;
  }
  .user_p1 {
    font-size: 20px;
    text-align: center;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
  }
  .user_img {
    text-align: center;
    margin-top: 46px;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
    img{
      width: 500px;
      border-radius: 50%;
    }
  }
}
</style>
