<template>
  <div id="picWrap">
    <el-dialog
      top="50px"
      class="big"
      :visible.sync="dialogVisible"
      width="800px"
      :appendToBody="appendToBody"
      @open="openhandle"
      :before-close="handleClose"
    >
      <div slot="title" class="dialog-header">
        <div class="header-top">
          <div class="title">图片库</div>
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div class="img-select-list" v-show="selectArr.length">
              <div class="len">
                共选择
                <el-link icon="el-icon-picture" class="link-a" type="primary">{{
                  selectArr.length
                }}</el-link
                >张图片
              </div>
              <div class="link-wrap">
                <el-link
                  icon="el-icon-close"
                  :underline="false"
                  class="link-a close"
                  type="primary"
                  @click="closeSelect"
                  >全部取消</el-link
                >
                <el-link
                  icon="el-icon-delete"
                  :underline="false"
                  class="link-a del"
                  type="primary"
                  @click="delSelect"
                  >删除</el-link
                >
              </div>
            </div>
          </transition>
        </div>

        <div class="grounp-wrap">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            style="margin-right:10px"
            @click="showAddGrounp"
            >新增分组</el-button
          >
           <upload @after-upload="getImgList(imgData.page)" :group_id="group_id"/>
          <!-- <el-button
            size="small"
            type="primary"
            icon="el-icon-upload2"
            @click="$refs.fileUpload.click()"
            >点击上传</el-button
          >
          <input
            type="file"
            multiple="multiple"
            style="display: none"
            ref="fileUpload"
            @change="multipleUploadPic"
          /> -->
        </div>
      </div>

      <div class="body">
        <el-tabs
          tab-position="left"
          @tab-click="toggleGroup"
          v-model="group_id"
        >
          <el-tab-pane label="全部" name="0">
            <tabItem :selectArr.sync="selectArr" :imgData="imgData" :multiple="multiple" />
          </el-tab-pane>

          <el-tab-pane
            :label="group.group_name"
            :name="group.group_id"
            v-for="group in groupList"
            :key="group.group_id"
          >
            <tabItem :selectArr.sync="selectArr" :imgData="imgData" :multiple="multiple" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="pagination">
          <el-pagination
            background
            :current-page="imgData.page"
            :page-size="imgData.page_size"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :total="imgData.total_count"
          ></el-pagination>
        </div>

        <div class="btnWrap">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectEmit">确 定</el-button>
        </div>
      </div>

      <el-dialog
        width="30%"
        class="small"
        title="新增分组"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="inner-body">
          <el-input
            v-model="group_name"
            placeholder="请输入新增组名"
          ></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <div class="btnWrap">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="addResGroup">确 定</el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 使用说明
 * 1. 引入组件 
 * import PictureLibrary from "@/components/PictureLibrary";
 * 
 * 2. 增加ref 和一个 自定义事件用于获取选中的图片回调
 * <picture-library ref="pic" @getData="getPic" />
 *  this.$refs.ref.open(type)打开 type 可选值 (类型：布尔值 ) （true:多选，false:单选）  默认多选
 */
import upload from '@/components/Upload'
import { mapGetters } from "vuex";
import tabItem from "./tabItem";
import {
  getImgList,
  getResGroups,
  addResGroup,
  delImage,
} from "@/api/resoure";
export default {
  components:{tabItem,upload},
  props:{
    appendToBody:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      innerVisible: false,
      selectArr: [],
      groupList: [],
      group_id: "0",
      group_type: 1,
      imgData: {},
      group_name: "",
      multiple: true, //多选
    };
  },
  computed: {
    ...mapGetters(["base_img"]),
    //用于补充留白计算作用
    page_size() {
      return Math.ceil(this.imgData.page_size / 5) * 5;
    },
  },
  methods: {
    clear(){
      this.$refs.fileUpload.value = ""
    },
    handleClose() {
      this.closeSelect();
      this.dialogVisible = false;
    },
    selectEmit() {
      this.$emit("getData", [...this.selectArr]);
      this.handleClose();
    },
    closeSelect() {
      
      this.selectArr.splice(0, this.selectArr.length);
    },
    delSelect() {
      let arr = [];
      this.selectArr.map((item) => {
        arr.push(item.image_id);
      });
      delImage({ imgs: arr.join(",") }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getImgList(1);
          this.selectArr.splice(0, this.selectArr.length);
        }
      });
    },
    /**
     * 分页页码改变回调函数 上下页请求
     */
    handleCurrentChange(val) {
      this.getImgList(val);
    },
    toggleGroup(ref) {
      this.group_id = ref.name;
      this.getImgList(1);
    },
    openhandle() {
      this.getImgList(1);
      this.getResGroups();
    },
    open(multiple = true) {
      this.multiple = multiple;
      console.log(this.multiple);
      this.dialogVisible = true;
    },
    close() {
      this.group_id = "0";
      this.dialogVisible = false;
    },
    toggle() {
      this.dialogVisible = !this.dialogVisible;
    },
    showAddGrounp() {
      this.innerVisible = true;
    },
    getImgList(page = 1) {
      let group_id = this.group_id;
      getImgList({ page, group_id }).then(
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
    getResGroups() {
      let group_type = this.group_type;
      getResGroups({ group_type }).then(
        (res) => {
          this.groupList = res.data;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    addResGroup() {
      let group_type = this.group_type;
      let group_name = this.group_name;
      addResGroup({ group_type, group_name })
        .then(
          (res) => {
            this.getResGroups(1);
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {
          this.innerVisible = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: auto;
}
.none {
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 50px 0;
}
#picWrap {
  user-select: none;
}

.dialog-header {
  .header-top {
    font-size: 24px;
    display: flex;
    align-items: center;
    .img-select-list {
      padding-left: 20px;
      display: flex;
      align-items: center;
      .link-wrap {
        display: flex;
        .close {
          padding-right: 10px;
        }
      }
      .len {
        min-width: 150px;
        padding-right: 15px;
        font-size: 14px;
        display: flex;
        align-items: center;
        flex: 1;
        .link-a {
          padding: 0 5px;
        }
      }
    }
  }

  .grounp-wrap {
    display: flex;
    margin-top: 20px;
    padding-left: 75x;
    justify-content: flex-end;
  }
}
.dialog-footer {
  .pagination {
    padding-right: 40px;
  }
  padding-top: 20px;
  align-items: center;
  display: flex;
  justify-content: flex-end;
}
::v-deep {
  .big {
    .el-dialog__body {
      padding: 10px 20px 30px;
    }
  }
  .small {
    .el-dialog__body {
      padding: 0 20px;
    }
  }
}
</style>