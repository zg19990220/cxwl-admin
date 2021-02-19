<template>
  <div class="imgWrap">
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[viewSrc]"
    />
    <template v-if="pageData.list && pageData.list.length != 0">
      <div
        class="item-img"
        :class="{ 'border-gray': checkSelect(item.image_id) }"
        v-for="item in pageData.list"
        :key="item.image_id"
        @click="select(item)"
      >
        <BaseElImage custom_class="el_img" :custom_src="item.min_file" fit="cover"/>
        <div class="img_bottom">
          <div class="name">
            {{ item.file_name }}
          </div>
          <i class="el-icon-zoom-in preview" @click.stop="onPreview(item)"></i>
        </div>
        <div
          class="checked"
          :class="{ 'opacity-toggle': checkSelect(item.image_id) }"
        >
          <i class="el-icon-check icon"></i>
        </div>
      </div>
      <!-- <div class="item-img supplement" v-for="item in supplement" :key="item"></div> -->
    </template>
    <template v-else>
      <div class="none">这里什么也没有~</div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getImgList } from "@/api/resoure";
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {ElImageViewer},
  inject: ["selectArr"],
  props: ["pageData"],
  data() {
    return {
      showViewer: false,
      viewSrc:""
    };
  },
  computed: {
    ...mapGetters(["base_img"]),
    supplement() {
      if (this.pageData.page_count == this.pageData.page) {
        return 10 - (this.pageData.list.length % 10);
      } else {
        return 0;
      }
    },
  },
  methods: {
    onPreview(item) {
      this.viewSrc =this.base_img + item.min_file
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
      this.viewSrc =""
    },
    /**
     *翻页后检查是否有选中的图片
     */
    checkSelect(image_id) {
      return this.selectArr.some((item) => {
        return item.image_id == image_id;
      });
    },
    /**
     *添加图片
     */
    select(obj) {
      let imgIndex = this.selectArr.findIndex((item) => {
        return item.image_id == obj.image_id;
      });
      if (imgIndex == -1) {
        this.selectArr.push(obj);
      } else {
        this.selectArr.splice(imgIndex, 1);
      }
    },
    getImgList(page) {
      let group_id = this.group_id;
      getImgList({ group_id, page }).then(
        (res) => {
          if (res.code == 0) {
            this.imgData = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
$img-width: 10vw;
$img-height: 10vw;
.imgWrap {
  width: 100%;
  user-select: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, 10vw);
  grid-template-rows: repeat(2, 10vw);
  grid-gap: 10px;
  justify-content: space-between;
  .item-img {
    box-sizing: border-box;
    border: 2px solid #eee;
    cursor: pointer;
    // flex: 1;
    width: $img-width;
    min-width: $img-width; // 加入这两个后每个item的宽度就生效了
    max-width: $img-width; // 加入这两个后每个item的宽度就生效了
    height: $img-height;
    // margin-bottom: 0.4vw;
    // margin-right: 0.4vw;
    overflow: hidden;
    position: relative;
    &.supplement {
      border: none;
    }
    &.border-gray {
      transition: border-color 0.3s ease-in-out;
      border-color: #409eff;
    }

    .el_img {
      width: 100%;
      height: 100%;
    }
    .checked {
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #409eff;
      transform: translate(50%, -50%);
      opacity: 0;
      &.opacity-toggle {
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
      }
      .icon {
        font-size: 18px;
        color: #fff;
        font-weight: 700;
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(50%, -50%);
      }
    }

    .img_bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20%;
      box-sizing: border-box;
      width: 100%;
      justify-content: space-between;
      color: #eee;
      display: flex;
      align-items: center;
      padding: 0 5px;
      font-size: 14px;
      background: #00000095;

      .name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preview {
        width: 26px;
        font-size: 24px;
      }
    }
  }
}
</style>