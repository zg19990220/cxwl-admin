<template>
  <div class="aiovio">
    <el-dialog
      :title="type"
      :visible.sync="dialogVisible"
      width="800px"
      :append-to-body="appendToBody"
      :before-close="handleClose"
    >
      <el-table :data="pageData.list" style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="150"
        ></el-table-column>
        <el-table-column prop="file_name" label="文件名称"></el-table-column>
        <el-table-column
          prop="file_size"
          label="文件大小"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="150"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="select(scope.row)" type="text" size="small"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="getPageData"
          layout="total, prev, pager, next"
          :total="pageData.total_count"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 使用说明
 * 1. 引入组件
 *
 * 2. 增加ref 和一个 自定义事件用于确定获取选中内容
 * <AioVdoFile-livrary ref="ref" @getData="getData" />
 * this.$refs.ref.open()打开
 */
import {
  getResGroups,
  delResGroup,
  getAudioList,
  getVideoList,
  getFileList,
} from "@/api/resoure";
let httpData = { getAudioList, getVideoList, getFileList };
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
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
      pageData: {},
    };
  },
  computed: {
    mtd() {
      switch (this.type) {
        case "音频":
          return "getAudioList";
          break;
        case "视频":
          return "getVideoList";
          break;
        default:
          return "getFileList";
          break;
      }
    },
  },
  methods: {
    select(row) {
      //TODO EMIT
      this.$emit("getData", row);
      this.dialogVisible = false;
    },
    open() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.getPageData(1);
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.pageData = {};
    },
    getPageData(page = 1) {
      httpData[this.mtd]({ page }).then(
        (res) => {
          if (res.code == 0) {
            this.pageData = res.data;
          }
        },
        (err) => {}
      );
    },
  },
};
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>