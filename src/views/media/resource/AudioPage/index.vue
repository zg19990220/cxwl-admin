<template>
  <div class="imgWrap">
    <el-table :data="pageData.list" style="width: 100%" border>
      <el-table-column prop="cover" label="文件名">
        <template slot-scope="scope">
          <div>
            <BaseElImage
              v-if="group_type == 3"
              :custom_style="{ width: '50px', height: '50px' }"
              :custom_src="scope.row.cover"
              :previewList="[scope.row.cover]"
              fit="cover"
            /><br>
            <el-link :underline="false" :href="base_img+scope.row.file" download target="_blank" type="primary">{{ scope.row.file_name }}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="file"
        label="路径"
      ></el-table-column>
      <el-table-column
        width="100"
        v-if="group_type == 2 || group_type == 3"
        prop="duration"
        label="时长"
      ></el-table-column>
      <el-table-column
        prop="file_size"
        width="200"
        label="文件大小"
      ></el-table-column>
      <el-table-column
        prop="create_time"
        width="200"
        label="创建时间"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-link
            type="primary"
            class="link"
            @click="edit(scope.row)"
            :underline="false"
            >编辑</el-link
          >
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonType="danger"
            @confirm="del(scope.row)"
          >
            <el-link
              slot="reference"
              type="danger"
              class="link"
              :underline="false"
              >删除</el-link
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="30%"
      @close="close"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="分组" prop="group_id">
          <el-select
            v-model="ruleForm.group_id"
            placeholder="请选择分组"
            style="width: 100%"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option
              :label="item.group_name"
              :value="item.group_id"
              v-for="item in groupList"
              :key="item.group_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="file_name">
          <el-input
            type="text"
            v-model="ruleForm.file_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="时长"
          prop="duration"
          v-if="group_type == 3 || group_type == 2"
        >
          <el-input
            type="text"
            v-model="ruleForm.duration"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  delAudio,
  modAudio,
  modVideo,
  delVideo,
  modFile,
  delFile,
} from "@/api/resoure";
let httpData = { delAudio, modAudio, modVideo, delVideo, modFile, delFile };
export default {
  inject: ["getPageData"],
  props: ["pageData", "group_type", "groupList"],
  data() {
    return {
      selectArr: [],
      dialogVisible: false,
      ruleForm: {
        group_id: "",
        file_name: "",
        file: "",
        file_size: "",
      },
    };
  },
  computed: {
    ...mapGetters(["base_img"]),
    row_id() {
      switch (this.group_type) {
        case "2":
          return "audio_id";
          break;
        case "3":
          return "video_id";
          break;
        case "4":
          return "file_id";
          break;
        default:
          return "";
          break;
      }
    },
    mtd() {
      switch (this.group_type) {
        case "2":
          return {
            del: "delAudio",
            mod: "modAudio",
          };
          break;
        case "3":
          return {
            del: "delVideo",
            mod: "modVideo",
          };
          break;
        case "4":
          return {
            del: "delFile",
            mod: "modFile",
          };
          break;
        default:
          return "";
          break;
      }
    },
  },
  methods: {
    edit(row) {
      this.ruleForm = { ...row };
      this.dialogVisible = true;
    },
    editSubmit() {
      let { group_id, file_name, duration } = this.ruleForm;
      let data = {group_id, file_name, duration}
      data[this.row_id] = this.ruleForm[this.row_id]
      httpData[this.mtd.mod](data).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "修改成功",
            duration: 1000,
            type: "success",
          });
          this.$refs.ruleForm.resetFields();
          this.getPageData(1);
          this.dialogVisible = false;
        }
      });
    },
    close() {},
    del(row) {
      let data = {};
      data[this.row_id] = row[this.row_id];
      httpData[this.mtd.del](data).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            duration: 1000,
            type: "success",
          });
          this.getPageData(1);
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.link {
  margin-right: 10px;
}
</style>