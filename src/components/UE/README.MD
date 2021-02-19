# 富文本使用示例

## H5
使用两层容器包裹
* 外层 class：ql-container ql-snow
* 中层 class：ql-editor
* 内层 需要渲染的HTML
```HTML
<link type="text/css" rel="stylesheet" href="xxx/xxx/quill.snow.css">
<div class="ql-container ql-snow">
    <div class="ql-editor">
      <div>{{这里渲染你的HTML代码}}</div>
    </div>
  </div>
```

## 微信小程序

```HTML
<template>
  <view class="ql-container ql-snow">
    <view class="ql-editor"><rich-text :nodes="content"></rich-text></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: `<p class="ql-align-center"><strong class="ql-size-large">测试标题</strong></p><p class="ql-align-center"><br></p><p><span class="ql-font-monospace" style="color: rgb(230, 0, 0);">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</span><span class="ql-font-monospace" style="background-color: rgb(68, 68, 68);">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内</span><span class="ql-font-monospace">容内容</span><span class="ql-font-monospace" style="color: rgb(255, 255, 102);">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内</span><span class="ql-font-monospace">容内容内容内容内容内容内容内容内容</span></p><ol><li><span class="ql-font-monospace">1</span></li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li></ol><ul><li>7</li><li>8</li><li>9</li><li>0<sup>1</sup></li></ul><h1><br></h1><p><br></p><p><img src="http://www.machat.mobi/dupai/upload/image/161000436465437.jpg" class=""></p>`
    };
  }
};
</script>

<style>
@import url('xxx/xxx/quill.snow.css');
</style>
```