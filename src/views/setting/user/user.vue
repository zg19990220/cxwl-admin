<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>系统用户列表</span>
      </div>
      <div class="searchDiv">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="
            modal = true;
            dialog_title = '添加系统用户';
          "
          >添加</el-button
        >
      </div>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column prop="userid" label="ID" width="120"></el-table-column>
        <el-table-column prop="user_name" label="用户名"></el-table-column>
        <el-table-column prop="role_name" label="角色名"></el-table-column>
        <el-table-column prop="phone" label="账号"></el-table-column>
        <el-table-column prop="status" label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button type="primary" size="mini" @click="pwdEdit(scope.row)"
              >修改密码</el-button
            >
            <el-popconfirm
              title="你确定要删除吗？"
              confirmButtonType="danger"
              @confirm="del(scope.row)"
              v-if="scope.row.is_delete == '0'"
            >
              <el-button
                type="danger"
                size="mini"
                slot="reference"
                style="margin-left: 8px"
                >删除</el-button
              >
            </el-popconfirm>
            <el-popconfirm
              title="你确定要恢复吗？"
              confirmButtonType="danger"
              @confirm="resumSysUser(scope.row)"
              v-else
            >
              <el-button
                type="success"
                size="mini"
                slot="reference"
                style="margin-left: 8px"
                >恢复</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialog_title"
      :visible.sync="modal"
      width="400px"
      :before-close="handleClose"
      @open="handleOpen"
    >
      <el-form label-width="auto" :model="userData">
        <el-form-item label="用户">
          <el-input v-model="userData.user_name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="userData.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="userData.roleid"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleList"
              :key="item.roleid"
              :label="item.role_name"
              :value="item.roleid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal = false">取 消</el-button>
        <el-button type="primary" v-show="!userData.userid" @click="addSysUser"
          >确 定</el-button
        >
        <el-button type="primary" v-show="userData.userid" @click="modSysUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="pwd_modal"
      width="30%"
      :before-close="handleClose"
      @open="handleOpen"
    >
      <el-form
        :model="pwdData"
        status-icon
        :rules="editPwdRules"
        ref="editPwd"
        label-width="auto"
      >
        <el-form-item label="新密码" prop="user_pass">
          <el-input
            type="password"
            v-model="pwdData.user_pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="pwdData.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwd_modal = false">取 消</el-button>
        <el-button type="primary" @click="modSysUserPwd">确 定</el-button>
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
  getSysUserList,
  addSysUser,
  modSysUser,
  delSysUser,
  modSysUserPwd,
  resumSysUser,
} from "@/api/setting";
import { getUserGrade } from "@/api/login";
export default {
  name: "setting.user",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdData.user_pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userList: [],
      modal: false,
      pwd_modal: false,
      gradeList: [],
      roleList: [],
      userData: {
        user_name: "",
        phone: "",
        roleid: "",
      },
      pwdData: {
        userid: "",
        user_pass: "",
        checkPass: "",
      },
      editPwdRules: {
        user_pass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符之间",
            trigger: "blur",
          },
        ],
        checkPass: [
          { validator: validatePass, trigger: "blur" },
          { required: true, trigger: "blur" },
        ],
      },
      dialog_title: "添加系统用户",
    };
  },
  async created() {
    await this.getSysUserList();
    // this.getSysRoleList();
  },
  filters: {},
  methods: {
    handleOpen() {
      this.getSysRoleList();
    },
    handleClose(done) {
      this.userData = {
        user_name: "",
        phone: "",
        roleid: "",
      };
      this.pwdData = {
        userid: "",
        user_pass: "",
        checkPass: "",
      };
      console.log(this.$refs);
      if (this.$refs["editPwd"]) {
        this.$refs["editPwd"].resetFields();
      }
      done();
    },
    edit(item) {
      this.dialog_title = "编辑";
      let userData = this.userData;
      userData.roleid = item.roleid;
      userData.user_name = item.user_name;
      userData.phone = item.phone;
      userData.userid = item.userid;
      this.userData = userData;
      this.modal = true;
    },
    pwdEdit(item) {
      this.pwdData.userid = item.userid;
      this.pwd_modal = true;
    },
    modSysUserPwd() {
      this.$refs.editPwd.validate((valid) => {
        if (valid) {
          let { user_pass, userid } = this.pwdData;
          modSysUserPwd({ user_pass, userid }).then((res) => {
            if (res.code == 0) {
              this.pwd_modal = false;
              this.$message({
                message: "修改成功",
                type: "success",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    del(item) {
      let { userid } = item;
      delSysUser({ userid }).then((res) => {
        if (res.code == 0) {
          this.getSysUserList();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        }
      });
    },
    resumSysUser(item) {
      let { userid } = item;
      resumSysUser({ userid }).then((res) => {
        if (res.code == 0) {
          this.getSysUserList();
          this.$message({
            message: "恢复成功",
            type: "success",
          });
        }
      });
    },
    modSysUser() {
      modSysUser({ ...this.userData }).then((res) => {
        if (res.code == 0) {
          this.modal = false;
          this.getSysUserList();
          this.$message({
            message: "编辑成功",
            type: "success",
          });
        }
      });
    },
    addSysUser() {
      addSysUser({ ...this.userData }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.modal = false;
          this.getSysUserList();
          this.$message({
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    getSysUserList() {
      getSysUserList().then((res) => {
        this.userList = res.data;
      });
    },
    getSysRoleList() {
      getSysRoleList().then((res) => {
        this.roleList = res.data;
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
  align-items: center;
  padding-bottom: 20px;
  .input {
    padding: 0 20px;
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
</style>
