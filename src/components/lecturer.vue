<template>
  <div class="lecturer">
    <!-- 讲师标题 -->
    <div class="lecturer_title">讲师</div>
    <!-- 讲师筛选 -->
    <div class="lecturer_filter">
      <div class="filter_title">讲师筛选</div>
      <div class="filter_content">
        <el-form
          ref="form"
          class="content_form"
          :inline="true"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="上传时间">
            <el-date-picker
              v-model="form.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.name"
              placeholder="请输入课程标题或关键字"
              style="width: 276px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onFilter"
              style="background: #409f8b;"
            >
              <i class="iconfont">&#xe68a;</i>
              筛选</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 讲师列表 -->
    <div class="lecturer_list">
      <div class="list_title">
        讲师列表
        <div class="list_add" @click="JumpTo('addlecturer')">添加讲师</div>
      </div>
      <div class="list_content">
        <div class="content_table">
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"> </el-table-column>

            <el-table-column prop="teacherName" label="讲师名称" width="180">
            </el-table-column>
            <el-table-column prop="imgUrl" label="讲师头像" width="180">
              <template slot-scope="scope">
                <el-image class="tablie_img" :src="scope.row.imgUrl"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="description_short"
              label="讲师简介"
              width="180"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="JumpTo('changelecturer', scope.row.id)"
                  style="color:#000"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  @click="
                    delData(scope.$index, scope.row, '/api/deleteTeacher')
                  "
                  style="color:red"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content_bottom">
          <div class="table_checkbox" style="margin: 20px 20px">
            <el-checkbox
              class="checkboxall"
              v-model="allSelect"
              @change="allSelection(tableData)"
            >
              <span>全选</span></el-checkbox
            >
          </div>
          <!-- 分页组件 -->
          <div class="content_pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="psize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dataTotal"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import index from "@/mixins/index.js";

export default {
  mixins: [index],
  data() {
    return {
      form: {
        name: "",
        date: ""
      },
      tableData: [],
      currentPage: 1,
      allData: [],
      dataTotal: 0,
      psize: 10,
      multipleSelection: [],
      allSelect: false
    };
  },
  mounted() {
    this.getAll();
  },
  methods: {
    getAll() {
      this.getData("/api/teacherList", { teacherName: this.form.name }, res => {
        console.log(res);
        this.allData = res.data.list;
        this.dataTotal = this.allData.length;
        this.sliceData();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.lecturer {
  width: 1212px;
  padding: 36px;
  .lecturer_title {
    font-weight: bold;
    font-size: 14px;
  }
  .lecturer_filter {
    width: inherit;
    height: 154px;
    background: #fff;
    padding: 32px;
    margin-top: 42px;
    box-sizing: border-box;
    .filter_title {
      font-weight: bold;
    }
    .filter_content {
      margin-top: 24px;
      .content_form {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .lecturer_list {
    margin-top: 20px;
    background: #fff;
    .list_title {
      font-weight: bold;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      .list_add {
        width: 102px;
        height: 42px;
        background: #409f8b;
        text-align: center;
        line-height: 42px;
        color: #fff;
        font-weight: normal;
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .list_content {
      padding: 32px;
      .content_table {
        .table_cell {
          text-align: center;
        }
        .tablie_img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
        }
      }
      .content_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .table_checkbox {
          span {
            font-size: 12px;
          }
          // .checkboxall {
          //   margin-left: 4px;
          // }
          .batchdel {
            color: red;
            margin-left: 24px;
          }
        }
        // .content_pagination {
        // }
      }
    }
    /deep/ .el-table td,
    /deep/ .el-table th {
      text-align: center;
    }
  }
}
</style>
