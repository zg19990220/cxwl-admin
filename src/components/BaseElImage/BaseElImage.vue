<template>
  <el-image
    :class="custom_class"
    :style="custom_style"
    :src="img_src"
    :fit="fit"
    :preview-src-list="previewImgs"
  ></el-image>
</template>

<script>
/**
 *根路径图片组件，接口图片返回相对路径时使用
 *有bug
 */
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      previewImgs: [],
    };
  },
  computed: {
    ...mapGetters(["base_img"]),
    img_src() {
      //图片src拼接
      if (this.needBase) {
        return this.base_img + this.custom_src;
      } else {
        return this.custom_src;
      }
    },
  },
  props: {
    //自定义样式
    custom_style: {
      type: Object,
      default() {
        return {};
      },
    },
    custom_class: {
      type: String,
      default() {
        return "defaultClass";
      },
    },
    //src
    custom_src: {
      type: String,
      require: true,
    },
    //图片格式
    fit: {
      type: String,
      default() {
        return "contain";
      },
    },
    //是否需要预览 传入则需要 不传不需要
    previewList: {
      type: Array,
      default() {
        return [];
      },
    },
    //是否需要追加域名
    needBase: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  created() {
    this.previewImgs = this.previewList.map((item) => {
      return this.base_img + item;
    });
  },
};
</script>

<style scpoed>
.el-image-viewer__close {
  color: #fff;
}
.defaultClass {
  width: 50px;
  height: 50px;
}
</style>