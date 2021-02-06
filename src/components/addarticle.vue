<template>
  <div class="addarticle">
    <div class="addarticle_title">
      <span>文章</span>
      <span class="title_sep">/</span>
      <span>添加文章</span>
      <div class="title_back" @click="back">返回</div>
    </div>
    <div class="addarticle_content">
      <div class="content_title">请填写文章相关信息</div>
      <div class="content_from">
        <el-form
          id="el_form"
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入标题"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章封面" prop="coverImg">
            <!-- 上传组件 -->
            <el-input class="upimg" v-model="form.coverImg"></el-input>
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
                @change="handleAvatarSuccess('coverImg')"
              />
            </div>
          </el-form-item>

          <el-form-item label="文章描述" prop="article_short">
            <el-input
              type="textarea"
              v-model="form.article_short"
              placeholder="请输入内容"
              style="width:320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章内容" prop="article_content">
            <el-input
              type="textarea"
              v-model="form.article_content"
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
              >立即添加</el-button
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
        title: "",
        coverImg: "",
        article_short: "",
        article_content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        coverImg: [
          {
            required: true,
            message: "请上传文章封面",
            trigger: "blur"
          }
        ],

        article_short: [
          { required: true, message: "请输入文章描述", trigger: "blur" }
        ],
        article_content: [
          { required: true, message: "请输入文章内容", trigger: "blur" }
        ]
      },
      imageUrl: "",
      imgfile: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.messageBox(next);
  },
  methods: {
    // 获取数据
    changeFormdata() {
      const formdata = new FormData();
      for (let i in this.form) {
        if (i === "coverImg") {
          formdata.append(i, this.imgfile);
        } else {
          formdata.append(i, this.form[i]);
        }
      }

      this.$axios({
        method: "post",
        url: "/api/addOrChangeArticle",
        data: formdata
      }).then(res => {
        console.log(res);
        if (res.data.result.code === "Y") {
          this.opento("success", res.data.result.msg);
        } else {
          this.opento("warning", res.data.result.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addarticle {
  width: 1212px;
  padding: 36px;
  .addarticle_title {
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
  .addarticle_content {
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
