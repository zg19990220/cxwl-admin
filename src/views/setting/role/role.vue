<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>角色权限列表</span>
      </div>
      <div class="searchDiv">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="add"
          >添加</el-button
        >
      </div>
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column prop="roleid" label="ID" width="120"></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名"
          width="200"
        ></el-table-column>
        <el-table-column prop="roleArr" label="权限">
          <template slot-scope="scope">
            <div class="role_wrap">
              <el-tag
                effect="plain"
                class="role_item"
                type="success"
                v-for="(item, index) in scope.row.roleArr"
                :key="index"
                >{{ item }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="200"
        ></el-table-column>
        <el-table-column prop="status" label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编辑</el-button
            >

            <el-popconfirm
              title="你确定要删除吗？"
              confirmButtonType="danger"
              @confirm="del(scope.row)"
            >
              <el-button
                type="danger"
                size="mini"
                slot="reference"
                style="margin-left: 8px"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title=""
      :visible.sync="modal"
      width="300px"
      @closed="handleClose"
    >
      <div class="role_name">
        <label>角色名称</label>
        <el-input class="input" v-model="roleData.role_name"></el-input>
      </div>
      <div>
        <label for>权限菜单</label>
        <div class="tree">
          <el-scrollbar class="scrollbar">
            <el-tree
              :default-expand-all="true"
              ref="tree"
              @check="nodeClick"
              :data="gradeList"
              show-checkbox
              node-key="menu_id"
              :check-strictly="false"
              :check-on-click-node="true"
              :expand-on-click-node="false"
              :default-checked-keys="roleData.role_grade"
              :props="{
                children: 'children',
                label: label,
              }"
            ></el-tree>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="modal = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          v-show="!roleData.roleid"
          @click="addSysRole"
          >确 定</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-show="roleData.roleid"
          @click="editRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSysRoleList,
  addSysRole,
  modSysRole,
  delSysRole,
} from "@/api/setting";
import { getUserGrade } from "@/api/login";
import { flat, formatUserGrade, getChildMenuId } from "@/utils/util";
export default {
  name: "setting.role",
  data() {
    return {
      roleList: [],
      modal: false,
      gradeList: [],
      roleData: {
        //编辑添加 对象
        roleid: "",
        role_grade: [],
        role_name: "",
      },
      destroy: false, //tree 组件需要v-if 否则重新渲染选中状态不重置
      childrenMenu_id: [], //所有不包含子元素的menu_id
    };
  },
  async created() {
    await this.getUserGrade();
    await this.getSysRoleList();
  },
  methods: {
    nodeClick(item, d) {
      let checked = d.checkedNodes.map((item) => {
        return item.menu_id;
      });
      let set = new Set([...checked, ...d.halfCheckedKeys]);

      this.roleData.role_grade = Array.from(set);
    },
    handleClose() {
      this.roleData = {};
      this.destroy = false;
      this.$refs.tree.setCheckedKeys([], true);
    },
    edit(item) {
      this.roleData = {};
      this.$set(this.roleData, "roleid", item.roleid);
      this.$set(this.roleData, "role_name", item.role_name);
      this.destroy = true;

      //过滤所有包含子节点的menu_id
      let arr = JSON.parse(item.role_grade).map((item) => {
        return this.childrenMenu_id.find((menu_id) => {
          return item == menu_id;
        });
      });

      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(arr, true);
      });
      this.modal = true;
    },
    add() {
      this.roleData = {};
      this.destroy = true;
      this.modal = true;
    },
    del(item) {
      let { roleid } = item;
      delSysRole({ roleid }).then((res) => {
        if (res.code == 0) {
          this.getSysRoleList();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        }
      });
    },
    //tree label属性
    label(data, node) {
      return data.meta.title;
    },
    editRole() {
      let { roleid, role_name, role_grade } = this.roleData;
      modSysRole({
        roleid,
        role_name,
        role_grade: JSON.stringify(role_grade),
      }).then((res) => {
        if (res.code == 0) {
          this.modal = false;
          this.getSysRoleList();
          this.$message({
            message: "编辑成功",
            type: "success",
          });
        }
      });
    },
    addSysRole() {
      let { role_grade, role_name } = this.roleData;
      role_grade &&
      role_name &&
      addSysRole({ role_grade: JSON.stringify(role_grade), role_name }).then(
        (res) => {
          if (res.code == 0) {
            this.modal = false;
            this.getSysRoleList();
            this.$message({
              message: "添加成功",
              type: "success",
            });
          }
        }
      );
    },
    async getSysRoleList() {
      await getSysRoleList().then((res) => {
        if (res.data) {
          console.log(res.data);
          res.data.forEach((item) => {
            item.roleArr =
              item.role_grade &&
              JSON.parse(item.role_grade)
                .map((itm) => {
                  return this.formatRole(itm);
                })
                .filter((item) => {
                  return typeof item != "undefined";
                });
          });
          this.roleList = res.data;
        } else {
          this.roleList = [];
        }
      });
    },
    //格式化列表权限返回title
    formatRole(role_grade) {
      var menu_data = this.gradeList;
      for (let i = 0; i < menu_data.length; i++) {
        if (role_grade == menu_data[i].meta.menu_id) {
          return menu_data[i].meta.title;
        }
        let children = menu_data[i].children;
        if (children) {
          for (let n = 0; n < children.length; n++) {
            if (children[n].meta.menu_id == role_grade) {
              return children[n].meta.title;
            }
          }
        }
      }
    },
    async getUserGrade() {
      await getUserGrade().then((res) => {
        if (res.code == 0) {
          res.data = formatUserGrade(res.data);

          this.gradeList = [...res.data];
          // 拍平数组
          this.childrenMenu_id = flat(getChildMenuId(res.data));
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.searchDiv {
  margin-bottom: 20px;
}
.fyDiv {
  float: right;
  margin-top: 30px;
}
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
.role_name {
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding-bottom: 20px;
  .input {
    padding-top: 10px;
    flex: 1;
    // width: 200px;
  }
}

.menu {
  padding-top: 10px;
}
.childsWrap {
  display: flex;
  padding: 10px 0;
  .childs {
    margin-left: 30px;
  }
}
.role_wrap {
  display: flex;
  flex-wrap: wrap;
}
.role_item {
  margin-right: 5px;
  margin-bottom: 5px;
}
.tree {
  height: 400px;
  .scrollbar {
    height: 100%;
    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden !important;
      }
    }
  }
}
</style>
