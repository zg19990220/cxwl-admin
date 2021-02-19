export function tofixed(number, n = 2){
  if (typeof (number * 1) != "number" || isNaN(number * 1)) return "";
  let a, b;
  a = number.toString().split(".");
  if (a.length == 1) return a[0] * 1;
  b = a[0] + "." + a[1].substr(0, n);
  return b * 1;
}


/*****************************/
//数组拍平
export function flat(arr) {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flat(next) : next);
  }, []);
}
//在上一级追加mate的menu_id属性
export function formatUserGrade(data) {
  return data.map((item) => {
    item.menu_id = item.meta.menu_id;
    item.children && formatUserGrade(item.children);
    return item;
  });
}
//获取所有子节点menu_id 用于格式化tree组件 获取所有不包含children的节点的menu_id
export function getChildMenuId(data) {
  return data.map((item) => {
    if (item.children) {
      return [...getChildMenuId(item.children)];
    } else {
      //为了后续拍平数组
      return [item.menu_id];
    }
  });
}

export function getPower(menu){
  return flat(getChildMenuId(formatUserGrade(menu)))
}
/*****************************/