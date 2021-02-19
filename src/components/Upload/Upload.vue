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
      @change="multipleUploadPic"
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
  },
  data() {
    return {
      notify:""
    };
  },
  deactivated() {
    this.notify&&this.notify.close();
    this.notify = null;
  },
  methods: {
    /**
     * 多选上传图片
     */
    async multipleUploadPic() {
      let files = Array.from(this.$refs.fileUpload.files);
      let success_count = 0;
      let len = files.length;

      for (let i = 0; i < files.length; i++) {
        if (!this.notify) {
          this.notify = this.$notify({
            title: "请不要离开页面",
            duration: 0,
            iconClass: "el-icon-loading",
            showClose: false,
          });
        }
        this.notify.message = `正在上传（${i + 1}/${len}）`;
        const file = files[i];
        await this.uploadPic(file)
          .then((count) => {
            success_count += count;
          })
          .finally(() => {
            this.active = i + 1;
          });
      }

      this.notify.close();
      if (files.length != 0) {
        this.$notify({
          title: "提示",
          message: `上传${files.length}张图片，成功${success_count}张`,
          type: "success",
        });
      }

      this.$emit("after-upload");
      this.$refs.fileUpload.value = "";
    },
    /**
     * 上传图片
     */
    uploadPic(file) {
      let group_id = this.group_id;
      return new Promise((reslove) => {
        uploadFile({ file, type: 0, group_id, is_delete: 0 }).then(
          (res) => {
            if (res.code == 0) {
              reslove(1);
            } else {
              reslove(0);
            }
          },
          (err) => {
            reslove(0);
            console.log(err);
          }
        );
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
