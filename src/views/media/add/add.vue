<template>
  <div class="className">
    <picture-library ref="pic" @getData="setCover" />
    <el-card class="anoCard">
      <div slot="header">
        <span>{{ title }}</span>
      </div>
      <div class="box">
        <div class="cover" @click="$refs.pic.open(false)">
          <template v-if="docData.cover">
            <BaseElImage
              :custom_style="{ width: '100%', height: '100%' }"
              :custom_src="docData.cover"
              fit="cover"
            />
          </template>
          <template v-else>
            <div class="coverTips">
              <i class="el-icon-picture"></i>
              点击选择封面
            </div>
          </template>
        </div>
        <div class="doc-form">
          <el-form label-position="right" label-width="0" :model="docData">
            <el-form-item label>
              <input
                type="text"
                placeholder="请输入标题"
                v-model="docData.title"
                class="my-input title"
              />
            </el-form-item>
            <el-form-item label>
              <input
                type="text"
                placeholder="请输入作者"
                v-model="docData.author"
                class="my-input author"
              />
            </el-form-item>
            <el-form-item label>
              <el-input
                class="my-input summary"
                type="textarea"
                v-model="docData.summary"
                :rows="4"
                placeholder="请输入摘要"
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <u-e ref="quill" @senHtml="getHtml" @UECover="UECover" />
            </el-form-item>

            <el-form-item label>
              <div class="submitWrap">
                <div style="margin-right: 20px">
                  <el-select v-model="docData.group_id" placeholder="请选择">
                    <el-option label="未分组" value="0"> </el-option>
                    <el-option
                      v-for="item in groupList"
                      :key="item.group_id"
                      :label="item.group_name"
                      :value="item.group_id"
                    >
                    </el-option>
                  </el-select>
                </div>

                <el-button
                  icon="el-icon-s-promotion"
                  type="primary"
                  @click="check_docData"
                  >发布</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import UE from "@/components/UE";
import PictureLibrary from "@/components/PictureLibrary";
import { addDoc, getResGroups } from "@/api/doc";
export default {
  name: "media.add",
  components: { UE, PictureLibrary },
  data() {
    return {
      videoSelectModal: false,
      docData: {
        author: "",
        title: "",
        summary: "",
        cover: "",
        content: "",
        group_id: "0",
      },
      groupList: [],
    };
  },
  computed: {
    title() {
      return "新增图文消息";
    },
  },
  created() {
    this.getResGroups();
  },
  filters: {},
  methods: {
    UECover(cover) {
      //获取正文插入的第一张图为封面图
      if (!this.docData.cover) {
        this.docData.cover = cover;
      }
    },
    getResGroups() {
      getResGroups({ group_type: 4 }).then((res) => {
        if (res.code == 0) {
          this.groupList = res.data;
        }
      });
    },
    setCover(item) {
      this.docData.cover = item[0].src_file;
    },
    getHtml(content) {
      this.docData.content = content;
    },
    check_docData() {
      if (this.docData.title === "") {
        this.$message({
          message: "请输入标题",
          type: "warning",
        });
        return;
      } else if (this.docData.author === "") {
        this.$message({
          message: "请输入作者",
          type: "warning",
        });
        return;
      } else if (this.docData.content === "") {
        this.$message({
          message: "请输入内容",
          type: "warning",
        });
        return;
      } else if (this.docData.summary === "") {
        this.$message({
          message: "请输入摘要",
          type: "warning",
        });
        return;
      } else if (this.docData.cover === "") {
        this.$message({
          message: "请选择封面",
          type: "warning",
        });
        return;
      }
      this.addDoc();
    },
    addDoc() {
      addDoc({ ...this.docData }).then(
        (res) => {
          if (res.code == 0) {
            this.$router.replace({ name: "media.doc", params: { refresh: true } });
            this.$message({
              message: "发布成功",
              type: "success",
              duration: 1000,
            });
          }
        },
        (err) => {}
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.anoCard {
  .el-card__body:after {
    content: "";
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.box {
  display: flex;
  .cover {
    cursor: pointer;
    width: 300px;
    height: 200px;
    border: 1px solid #67c23a;
    padding: 10px;
    box-sizing: border-box;

    .coverTips {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      color: #c0c0c0;
    }
  }
  .doc-form {
    width: 1300px;
    padding: 0 30px 0;
    box-sizing: border-box;
    .title {
      font-size: 20px;
    }
    .author {
      font-style: 14px;
    }
    .submitWrap {
      display: flex;
      justify-content: flex-end;
    }
  }
  &::v-deep {
    .el-form-item__content {
      line-height: inherit;
    }
  }
}
.my-input {
  width: 100%;
  border: none;
  box-sizing: border-box;
  padding: 5px 0;
  // font-weight: 700;
  outline: none;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  &.summary {
    border: none;
    color: #ccc;
  }
}
</style>
