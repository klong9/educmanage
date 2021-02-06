<template>
  <div id="app">
    <div class="nav">
      <div class="line">教育后台管理系统</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        @select="handleSelect"
        background-color="#4A5259"
        text-color="#fff"
        :default-openeds="openeds"
        router
      >
        <el-menu-item class="menu_item" index="/">
          <i class="iconfont icon-shouye_crm"></i>
          <span>首页</span>
        </el-menu-item>
        <el-submenu index="cour">
          <template slot="title">
            <i class="iconfont">&#xe624;</i>
            <span>课程管理</span>
          </template>
          <el-menu-item class="menu_item" index="courses">
            课程列表
          </el-menu-item>
          <el-menu-item class="menu_item" index="addcourse">
            添加课程
          </el-menu-item>
        </el-submenu>

        <el-submenu index="lec">
          <template slot="title">
            <i class="iconfont">&#xe625;</i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="lecturer">讲师列表</el-menu-item>
          <el-menu-item index="addlecturer">添加讲师</el-menu-item>
        </el-submenu>
        <el-submenu index="art">
          <template slot="title">
            <i class="iconfont">&#xe73a;</i>
            <span>资讯管理</span>
          </template>
          <el-menu-item index="article">文章列表</el-menu-item>
          <el-menu-item index="addarticle">添加文章</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="router">
      <div class="router_top">
        <el-badge :value="12" class="item">
          <i class="iconfont">&#xe890;</i>
        </el-badge>
        <div class="top_right">
          <div class="login" @click="JumpTo('login')" v-if="!logined">
            <span>请登录</span>
          </div>
          <div class="logined" v-if="logined" @click="JumpTo('login')">
            <img
              src="https://modao.cc/uploads4/images/4580/45801776/v2_q7bljj.png"
              alt=""
            />
            <span>{{ user }}<i class="iconfont">&#xe665;</i></span>
          </div>
        </div>
      </div>
      <div class="router_content">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import index from "@/mixins/index.js";

export default {
  mixins: [index],
  name: "App",
  data() {
    return {
      activeIndex: "/",
      openeds: ["cour", "art", "lec"],
      // logined: false,
      user: ""
    };
  },
  mounted() {
    this.changeIndex();
    this.user = localStorage.getItem("email");
  },
  methods: {
    handleSelect(key, keyPath) {
      sessionStorage.setItem("index", key);
      // console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    changeIndex() {
      this.activeIndex = sessionStorage.getItem("index");
    }
  },
  computed: {
    logined: function() {
      if (this.user) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    $route: function() {
      if (
        this.$route.name === "addcourse" ||
        this.$route.name === "addarticle" ||
        this.$route.name === "addlecturer"
      ) {
        sessionStorage.setItem("index", this.$route.name);
        this.changeIndex();
      }
    }
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-size: 16px;
  display: flex;
  background: #f0f0f0;
  .nav {
    background: #4a5259;
    .line {
      background: #38a28a;
      width: 240px;
      line-height: 84px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      border-right: 1px solid #63b4a2;
    }
    .el-menu-demo {
      width: 240px;
      height: initial;
      padding-top: 24px;
      .menu_item {
        i {
          margin-right: 4px;
        }
      }

      /deep/ .is-active {
        background: #38a28a !important;
        color: #fff;
      }
    }
  }
  .router {
    width: 100%;
    .router_top {
      width: inherit;
      height: 84px;
      box-sizing: border-box;
      background: #38a28a;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .item {
        color: #fff;
        margin: 0 16px;
        i {
          font-size: 24px;
        }
      }
      .top_right {
        height: 84px;
        display: flex;
        justify-content: end;
        align-items: center;
        float: right;
        border-left: 1px solid #63b4a2;
        margin-right: 56px;
        .login {
          margin: 0 24px;
          color: #fff;
          // font-weight: bold;
          cursor: pointer;
        }
        .logined {
          display: flex;
          align-items: center;
          img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            margin: 0 24px;
          }
          span {
            color: #fff;
            font-weight: bold;
            cursor: pointer;
            i {
              margin: 0 4px;
            }
          }
        }
      }
    }
    .router_content {
      width: 100%;
      // background: #f0f0f0;
    }
  }
}
</style>
