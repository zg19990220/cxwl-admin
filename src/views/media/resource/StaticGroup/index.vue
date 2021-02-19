<template>
  <div class="static-group">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="img-select-list" v-show="selectArr.length">
        <div class="len">
          共选择
          <el-link icon="el-icon-picture" class="link-a" type="primary">{{selectArr.length}}</el-link>张图片
        </div>
        <div class="link-wrap">
          <el-link
            icon="el-icon-close"
            :underline="false"
            class="link-a close"
            type="primary"
            @click="closeSelect"
          >全部取消</el-link>
          <el-link
            icon="el-icon-delete"
            :underline="false"
            class="link-a del"
            type="primary"
            @click="delSelect"
          >删除</el-link>
        </div>
      </div>
    </transition>
    <div class="right">
      <el-popover placement="right" v-model="disabled" width="300" trigger="click">
        <div class="addGroup">
          <el-input v-model="group_name" placeholder="请输入组名"></el-input>
          <div class="add-btn">
            <el-button type="primary" size="mini" @click="addResGroup">添加</el-button>
          </div>
        </div>
        <el-button slot="reference" type="primary" size="mini" icon="el-icon-plus">新增分组</el-button>
      </el-popover>
      <div class="upload-btn">
        <up-load-form :group_type="group_type" :groupList="groupList" :group_id="group_id" />
      </div>
    </div>
  </div>
</template>

<script>
import { addResGroup, delImage } from "@/api/resoure";
import UpLoadForm from "./components/UpLoadForm";
export default {
  components: { UpLoadForm },
  inject: ["getResGroups", "selectArr", "getPageData"],
  props: ["group_type", "group_id", "groupList"],
  data() {
    return {
      group_name: "",
      disabled: false,
    };
  },
  methods: {
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
          this.getPageData(1);
          this.selectArr.splice(0, this.selectArr.length);
        }
      });
    },
    addResGroup() {
      let { group_type, group_name } = this;
      if (group_name=="") {
        this.$message({
          message: '请输入组名',
          type: 'warning'
        });
        return
      }
      addResGroup({ group_type, group_name }).then(
        (res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.disabled = false;
            this.group_name = "";
            this.getResGroups(res.data.group_id);
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

<style lang="scss" scoped>
.static-group {
  display: flex;
  justify-content: space-between;
}
.right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
.addGroup {
  display: flex;
  .add-btn {
    margin-left: 10px;
  }
}
.upload-btn {
  margin-left: 10px;
}
.img-select-list {
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
</style>>
