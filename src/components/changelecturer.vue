<template>
  <div class="changelecturer">
    <div class="changelecturer_title">
      <div>
        <span>讲师</span>
        <span class="title_sep">/</span>
        <span>修改讲师</span>
      </div>

      <div class="title_back" @click="back">返回</div>
    </div>
    <div class="changelecturer_content">
      <div class="content_title">请填写讲师相关信息</div>
      <div class="content_from">
        <el-form
          id="el_form"
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="讲师名称" prop="teacherName">
            <el-input
              v-model="form.teacherName"
              placeholder="请输入名称"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师头像" prop="teacherImg">
            <!-- 上传组件 -->
            <el-input class="upimg" v-model="form.teacherImg"></el-input>
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
                @change="handleAvatarSuccess('teacherImg')"
              />
            </div>
          </el-form-item>

          <el-form-item label="个人简介" prop="description_short">
            <el-input
              type="textarea"
              v-model="form.description_short"
              placeholder="请输入内容"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="详细介绍" prop="description_detail">
            <el-input
              type="textarea"
              v-model="form.description_detail"
              placeholder="请输入内容"
              rows="8"
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
        teacherName: "",
        teacherImg: "",
        description_short: "",
        description_detail: ""
      },
      rules: {
        teacherName: [
          { required: true, message: "请输入讲师名称", trigger: "blur" }
        ],
        teacherImg: [
          {
            required: true,
            message: "请上传讲师头像",
            trigger: "blur"
          }
        ],

        description_short: [
          { required: true, message: "请输入个人简介", trigger: "blur" }
        ],
        description_detail: [
          { required: true, message: "请输入详细介绍", trigger: "blur" }
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
        if (i === "teacherImg") {
          formdata.append(i, this.imgfile);
        } else {
          formdata.append(i, this.form[i]);
        }
      }

      // this.postData("/api/addOrChangeTeacher", formdata, res => {
      //   console.log(res);
      // });
      this.$axios({
        method: "post",
        url: "/api/addOrChangeTeacher",
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
      this.getData("/api/teacherDetail", { id: id }, res => {
        console.log(res);
        let formdetail = res.data.data;
        for (const key in formdetail) {
          if (key === "imgUrl") {
            this.imageUrl = formdetail[key];
            formdetail.teacherImg = this.imageUrl;
          }
        }
        this.form = formdetail;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.changelecturer {
  width: 1212px;
  padding: 36px;
  .changelecturer_title {
    display: flex;
    justify-content: space-between;
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
      text-align: center;
      line-height: 24px;
      background: #38a28a;
      cursor: pointer;
      color: #fff;
    }
  }
  .changelecturer_content {
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
