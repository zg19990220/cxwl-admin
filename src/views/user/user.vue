<template>
  <div class="className">
    <el-card class="anoCard">
      
      <div slot="header">
        <span>用户列表</span>
      </div>
      
      <div class="searchDiv">
        <div class="search-name">
          <el-input
            v-model="searchData.nickname"
            placeholder="请输入昵称"
          ></el-input>
        </div>
        <div class="search-name">
          <el-input
            v-model="searchData.phone"
            placeholder="请输入联系电话"
          ></el-input>
        </div>
        <div class="search-btn">
          <el-button type="success" @click="getUserList">搜索</el-button>
        </div>
      </div>

      <div class="box">
        <el-table :data="userData.list" border style="width: 100%">
          <el-table-column prop="nickname" label="昵称" >
          </el-table-column>
          <el-table-column prop="bind_phone" label="联系电话">
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
          </el-table-column>
        </el-table>
      </div>

      <pagination :data="userData" @change="getUserList"/>
    </el-card>
  </div>
</template>

<script>
import { userList } from "@/api/user";
import picLib from '@/components/PictureLibrary'
import pagination from '@/components/pagination'
export default {
  name: "user",
  components:{picLib,pagination},
  data() {
    return {
      searchData:{
        nickname:"",
        phone:""
      },
      userData:{}
    }
  },
  computed:{
    page(){
      return this.userData.page
    }
  },
  created() {
    this.getUserList()
  },
  filters: {
 
  },
  methods: {
    getUserList(page=1){
      let {nickname,phone}=this.searchData
      userList({page,nickname,phone}).then(res=>{
        if(res.code==0){
          this.userData = res.data
        }
      })
    }
  },
};
</script>
<style lang="scss">

</style>
