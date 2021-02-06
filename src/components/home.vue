<template>
  <div class="home">
    <div class="home_title">首页</div>
    <div class="home_revenue">
      <span class="revenue_title">营收概况</span>
      <div class="revenue_lis">
        <div class="revenue_li li_first">
          <i class="iconfont">&#xe674;</i>
          <div class="li_content">
            <span>今日订单收入</span>
            <span class="li_price" v-if="total"
              >￥{{ total.today_income }}</span
            >
          </div>
        </div>
        <div class="revenue_li li_second">
          <i class="iconfont">&#xe674;</i>
          <div class="li_content">
            <span>今日订单数量</span>
            <span class="li_price" v-if="total">{{ total.today_order }}</span>
          </div>
        </div>
        <div class="revenue_li li_tree">
          <i class="iconfont">&#xe674;</i>
          <div class="li_content">
            <span>七日内订单数量</span>
            <span class="li_price" v-if="total">{{ total.seven_income }}</span>
          </div>
        </div>
        <div class="revenue_li li_four">
          <i class="iconfont">&#xe674;</i>
          <div class="li_content">
            <span>七日内订单收入</span>
            <span class="li_price" v-if="total">￥{{ total.seven_order }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="home_revenue">
      <span class="revenue_title">待办事项</span>
      <div class="revenue_lis">
        <div class="revenue_li">
          <div class="li_icon icon_1"><i class="iconfont">&#xe627;</i></div>
          <div class="li_content two_content">
            <span class="two_num" v-if="todo">{{ todo.wait_pay }}</span>
            <span>待付款订单</span>
          </div>
        </div>
        <div class="li_sep"></div>
        <div class="revenue_li">
          <div class="li_icon icon_2"><i class="iconfont">&#xe620;</i></div>
          <div class="li_content two_content">
            <span class="two_num" v-if="todo">{{ todo.wait_confirm }}</span>
            <span>待确认订单</span>
          </div>
        </div>
        <div class="li_sep"></div>

        <div class="revenue_li">
          <div class="li_icon icon_3"><i class="iconfont">&#xe68f;</i></div>
          <div class="li_content two_content">
            <span class="two_num" v-if="todo">{{ todo.wait_backmoney }}</span>
            <span>待处理订单</span>
          </div>
        </div>
      </div>
    </div>
    <div class="home_statistics">
      <div class="statistics_title">营收统计</div>
      <div class="statistics_items">
        <div class="items_left">
          <span
            >本周订单总数：<i v-if="total">{{ total.seven_order }}</i></span
          >
          <span
            >本周订单总额：<i v-if="total">￥{{ total.seven_income }}</i></span
          >
        </div>
        <div class="items_right">
          <span :class="[isWeek ? 'action' : '']" @click="setEchats('week')"
            >本周</span
          >
          <span :class="[isWeek ? '' : 'action']" @click="setEchats('month')"
            >本月</span
          >
        </div>
      </div>
      <div class="echarts" ref="chart"></div>
    </div>
  </div>
</template>

<script>
import index from "@/mixins/index.js";
export default {
  mixins: [index],
  data() {
    return {
      isWeek: true,
      myChart: {},
      data: {},
      selectPeriod: ""
    };
  },
  mounted() {
    this.myChart = this.$echarts.init(this.$refs.chart);
    this.getData("/api/homeindex", "", res => {
      console.log(res.data);
      this.data = res.data;
      this.setEchats();
    });
  },
  methods: {
    setEchats(str) {
      this.isWeek = str === "month" ? false : true;
      let d =
        str === "month"
          ? this.data.income_detail.month
          : this.data.income_detail.week;
      this.myChart.setOption({
        xAxis: {
          type: "category",
          data: d.xalin
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "line",
            data: d.yalin
          }
        ]
      });
    }
  },
  computed: {
    total: function() {
      return this.data.income_total;
    },
    todo: function() {
      return this.data.todo;
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  width: 1212px;
  margin: 40px;
  background: #f0f0f0;
  .home_title {
    font-weight: bold;
  }
  .home_revenue {
    width: inherit;
    height: 220px;
    background: #fff;
    padding: 36px 32px;
    margin-top: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    .revenue_title {
      font-weight: bold;
    }
    .revenue_lis {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      .revenue_li {
        width: 264px;
        height: 106px;
        border-radius: 4px;
        color: #fff;
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 0 36px;
        box-sizing: border-box;
        i {
          font-size: 42px;
        }
        .li_content {
          margin-left: 24px;
          span {
            font-size: 12px;
            display: block;
          }
          .li_price {
            font-size: 20px;
            font-weight: bold;
            line-height: 30px;
          }
        }
        .two_content {
          color: #000;
          text-align: center;
          .two_num {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 16px;
          }
        }
        .li_icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          text-align: center;
          line-height: 54px;
          i {
            font-size: 30px;
          }
        }
        .icon_1 {
          background: #fbc934;
        }
        .icon_2 {
          background: #14a5e8;
        }
        .icon_3 {
          background: #f64231;
        }
      }
      .li_sep {
        width: 1px;
        height: 56px;
        background: #d6d6d6;
      }
      .li_first {
        background: #ff7970;
      }
      .li_second {
        background: #ffd344;
      }
      .li_tree {
        background: #648cfe;
      }
      .li_four {
        background: #4fcbaf;
      }
    }
  }
  .home_statistics {
    padding: 36px 32px;
    background: #fff;
    margin-top: 20px;
    .statistics_title {
      font-weight: bold;
    }
    .statistics_items {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      .items_left {
        margin-left: 84px;
        span {
          margin-left: 54px;
        }
      }
      .items_right {
        span {
          margin-left: 18px;
          cursor: pointer;
        }
        .action {
          color: #4fcbaf;
        }
      }
    }
    .echarts {
      width: inherit;
      height: 500px;
    }
  }
}
</style>
