<template>
  <div class="imgWrap">
    <template v-if="imgData.list && imgData.list.length != 0">
      <div
        class="item-img"
        :class="{ 'border-gray': checkSelect(item.image_id) }"
        v-for="item in imgData.list"
        :key="item.image_id"
        @click="select(item)"
      >
        <BaseElImage
          :custom_style="{ width: '120px', height: '120px' }"
          :custom_src="item.min_file"
          fit="cover"
        />
        <div
          class="checked"
          :class="{ 'opacity-toggle': checkSelect(item.image_id) }"
        >
          <i class="el-icon-check icon"></i>
        </div>
      </div>
      <template v-if="imgData.list.length != page_size">
        <div
          class="item-img fill"
          v-for="item in page_size - (imgData.list.length % page_size)"
          :key="'fill' + item"
        ></div>
      </template>
    </template>
    <template v-else>
      <div class="none">这里什么也没有~</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    selectArr: {
      type: Array,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: true,
    },
    imgData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    //用于补充留白计算作用
    page_size() {
      return Math.ceil(this.imgData.page_size / 5) * 5;
    },
  },
  methods: {
    /**
     * 检查当前页是否有选中的图片
     */
    checkSelect(image_id) {
      return this.selectArr.some((item) => {
        return item.image_id == image_id;
      });
    },
    /**
     * 选择图片
     */
    select(obj) {
      let imgIndex = this.selectArr.findIndex((item) => {
        return item.image_id == obj.image_id;
      });
      if (imgIndex == -1) {
        if (this.multiple) {
          this.selectArr.push(obj);
        } else if (this.selectArr.length == 0) {
          this.selectArr.push(obj);
        }
      } else {
        this.selectArr.splice(imgIndex, 1);
      }
    },
  },
};
</script>

<style lang="scss">
.imgWrap {
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item-img {
    border: 2px solid #eee;
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    overflow: hidden;
    position: relative;
    &.fill {
      border: none;
    }
    &.border-gray {
      transition: border 0.3s ease-in-out;
      border-color: #409eff;
    }
    .name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: #eee;
      padding: 3px;
      background: #00000095;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .enlarge {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      // width: 60px;
      // height: 60px;
      opacity: 0;
      color: #409eff;
      font-weight: 700;
      // background: #666;
      &:hover {
        & {
          transition: opacity 0.3s ease-in-out;
          opacity: 1;
        }
      }
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
  }
}
</style>