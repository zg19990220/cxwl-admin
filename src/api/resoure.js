import $axios from './index'

const api = {
  getImgList:"getImgList",        //获取图片数据
  getAudioList:"getAudioList",    //获取音频数据
  getVideoList:"getVideoList",    //获取视频数据
  getFileList:"getFileList",      //获取文件数据

  getResGroups:"getResGroups",    //获取数据分组
  addResGroup:"addResGroup",      //增加数据分组
  delResGroup:"delResGroup",      //删除数据分组

  addAudio:"addAudio",            //增加音频
  addVideo:"addVideo",            //增加视频
  addFile:"addFile",              //增加文件

  modFile:"modFile",              //修改文件
  modAudio:"modAudio",            //修改音频
  modVideo:"modVideo",            //修改视频

  delAudio:"delAudio",            //删除音频
  delVideo:"delVideo",            //删除视频
  delFile:"delFile",              //删除文件
  delImage:"delImage",            //删除图片
  
  getAudioDuration:"getAudioDuration",//获取音频时长
  getVideoCover:"getVideoCover",

  uploadFile:"uploadFile"
}

//获取图片列表
export function getImgList(data={}) {
  return $axios.post(api.getImgList, data)
}

export function getAudioList(data={}) {
  return $axios.post(api.getAudioList, data)
}

export function getVideoList(data={}) {
  return $axios.post(api.getVideoList, data)
}

export function getFileList(data={}) {
  return $axios.post(api.getFileList, data)
}

//获取图片分组列表
export function getResGroups(data={}) {
  return $axios.post(api.getResGroups, data)
}

//新增分组
export function addResGroup(data={}) {
  return $axios.post(api.addResGroup, data)
}

//删除分组
export function delResGroup(data={}) {
  return $axios.post(api.delResGroup, data)
}

//音频
export function addAudio(data={}) {
  return $axios.post(api.addAudio, data)
}

//删除音频
export function delAudio(data={}) {
  return $axios.post(api.delAudio, data)
}

//修改
export function modAudio(data={}) {
  return $axios.post(api.modAudio, data)
}

//删除音频
export function delVideo(data={}) {
  return $axios.post(api.delVideo, data)
}

export function modFile(data={}) {
  return $axios.post(api.modFile, data)
}

export function delFile(data={}) {
  return $axios.post(api.delFile, data)
}

export function addVideo(data={}) {
  return $axios.post(api.addVideo, data)
}

export function modVideo(data={}) {
  return $axios.post(api.modVideo, data)
}

export function addFile(data={}) {
  return $axios.post(api.addFile, data)
}

export function delImage(data={}) {
  return $axios.post(api.delImage, data)
}


export function uploadFile(data){
  return $axios.post(api.uploadFile,data)
}

export function getAudioDuration(data={}) {
  return $axios.post(api.getAudioDuration, data)
}
export function getVideoCover(data={}) {
  return $axios.post(api.getVideoCover, data)
}


