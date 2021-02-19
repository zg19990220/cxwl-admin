import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Message,
  MessageBox,
  Scrollbar,
  Menu,
  MenuItemGroup,
  Submenu,
  MenuItem,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Badge,
  Table,
  TableColumn,
  Tag,
  Tabs,
  TabPane,
  Timeline,
  TimelineItem,
  Card,
  Pagination,
  Notification,
  Dialog,
  DatePicker,
  Tree,
  Upload,
  Carousel,
  CarouselItem,
  CheckboxGroup,
  Checkbox,
  Image,
  Link,
  Popover,
  Loading,
  Popconfirm,
  Switch,
  Radio,
  divider,
  cascader,
  scrollbar
} from 'element-ui'


// 单例
let msg = null
function messageSingle(options, single = true) {
  //是否通行单例模式
  if (single) {
    // 判断是否已存在Message
    if (document.getElementsByClassName('el-message').length === 0) {
      msg = Message(options)
    } else {
      msg.close()
      msg = Message(options)
    }
  } else {
    Message(options)
  }
}
messageSingle.close = ()=>{
  msg.close()
}

Message.install = () => {
  Vue.prototype.$message = messageSingle
}

MessageBox.install = () => {
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
}
Notification.install = () => {
  Vue.prototype.$notify = Notification
}

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Message)
Vue.use(MessageBox)
Vue.use(Notification)
Vue.use(Scrollbar)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Badge)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Upload)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Image)
Vue.use(Link)
Vue.use(Popover)
Vue.use(Loading)
Vue.use(Popconfirm)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(divider)
Vue.use(cascader)
Vue.use(scrollbar)