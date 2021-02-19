<template>
  <div>
    <div class="head">
      <static-group
        :group_type="group_type"
        :groupList="groupList"
        :group_id="group_id"
      />
    </div>
    <el-tabs
      v-model="group_id"
      @tab-click="handleClick"
      @tab-remove="removeTab"
    >
      <el-tab-pane label="全部" name="0">
        <component
          :is="PageComponent"
          :pageData="pageData"
          :group_type="group_type"
          :groupList="groupList"
        ></component>
      </el-tab-pane>
      <el-tab-pane
        closable
        :label="item.group_name"
        :name="item.group_id"
        v-for="item in groupList"
        :key="item.group_id"
      >
        <component
          :is="PageComponent"
          :pageData="pageData"
          :group_type="group_type"
          :groupList="groupList"
        ></component>
      </el-tab-pane>
    </el-tabs>
    <pagination :data="pageData" @change="getPageData" />
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import {
  getResGroups,
  delResGroup,
  getImgList,
  getAudioList,
  getVideoList,
  getFileList,
} from "@/api/resoure";
import ImgPage from "../ImgPage";
import AudioPage from "../AudioPage";
import StaticGroup from "../StaticGroup";
export default {
  components: { ImgPage, AudioPage, StaticGroup, pagination },
  provide() {
    return {
      getPageData: this.getPageData,
      refreshPage:this.refreshPage,
      getResGroups: this.getResGroups,
      selectArr: this.selectArr,
      pageData:this.pageData
    };
  },
  props: {
    group_type: {
      type: String,
      required: true,
    },
    active: {
      required: true,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      group_id: "0",
      frist: true, // 是否已经加载第一次
      groupList: [],
      pageData: {},
      selectArr: [],
    };
  },
  computed: {
    PageComponent() {
      switch (this.active) {
        case "1":
          return "ImgPage";
          break;
        default:
          return "AudioPage";
          break;
      }
    },
  },
  watch: {
    active: {
      handler: function (val) {
        if (this.frist && val == this.group_type) {
          this.frist = false;
          this.getResGroups();
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      //切换 类型 分组都在这里执行 getPageData
      this.getPageData(1);
    },
    removeTab(group_id) {
      let index = this.groupList.findIndex((item) => {
        return item.group_id == group_id;
      });
      this.$confirm(
        `此操作将删除 ${this.groupList[index].group_name} 分组, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        delResGroup({ group_id }).then((res) => {
          if (res.code == 0) {
            this.groupList.splice(index, 1);
            this.group_id = "0";
            this.handleClick();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
      });
    },
    getResGroups(group_id = "0") {
      let group_type = this.group_type;
      getResGroups({ group_type }).then(
        (res) => {
          if (res.code == 0) {
            this.groupList = res.data;
            this.group_id = group_id + "";
            //刷新一下数据
            this.handleClick();
          }
        },
        (err) => {
          console.log(res);
        }
      );
    },
    getPageData(page) {
      switch (this.active) {
        case "1":
          this.getImgList(page);
          break;
        case "2":
          this.getAudioList(page);
          break;
        case "3":
          this.getVideoList(page);
          break;
        case "4":
          this.getFileList(page);
          break;
        default:
          break;
      }
    },
    refreshPage(){
      this.getPageData(this.pageData.page)
    },
    getImgList(page) {
      let group_id = this.group_id;
      getImgList({ group_id, page }).then(
        (res) => {
          if (res.code == 0) {
            this.pageData = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    getAudioList(page) {
      let group_id = this.group_id;
      getAudioList({ group_id, page }).then(
        (res) => {
          if (res.code == 0) {
            this.pageData = res.data||{};
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    getVideoList(page) {
      let group_id = this.group_id;
      getVideoList({ group_id, page }).then(
        (res) => {
          if (res.code == 0) {
            this.pageData = res.data||{};
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    getFileList(page) {
      let group_id = this.group_id;
      getFileList({ group_id, page }).then(
        (res) => {
          if (res.code == 0) {
            this.pageData = res.data||{};
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
.pagination {
  padding-top: 20px;
  text-align: right;
}
</style>