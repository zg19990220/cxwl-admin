<template>
  <div class="UpLoadForm">
    <!-- 图片 -->
    <template v-if="type == 0">
      <upload @after-upload="refreshPage" :group_id="group_id" />
    </template>

    <!-- 音频，视频，文件 -->
    <template v-else>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-upload2"
        @click="$refs.fileUpload.click()"
        >新增{{ title }}</el-button
      >
      <input
        type="file"
        multiple
        style="display: none"
        ref="fileUpload"
        @change="multipleUploadFile"
      />
      <!-- <UploadAVF :type="type" :group_id="group_id" :group_type="group_type" /> -->
      <el-dialog
        :title="`新建${title}`"
        top="4vh"
        :visible.sync="dialogVisible"
        width="1000px"
        @close="close"
      >
        <el-table :data="ruleForm" style="width: 100%" border>
          <el-table-column prop="cover" label="文件名">
            <template slot-scope="scope">
              <div>
                <BaseElImage
                  v-if="group_type == 3"
                  :custom_style="{ width: '50px', height: '50px' }"
                  :custom_src="scope.row.cover"
                  fit="cover"
                />
                <p>{{ scope.row.file_name }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="group_type == 2 || group_type == 3"
            prop="url"
            label="路径"
          ></el-table-column>
          <el-table-column
            width="100"
            v-if="group_type == 2 || group_type == 3"
            prop="duration"
            label="时长"
          ></el-table-column>
          <el-table-column
            width="200"
            prop="file_size"
            label="文件大小"
          ></el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import {
  addResGroup,
  uploadFile,
  addAudio,
  addFile,
  addVideo,
  getAudioDuration,
  getVideoCover,
} from "@/api/resoure";
let httpData = {
  addResGroup,
  uploadFile,
  addAudio,
  addFile,
  addVideo,
  getAudioDuration,
};

import upload from "@/components/Upload";
import { UploadAVF } from "@/components/Upload";
export default {
  components: { upload, UploadAVF },
  inject: ["getPageData", "pageData", "refreshPage"],
  props: {
    groupList: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    group_type: {
      type: String,
      required: true,
    },
    group_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      file_name: "",
      loading: false,
      ruleForm: {},
      fileList: [], //存放上传的音频、视频返回的数据
      tips: "",
    };
  },
  computed: {
    mtd() {
      switch (this.group_type) {
        case "1":
          return "图片";
          break;
        case "2":
          return "音频";
          break;
        case "3":
          return "视频";
          break;
        case "4":
          return "文件";
          break;
        default:
          return "";
          break;
      }
    },
    title() {
      switch (this.group_type) {
        case "1":
          return "图片";
          break;
        case "2":
          return "音频";
          break;
        case "3":
          return "视频";
          break;
        case "4":
          return "文件";
          break;
        default:
          return "";
          break;
      }
    },
    remarks() {
      switch (this.group_type) {
        case "2":
          return "格式支持m4a, aac, mp3, wav,文件大小不超过30M，语音时长不超过30分钟";
          break;
        case "3":
          return "格式支持mp4, 文件大小不超过30M，视频时长不超过30分钟";
          break;
        case "4":
          return "支持doc，xls，ppt，txt，gif，rar，zip等格式的文件，注意文件大小不得超过30M";
          break;
        default:
          return "";
          break;
      }
    },
    type() {
      switch (this.group_type) {
        case "1":
          return 0;
          break;
        default:
          return this.group_type - 1;
          break;
      }
    },
  },
  deactivated() {

  },
  methods: {
    /**
     * 音频视频文件上传
     */
    multipleUploadFile() {
      let files = Array.from(this.$refs.fileUpload.files);
      let promiseArr = [];
      files.map(async (item, index) => {
        promiseArr.push(this.upload(item, index));
      });
      this.tips = this.$loading({
        lock: true,
        text: `上传中(0/${this.$refs.fileUpload.files.length})`,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.tips.successCount = 0
      this.tips.count = 0
      Promise.allSettled(promiseArr).then((res) => {
        this.ruleForm =res.filter(item=>{
          return item.status == "fulfilled"
        }).map((item) => {
          return item.value;
        });
        if(this.ruleForm.length>0){
          this.dialogVisible = true;
        }

        
        this.$refs.fileUpload.files.value = null;
        this.tips.close();
      
        this.tips = null
      });
    },
    upload(file, index) {
      let len = this.$refs.fileUpload.files.length;
      let { type } = this;
      let data = {};
      return new Promise((reslove, reject) => {
        uploadFile({ file, type })
          .then((res) => {
            if (res.code == 0) {
              this.tips.successCount  = this.tips.successCount+1
              let { file_name, file_size, url } = res.data;
              data = { file_name, file_size, url };
              if (res.data.file_type) {
                data.file_type = res.data.file_type;
              }
            }else{
              reject()
            }
          })
          .finally(() => {
            this.tips.count  = this.tips.count+1
            this.tips.text = `上传中(${this.tips.count}/${this.$refs.fileUpload.files.length})`
            if (this.group_type == 3) {
              let file_url = data.url;
              getVideoCover({ file_url })
                .then((res) => {
                  if(res.code==0){
                    data = Object.assign(data, res.data);
                  }else{
                    reject()
                  }
                  
                })
                .finally(() => {
                  reslove(data);
                });
            } else if (this.group_type == 2) {
              let audio_file = data.url;
              getAudioDuration({ audio_file })
                .then((res) => {
                 if(res.code==0){
                    data = Object.assign(data, res.data);
                  }else{
                    reject()
                  }
                })
                .finally(() => {
                  reslove(data);
                });
            } else if (this.group_type == 4) {
              console.log(data);
              reslove(data);
            }
          });
      });
    },
    async add() {
      switch (this.group_type) {
        case "2":
          await this.addAudio();
          break;
        case "3":
          await this.addVideo();
          break;
        case "4":
          await this.addFile();
          break;
        default:
          break;
      }
      this.refreshPage();
    },
    addAudio() {
      let files = [...this.ruleForm];
      files.forEach((item) => {
        item.file = item.url;
        delete item.url;
      });
      files = JSON.stringify(files);
      let { group_id } = this;
      addAudio({ files, group_id }).then(
        (res) => {
          if (res.code == 0) {
            this.dialogVisible = false;
          }
        },
        (err) => {}
      );
    },
    addVideo() {
      let files = [...this.ruleForm];
      files.forEach((item) => {
        item.file = item.url;
        delete item.url;
      });
      files = JSON.stringify(files);
      let { group_id } = this;
      addVideo({ files, group_id }).then(
        (res) => {
          if (res.code == 0) {
            this.dialogVisible = false;
          }
        },
        (err) => {}
      );
    },
    addFile() {
      let files = [...this.ruleForm];
      files.forEach((item) => {
        item.file = item.url;
        delete item.url;
      });
      files = JSON.stringify(files);
      let { group_id } = this;
      addFile({ files, group_id }).then(
        (res) => {
          if (res.code == 0) {
            this.dialogVisible = false;
          }
        },
        (err) => {}
      );
    },
    close() {
      this.ruleForm = [];
      this.file_name = "";
    },
  },
};
</script>
