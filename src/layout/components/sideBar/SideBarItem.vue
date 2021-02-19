<template>
  <div class="sideItem" v-if="!item.hidden">
    <template
      v-if="
        hasOnlyChild(item.children, item) &&
        (!childItem.children || childItem.noChild)
      "
    >
        <el-menu-item :index="resolvePath(childItem.path,1)">
          <i :class="childItem.meta.icon ? childItem.meta.icon : ''"></i>
          <span slot="title">{{ childItem.meta.title }}</span>
        </el-menu-item>
    </template>

    <el-submenu v-else :index="resolvePath(item.path,2)" popper-append-to-body>
      <template slot="title">
        <i :class="item.meta.icon ? item.meta.icon : ''"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :index="child.name"
        :item="child"
        :basePath="resolvePath(child.path,3)"
      ></sidebar-item>
    </el-submenu>

  </div>
</template>

<script>
import { isAbsolutePath } from "@/utils/validate";
import path from "path";
import { log } from "util";
export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      childItem: null,
    };
  },
  methods: {
    hasOnlyChild(children = [], item) {
      // 过滤掉不需要的子路由
      let newChildren = children.filter((obj) => {
        if (obj.hidden) {
          return false;
        } else {
          return true;
        }
      });
    
      //如果只有一个子路由
      if (newChildren.length === 1&&!item.meta) {
        this.childItem = newChildren[0];
        return true;
      }

      //如果一个子路由都没有
      if (newChildren.length === 0) {
        this.childItem = { ...item, path: "", noChild: true };
        return true;
      }

      return false;
    },
    resolvePath(router,a=0) {
      if (isAbsolutePath(router)) {
        return router;
      }
      if (isAbsolutePath(this.basePath)) {
        return this.basePath;
      }
      return path.join(this.basePath, router);
    },
  }
};
</script>
