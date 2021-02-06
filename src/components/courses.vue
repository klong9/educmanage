<template>
  <div class="courses">
    <!-- 标题模块 -->
    <div class="courses_title">
      <span>课程管理</span>
      <span class="title_sep">/</span>
      <span>活动管理</span>
    </div>
    <!-- 课程筛选模块 -->
    <div class="courses_filter">
      <div class="filter_title">课程筛选</div>
      <!-- 筛选功能 -->
      <div class="filter_content">
        <el-form
          ref="form"
          class="content_form"
          :rules="rules"
          :inline="true"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="上架状态" prop="putshelf">
            <el-select
              v-model="form.putshelf"
              placeholder="请选择"
              style="width: 128px"
            >
              <el-option label="全部" value="trueAndFalse"></el-option>
              <el-option label="上架" value="true"></el-option>
              <el-option label="下架" value="false"></el-option>
            </el-select>
          </el-form-item>
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
              style="background: #409f8b"
            >
              <i class="iconfont">&#xe68a;</i>
              筛选</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 课程列表模块 -->
    <div class="courses_list">
      <div class="list_title">
        课程列表
        <div class="list_add" @click="JumpTo('addcourse')">添加课程</div>
      </div>
      <!-- 列表 -->
      <div class="list_content">
        <!-- 列表组件 -->
        <div class="content_table">
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"> </el-table-column>

            <el-table-column prop="id" label="编号" width="180">
            </el-table-column>

            <el-table-column prop="courseName" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="imgUrl" label="封面" width="180">
              <template slot-scope="scope">
                <el-image class="tablie_img" :src="scope.row.imgUrl"></el-image>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.status | filter_status }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格"> </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="JumpTo('changecourse', scope.row.id)"
                  style="color:#000"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  @click="delData(scope.$index, scope.row, '/api/deleteCourse')"
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
            <span class="batchdel">批量删除</span>
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
        putshelf: "trueAndFalse",
        date: ""
      },
      rules: {
        putshelf: [
          { required: true, message: "请选择上架状态", trigger: "change" }
        ]
      },
      tableData: [],
      allData: [],
      dataTotal: 0,
      currentPage: 1,
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
      this.getData("/api/courseList", { status: this.form.putshelf }, res => {
        console.log(res);
        this.allData = res.data.list;
        this.dataTotal = this.allData.length;
        this.sliceData();
      });
    }
  },
  filters: {
    filter_status: function(val) {
      return val === "true" ? "上架" : "下架";
    }
  }
};
</script>

<style lang="less" scoped>
.courses {
  width: 1212px;
  padding: 36px;
  .courses_title {
    span {
      font-weight: bold;
      font-size: 14px;
    }
    .title_sep {
      font-weight: normal;
      color: #b6b7bb;
    }
  }
  .courses_filter {
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
  .courses_list {
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
