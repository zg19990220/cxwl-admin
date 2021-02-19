<template>
  <div class="exception-page">
    <div class="img">
      <img :src="config[type].img" />
    </div>
    <div class="content">
      <h1>{{ config[type].title }}</h1>
      <div class="desc">{{ config[type].desc }}</div>
      <div class="action">
        <el-button v-if="$route.name == '404'" type="primary" @click="backHome"
          >返回首页</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExceptionPage",
  props: ["type"],
  data() {
    return {
      config: {
        dev: {
          img:
            "https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg",
          title: "dev",
          desc: "抱歉，你访问的页面仍在开发中",
        },
        403: {
          img:
            "https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg",
          title: "403",
          desc: "抱歉，你无权访问该页面",
        },
        404: {
          img:
            "https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg",
          title: "404",
          desc: "抱歉，你访问的页面不存在或仍在开发中",
        },
        500: {
          img:
            "https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg",
          title: "500",
          desc: "抱歉，服务器出错了",
        },
      },
    };
  },
  methods: {
    backHome() {
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.exception-page {
  // transform: translate(-25%, 25%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  .img {
    padding-right: 52px;
    zoom: 1;
    img {
      max-width: 430px;
    }
  }
  .content {
    h1 {
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .desc {
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}
</style>
