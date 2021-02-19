<template>
  <div class="ud">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @change="onEditorChange($event)"
    ></quill-editor>
    <!-- <aio-vdo-file-livrary ref="aiovio" :appendToBody="true" :type="type" @getData="getData" /> -->
    <picture-library :appendToBody="true" ref="pic" @getData="imgInner" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AioVdoFileLivrary from "@/components/AioVdoFileLivrary";
import PictureLibrary from "@/components/PictureLibrary";
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
import * as Quill from "quill"; // 富文本基于quill

import Video from "./video"; // 插入h5 video视频
import Audio from "./audio"; // 插入h5 video视频
Quill.register(Video, true); // 注册video
Quill.register(Audio, true); // 注册video
import { PlaceholderRegister } from "quill-resize-module";
import { TagPlaceholder, VideoPlaceholder, ClassPlaceholder } from "./resize"; // 插入h5 video视频

PlaceholderRegister([TagPlaceholder, VideoPlaceholder, ClassPlaceholder]);
export default {
  components: {
    quillEditor,
    AioVdoFileLivrary,
    PictureLibrary,
  },
  data() {
    return {
      type: "",
      content: "",
      editor: null, // 富文本编辑器对象
      editorOption: {
        theme: "snow",
        placeholder: "请输入正文",
        initAudioButton: function () {
          //初始化"voice"按钮样式
          // const voiceButton = document.querySelector(".ql-audio"); //"ql-" 是插件自动加的前缀
          // voiceButton.style.fontSize = "16px";
          // voiceButton.classList.add("el-icon-service");
        },
        modules: {
          resize: {
            parchment: {
              image: {
                limit: {
                  minWidth: 0, //可编辑图片的最小宽度 0则所有尺寸的图片均可编辑
                },
              },
              "embed-placeholder": {
                attribute: ["width", "height"],
                limit: {
                  minWidth: 200,
                  ratio: 0.5625,
                },
              },
              video: {
                attribute: ["width", "height"],
                limit: {
                  minWidth: 200,
                  ratio: 0.5625,
                },
              }
            },
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote", "code-block"],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ direction: "rtl" }], // text direction

              [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["image"],
            ],
            handlers: {
              image: (value) => {
                this.$refs.pic.open();
              }
            },
          },
        },
      },
      toolbarDom: "",
      udDom: "",
      wdith: "",
    };
  },
  computed:{
    ...mapGetters(['base_img'])
  },
  methods: {
    onEditorChange(e) {
      this.$emit("senHtml", this.content);
    },
    imgInner(Imgs) {
      Imgs.map((item) => {
        let range = this.editor.getSelection();
        var index = 0;
        if (range == null) {
          index = 0;
        } else {
          index = range.index;
        }
        this.editor.insertEmbed(index, "image", this.base_img+item.src_file);

        //正文插入的第一张图片作为封面图 不需要追加base_img
        this.$emit("UECover",item.src_file)
      });
    },
    /**
     * 滚动监听 浮动toolbar
     */
    scrollHandle() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      if (
        scrollTop >= 248 &&
        !this.toolbarDom.classList.contains("toolbar_fixed")
      ) {
        this.width = this.udDom.clientWidth;
        this.toolbarDom.style.width = `${this.width}px`;
        this.toolbarDom.classList.add("toolbar_fixed");
      } else if (
        scrollTop < 248 &&
        this.toolbarDom.classList.contains("toolbar_fixed")
      ) {
        this.toolbarDom.style.width = "";
        this.toolbarDom.classList.remove("toolbar_fixed");
      }
    },
    /**
     * 动态改变width
     */
    resizeHandle() {
      this.width = this.udDom.clientWidth;
      this.toolbarDom.style.width = `${this.width}px`;
    },
    setContent(content) {
      this.content = content;
    },
  },
  mounted() {
    this.editor = this.$refs.myQuillEditor.quill;
    this.editorOption.initAudioButton();
    this.toolbarDom = document.querySelector(
      ".ud .quill-editor .ql-toolbar.ql-snow"
    );
    this.udDom = document.querySelector(".ud");
    window.addEventListener("scroll", this.scrollHandle);
    window.addEventListener("resize", this.resizeHandle);
  },
  beforeDestroy() {
    //！取消监听
    window.removeEventListener("scroll", this.scrollHandle);
    window.removeEventListener("resize", this.resizeHandle);
    this.editor = null;
    delete this.editor;
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .ql-editor {
    min-height: 370px;
  }
  .ql-toolbar.ql-snow {
    &.toolbar_fixed {
      background: #fff;
      z-index: 999;
      position: fixed;
      top: 50px;
      // width: 600px
    }
  }
  .quill-editor iframe {
    pointer-events: none;
  }
}
</style>