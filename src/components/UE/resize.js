import { EmbedPlaceholder   } from 'quill-resize-module';

class TagPlaceholder extends EmbedPlaceholder {}
TagPlaceholder.tagName = ['iframe', 'embed']
// replace default video blot
class VideoPlaceholder extends EmbedPlaceholder {
  static create (value) {
    let video = value
    if (typeof value === 'string') {
      video = {
        'data-embed-source': encodeURIComponent(
          `<video src="${value}" controls preload="auto"></video>`
        ),
        'data-type': 'video',
        'data-src': value
      }
    }
    return super.create(video)
  }
}
VideoPlaceholder.blotName = 'video'
VideoPlaceholder.tagName = 'video'

class ClassPlaceholder extends EmbedPlaceholder {}
ClassPlaceholder.className = 'ql-embed'

export {
  ClassPlaceholder,VideoPlaceholder,TagPlaceholder
}