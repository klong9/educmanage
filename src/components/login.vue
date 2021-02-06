<template>
  <div class="login">
    <div class="login_top">
      <span>教育后台管理系统</span>
    </div>
    <div class="login_content">
      <el-form
        id="loginform"
        ref="form"
        status-icon
        :model="form"
        :rules="rules"
        label-width="72px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import index from "@/mixins/index.js";
export default {
  mixins: [index],
  data() {
    var emailtest = (rule, value, callback) => {
      const zz = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (value === "") {
        callback(new Error("邮箱不能为空"));
      } else if (!zz.test(value)) {
        callback(new Error("邮箱错误"));
      } else {
        callback();
      }
    };
    return {
      form: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            required: true,
            validator: emailtest,
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "请选择密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      var formdata = new FormData();
      formdata.append("email", this.form.email);
      formdata.append("password", this.form.password);
      console.log(formdata);
      this.$axios({
        method: "post",
        url: "/api/login",
        headers: {
          "Content-Type": "application/x-www-form-ulrencoded"
        },

        data: formdata
      }).then(res => {
        console.log(res);
        if (res.data.code === "Y") {
          localStorage.setItem("email", this.form.email);
          localStorage.setItem("password", this.form.password);
          this.JumpTo(sessionStorage.getItem("index"));
        }
      });
    },
    onReset() {
      this.$refs["form"].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 480px;
  height: 321px;
  margin: 162px auto;
  background: #fff;
  font-weight: bold;
  border-radius: 8px;
  .login_top {
    line-height: 72px;
    text-align: center;
  }
  .login_content {
    padding: 42px;
    box-sizing: border-box;
  }
}
</style>
