<template>
  <div class="className">
    <el-tabs
      type="border-card"
      v-model="active"
      @tab-click="change"
      @tab-remove="delResGroup"
    >
      <el-tab-pane label="全部" name="0"> </el-tab-pane>
      <el-tab-pane
        v-for="item in groupList"
        :name="item.group_id"
        :key="item.group_id"
        closable
        :label="item.group_name"
      >
      </el-tab-pane>
    </el-tabs>
    <el-card class="anoCard">
      <div slot="header" class="doc-header">
        <span>图文消息</span>
        <div>
          <el-popover
            placement="right"
            v-model="disabled"
            width="300"
            trigger="click"
          >
            <div class="addGroup">
              <el-input
                v-model="group_name"
                placeholder="请输入组名"
              ></el-input>
              <div class="add-btn">
                <el-button type="primary" @click="addResGroup">添加</el-button>
              </div>
            </div>
            <el-button
              slot="reference"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              >新增分组</el-button
            >
          </el-popover>
          <el-button
            icon="el-icon-plus"
            @click="toAdd"
            style="margin-left: 10px"
            size="mini"
            type="primary"
            >新增图文消息</el-button
          >
        </div>
      </div>
      <div class="box">
        <el-table
          border
          :data="docData.list"
          style="width: 100%"
          height="600px"
        >
          <el-table-column prop="doc_id" label="id"></el-table-column>
          <el-table-column prop="cover" label="封面">
            <template slot-scope="scope">
              <BaseElImage
                :custom_style="{ width: '50px', height: '50px' }"
                :custom_src="scope.row.cover"
                fit="cover"
                :previewList="[scope.row.cover]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="doc_url" label="地址">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :href="`${base_img}h5/index.html?doc_id=${scope.row.doc_id}`"
                >预览</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column prop="create_time" label="操作">
            <template slot-scope="scope">
              <el-link
                type="primary"
                class="link"
                @click="edit(scope.row)"
                :underline="false"
                >编辑</el-link
              >
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                confirmButtonType="danger"
                @confirm="del(scope.row)"
              >
                <el-link
                  slot="reference"
                  type="danger"
                  class="link"
                  :underline="false"
                  >删除</el-link
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination :data="docData" @change="getDocList" />
      </div>
    </el-card>
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import {
  getDocList,
  delDoc,
  addResGroup,
  delResGroup,
  getResGroups,
} from "@/api/doc";
import { mapGetters } from "vuex";
export default {
  name: "media.doc",
  components: { pagination },
  data() {
    return {
      docData: {},
      groupList: [],
      group_name: "",
      active: "0",
      disabled: false,
    };
  },
  computed: {
    ...mapGetters(["base_img"]),
  },
  created() {
    this.getDocList();
    this.getResGroups();
  },
  activated() {
    if (this.$route.params.refresh) {
      this.getDocList();
      this.getResGroups();
      this.$route.params.refresh = false;
    }
  },
  filters: {},
  methods: {
    toAdd() {
      this.$router.push({
        name: `media.add`
      });
    },
    change(e) {
      this.getDocList();
    },
    getResGroups() {
      getResGroups({ group_type: 4 }).then((res) => {
        if (res.code == 0) {
          this.groupList = res.data;
        }
      });
    },
    delResGroup(group_id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delResGroup({ group_id }).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getResGroups();
            this.active = "0";
          }
        });
      });
    },
    addResGroup() {
      let { group_name, active: group_id } = this;
      addResGroup({ group_type: 4, group_name, group_id }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.disabled = false;
          this.group_name = "";
          this.getResGroups();
        }
      });
    },
    getDocList(page = 1) {
      let group_id = this.active;
      getDocList({ page, group_id }).then((res) => {
        if (res.code == 0) {
          this.docData = res.data;
        }
      });
    },
    edit(row) {
      console.log(row.doc_id);
      this.$router.push({
        name: `media.edit`,
        params: {
          doc_id: row.doc_id,
        },
      });
    },
    del(row) {
      console.log(row);
      delDoc({ doc_id: row.doc_id }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            duration: 1000,
            type: "success",
          });
          this.getDocList();
        }
      });
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
::v-deep {
  .el-tabs--border-card .el-tabs__content {
    padding: 0;
  }
  .el-tabs--border-card {
    border-bottom: none;
  }
}
.box {
  .item {
    padding-bottom: 50px;
    width: 300px;
    h2 {
      font-size: 18px;
      padding-bottom: 20px;
    }
  }
}
.link {
  margin-right: 10px;
}
.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination {
  padding-top: 20px;
  text-align: right;
}
.addGroup {
  display: flex;
  .add-btn {
    margin-left: 10px;
  }
}
</style>
