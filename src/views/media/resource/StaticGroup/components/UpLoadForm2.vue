<template>
  <div class="UpLoadForm">
   <!-- 图片 -->
    <template v-if="type==0">
      <upload @after-upload="refreshPage" :group_id="group_id"/>
    </template> 

    <!-- 音频，视频，文件 -->
    <template v-else>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-upload2"
        @click="dialogVisible=true"
      >新增{{title}}</el-button>
      <el-dialog :title="`新建${title}`" top="4vh" :visible.sync="dialogVisible" width="600px" @close="close">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="auto"
          class="demo-ruleForm"
          v-loading="loading"
        >
          <el-form-item :label="title" prop="file">
            <el-link
              type="primary"
              :underline="false"
              @click="$refs.fileUpload.click()"
            >{{file_name?file_name:"点击上传（自动填充表单）"}}</el-link>
            <input type="file" style="display:none" ref="fileUpload" @change="upload" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input type="text" v-model="ruleForm.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分组" prop="group_id">
            <el-select v-model="ruleForm.group_id" placeholder="请选择分组" style="width: 100%">
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
            <el-input type="text" v-model="ruleForm.file_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="url">
            <el-input
              type="text"
              :disabled="true"
              :readonly="true"
              v-model="ruleForm.url"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面图" prop="url" v-if="group_type==3">
            <BaseElImage :custom_style="{width: '50px',height: '50px'}" v-if="ruleForm.cover"  :custom_src="ruleForm.cover" fit="cover" />
            <p v-else>自动获取</p>
          </el-form-item>
          <el-form-item label="时长" prop="url" v-if="group_type==2||group_type==3">
            <el-input
              type="text"
              :disabled="true"
              :readonly="true"
              v-model="ruleForm.duration"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="大小" prop="file_size">
            <el-input
              type="text"
              :disabled="true"
              :readonly="true"
              v-model="ruleForm.file_size"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <div>{{remarks}}</div>
          </el-form-item>
        </el-form>

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
  getVideoCover
} from "@/api/resoure";
let httpData = {
  addResGroup,
  uploadFile,
  addAudio,
  addFile,
  addVideo,
  getAudioDuration
};
import upload from '@/components/Upload'
export default {
  components:{upload},
  inject: ["getPageData","pageData","refreshPage"],
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
      default() {
        return "0";
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      file_name: "",
      loading: false,
      ruleForm: {
        title: "",
        group_id: "0",
        file_name: "",
        url: "",
        file_size: "",
      },
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
    }
  },
  methods: {
    /**
     * 音频视频文件上传
     */
    upload() {
      let file = this.$refs.fileUpload.files[0];
      let { type } = this;
      this.loading = true;
      uploadFile({ file, type })
        .then(
          (res) => {
            if (res.code == 0) {
              this.file_name = file.name;
              let { file_name, file_size, url } = res.data;
              this.ruleForm = Object.assign(this.ruleForm, {
                file_name,
                file_size,
                url,
              });
            }
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {
          this.$refs.fileUpload.value = ""
          if(this.group_type==3){
            let file_url = this.ruleForm.url
            getVideoCover({file_url}).then(res=>{
              this.ruleForm = Object.assign(this.ruleForm,res.data);
            }).finally(()=>{
              this.loading = false;
            })
          }
          else if(this.group_type==2){
            let audio_file = this.ruleForm.url
            getAudioDuration({audio_file}).then(res=>{
              this.ruleForm = Object.assign(this.ruleForm,res.data);
            }).finally(()=>{
              this.loading = false;
            })
          }else{
            this.loading = false;
          }
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
      addAudio({ ...this.ruleForm }).then(
        (res) => {
          if (res.code == 0) {
            this.dialogVisible = false;
          }
        },
        (err) => {}
      );
    },
    addVideo() {
      addVideo({ ...this.ruleForm }).then(
        (res) => {
          if (res.code == 0) {
            this.dialogVisible = false;
          }
        },
        (err) => {}
      );
    },
    addFile() {
      addFile({ ...this.ruleForm }).then(
        (res) => {
          if (res.code == 0) {
            this.dialogVisible = false;
          }
        },
        (err) => {}
      );
    },
    close() {
      this.$refs["ruleForm"].resetFields();
      this.ruleForm={}
      this.file_name = "";
    },
  },
};
</script>
