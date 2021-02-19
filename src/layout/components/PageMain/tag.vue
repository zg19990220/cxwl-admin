<template>
  <div class="tabWrap">
    <el-tabs
      type="card"
      v-model="path"
      closable
      @tab-click="routerTo"
      @tab-remove="close"
    >
      <el-tab-pane
        v-for="route in routes"
        :key="route.name"
        :label="route.meta.title"
        :name="route.path"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/**
 * 暂未解决多级路由缓存！搞不出来
 */
export default {
  data() {
    return {
      routes: [],
      path: "",
    };
  },
  watch: {
    $route: {
      immediate: true, // 首次加载的时候执行函数
      handler(v) {
        this.path = v.path;
        if (v.name == "media.doc" && v.params.refresh === true) {
          this.routes = this.routes.filter((item) => {
            return item.name != 'media.add';
          });
        }

        let hasRoute = this.routes.some((item) => {
          return item.name == v.name;
        });

        //过滤不需要缓存的路由
        !hasRoute &&
          this.$route.name != "Home" &&
          this.$route.name != "media.edit" &&
          this.$route.name != "media.add" &&
          this.$route.name != "error" &&
          this.routes.push(v);
      },
    },
    routes(v) {
      this.$store.commit("app/SET_TAB_ROUTE", v);
    },
  },
  methods: {
    routerTo(route) {
      this.path = route.name;
      if (this.$route.path == route.name) {
        return;
      }
      this.$router.push({
        path: route.name,
      });
    },
    close(path) {
      if (this.routes.length == 1 && this.$route.name != "Dashbord") {
        this.$router.push({ path: "/" });
        this.routes = [];
        return;
      }
      //获取删除tab的下标
      let index = this.routes.findIndex((item) => {
        return item.path == path;
      });

      //是否删除当前tab
      if (this.$route.path == path) {
        //是否为最后一个
        if (index == this.routes.length - 1) {
          //跳转上一个路由
          index = this.routes.length - 2;
          this.$router.push({ path: this.routes[index].path });
        } else {
          //跳转下一个路由
          index++;
          this.$router.push({ path: this.routes[index].path });
        }
      }
      // //最后删除
      this.routes = this.routes.filter((item) => {
        return item.path != path;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.tabWrap {
  display: flex;
  // background: #fff !important;
  padding: 36px 30px;
  padding: 10px 30px 0 !important;
  &::v-deep {
    .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
      width: 14px;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
      padding: 0 20px;
    }
    .el-tabs__header {
      margin-bottom: 10px;
    }
    .el-tabs {
      width: 100%;
    }
    .el-tabs__nav.is-top {
      border: none;
    }
    .el-tabs--card > .el-tabs__header {
      border: none;
    }
    .el-tabs__item.is-top {
      background: #fafafa !important;
      border: none;
      margin-right: 10px;
      &.is-active {
        background: #fff !important;
      }
    }
  }
  .route {
    display: inline-block;
    padding: 10px 20px;
    background: #fff;
    &.active {
      background: #eee;
    }
  }
}
</style>