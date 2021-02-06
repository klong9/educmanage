<template>
  <div class="changecourse">
    <div class="changecourse_title">
      <span>课程管理</span>
      <span class="title_sep">/</span>
      <span>修改课程</span>
      <div class="title_back" @click="back">返回</div>
    </div>
    <div class="changecourse_content">
      <div class="content_title">请填写课程相关信息</div>
      <div class="content_from">
        <el-form
          id="el_form"
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="课程名称" prop="courseName">
            <el-input
              v-model="form.courseName"
              placeholder="请输入名称"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程封面" prop="courseImg">
            <!-- 上传组件 -->
            <el-input class="upimg" v-model="form.courseImg"></el-input>
            <div class="avatar-uploader" @click="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />

              <div v-else class="avatar-uploader-icon">
                <i class="el-icon-plus"></i>
                <span>上传图片</span>
              </div>
              <input
                class="upimg"
                ref="from_img"
                type="file"
                @change="handleAvatarSuccess('courseImg')"
              />
            </div>
          </el-form-item>
          <el-form-item label="课程状态">
            <span :class="[form.status ? '' : 'isput']">下架状态</span>
            <el-switch v-model="form.status" active-color="#13C75B"></el-switch>
            <span :class="[form.status ? 'isput' : '']">上架状态</span>
          </el-form-item>
          <el-form-item label="课程价格" prop="price">
            <el-input
              type="price"
              v-model.number="form.price"
              auto-complete="off"
              placeholder="请输入金额"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="description_course">
            <el-input
              type="textarea"
              v-model="form.description_course"
              placeholder="请输入内容"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师介绍" prop="description_teacher">
            <el-input
              type="textarea"
              v-model="form.description_teacher"
              placeholder="请输入内容"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="background: #38a28a;"
              @click="onSubmit('form')"
              >立即修改</el-button
            >
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
        </el-form>
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
      canSubmit: true,
      alterform: {},
      form: {
        courseName: "",
        courseImg: "",
        status: false,
        price: "",
        description_course: "",
        description_teacher: ""
      },
      rules: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        courseImg: [
          {
            required: true,
            message: "请上传课程封面",
            trigger: "blur"
          }
        ],
        price: [
          { required: true, message: "请输入课程价格", trigger: "blur" },
          { type: "number", message: "价格必须为数字值" }
        ],
        description_course: [
          { required: true, message: "请输入课程简介", trigger: "blur" }
        ],
        description_teacher: [
          { required: true, message: "请输入讲师介绍", trigger: "blur" }
        ]
      },
      imageUrl: "",
      imgfile: ""
    };
  },

  mounted() {
    let id = this.$route.query;
    this.getDetail(id);
  },
  methods: {
    // 获取数据
    changeFormdata() {
      const formdata = new FormData();
      for (let i in this.form) {
        if (i === "courseImg") {
          formdata.append(i, this.imgfile);
        } else {
          formdata.append(i, this.form[i]);
        }
      }

      this.$axios({
        method: "post",
        url: "/api/addOrChangeCourse",
        data: formdata
      }).then(res => {
        console.log(res);
        if (res.data.result.code === "Y") {
          this.opento("success", res.data.result.msg);
        } else {
          this.opento("warning", res.data.result.msg);
        }
      });
    },
    // 获取数据详情
    getDetail(id) {
      this.getData("/api/courseDetail", { id: id }, res => {
        console.log(res);
        let formdetail = res.data.data;
        for (const key in formdetail) {
          if (key === "status") {
            formdetail[key] = formdetail[key] === "true" ? true : false;
          } else if (key === "imgUrl") {
            this.imageUrl = formdetail[key];
            formdetail.courseImg = this.imageUrl;
          } else if (key === "price") {
            formdetail[key] = JSON.parse(formdetail[key]);
          }
        }
        this.form = formdetail;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.changecourse {
  width: 1212px;
  padding: 36px;
  .changecourse_title {
    span {
      font-weight: bold;
      font-size: 14px;
    }
    .title_sep {
      font-weight: normal;
      color: #b6b7bb;
    }
    .title_back {
      width: 56px;
      height: 24px;
      font-size: 14px;
      border-radius: 4px;
      float: right;
      text-align: center;
      line-height: 24px;
      background: #38a28a;
      cursor: pointer;
      color: #fff;
    }
  }
  .changecourse_content {
    padding: 32px;
    margin-top: 42px;
    background: #fff;
    border-radius: 4px;
    // .content_title {
    // }
    .content_from {
      margin-top: 32px;
      .avatar-uploader {
        width: 84px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      // 上传组件
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 24px;
        color: #8c939d;
        width: 84px;
        height: 84px;
        padding: 12px 0;
        box-sizing: border-box;
        text-align: center;
        i {
          display: block;
        }
        span {
          font-size: 12px;
        }
      }
      .avatar {
        width: 84px;
        height: 84px;
        display: block;
      }
      .upimg {
        display: none;
      }
      .isput {
        color: #13c75b;
      }
    }
  }
}
</style>
