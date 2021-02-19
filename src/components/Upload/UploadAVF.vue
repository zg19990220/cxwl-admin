<template>
  <div class="upload">
    <div @click="$refs.fileUpload.click()">
      <slot name="btn">
        <el-button size="mini" type="primary" icon="el-icon-upload2"
          >点击上传</el-button
        >
      </slot>
    </div>

    <input
      type="file"
      style="display: none"
      ref="fileUpload"
      multiple
      @change="multipleUploadFile"
    />
  </div>
</template>

<script>
import { uploadFile } from "@/api/resoure";
export default {
  props: {
    group_id: {
      type: [String, Number],
      required: true,
    },
    type:{
      type: [String, Number],
      required: true
    },
    group_type:{
      type: [String, Number],
      required: true
    },
  },
  data() {
    return {};
  },
  methods: {
    async multipleUploadFile() {
      let files = Array.from(this.$refs.fileUpload.files);
      let success_count = 0;
      let len = files.length;

      let notify = "";
      for (let i = 0; i < files.length; i++) {
        if (!notify) {
          notify = this.$notify({
            title: "上传中",
            duration: 0,
            iconClass: "el-icon-loading",
            showClose: false,
          });
        }
        notify.message = `正在上传（${i + 1}/${len}）`;
        const file = files[i];
        // Promise.allSettled([])
        await this.upload(file)
          .then((count) => {
            success_count += count;
          })
          .finally(() => {
            this.active = i + 1;
          });
      }

      notify.close();
      if (files.length != 0) {
        this.$notify({
          title: "提示",
          message: `上传${files.length}个资源，成功${success_count}个`,
          type: "success",
        });
      }

      this.$emit("after-upload");
      this.$refs.fileUpload.value = "";
    },
    /**
     * 音频视频文件上传
     */
    upload() {
      let file = this.$refs.fileUpload.files[0];
      let { type } = this;
      let data = {}
      uploadFile({ file, type })
        .then(
          (res) => {
            if (res.code == 0) {
              let { file_name, file_size, url } = res.data;
              data = file_name, file_size, url
            }
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {
          this.$refs.fileUpload.value = "";
          if (this.group_type == 3) {
            let { url } = data;
            getVideoCover({ file_url:url })
              .then((res) => {
                console.log(Object.assign(data, res.data));
                //todo
                // this.ruleForm = Object.assign(this.ruleForm, res.data);
              })
              .finally(() => {
                
              });
          } else if (this.group_type == 2) {
            let { url } = data;
            getAudioDuration({ audio_file:url })
              .then((res) => {
                console.log(Object.assign(data, res.data));
                // this.ruleForm = Object.assign(this.ruleForm, res.data);
              })
              .finally(() => {
                
              });
          } else {
            
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
