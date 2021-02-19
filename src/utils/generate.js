//返回路由path 最前面不包含 / 
function findRoot(top, v) {
  for (let i = 0; i < top.length; i++) {
    if (top[i].name == v) return top[i].name
    if (top[i].children) {
      let temp = findRoot(top[i].children, v)
      if (temp) return top[i].name + '/' + temp
    }
  }
}

//这是路由所用的组件name 与 路由name 相同完成路由缓存效果
function getComponentName(top, v) {
  for (let i = 0; i < top.length; i++) {
    if (top[i].name == v) return top[i].name
    if (top[i].children) {
      let temp = getComponentName(top[i].children, v)
      if (temp) return top[i].name + '.' + temp
    }
  }
}

//生成路由对象
function route(item) {

  // 默认返回 路由
  let component = ()=>import("@/views/"+item.path); 

  if(!item.meta.no_route&&item.children){
    
    item.children.map(child=>{
      if(!child.meta.no_route){                    // 存在一个路由对象 返回一个包裹路由对象
        component = () => import("@/layout/view")  // 包裹路由对象
      }
    })
  }
  let route = {
    name: item.componentName,
    path: item.meta.isRoot?'/'+item.name:item.name,
    component,
    meta: item.meta,
    hidden:item.hidden || item.meta.no_route      // 是否在菜单显示 或者 该路由为 权限路由（只做权限控制，不生生产路由）
  }
  if (item.children) {                            // 添加子路由
    route.children = item.children
  }
  return  route                                    // 生成完毕
}

//递归函数
function recursive(menu, top) {
  return menu.map(item => {
    if (item.children) {
      item.children = recursive(item.children, top)
    }
    item.path = findRoot(top, item.name)
    item.componentName = getComponentName(top, item.name)
    return route(item)
  })
}

//入口
export default function generate(menu){
  //添加标记 是否为最外层路由
  menu.forEach(item=>{
    item.meta.isRoot = true
  })
  return recursive(menu, menu)
}
