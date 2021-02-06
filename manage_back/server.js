const express = require("express");
// const formidable = require("formidable");
const formidableMiddleware = require("express-formidable");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(
  formidableMiddleware({
    encoding: "utf-8",
    uploadDir: `${__dirname}/image`,
    multiples: true, // req.files to be arrays of files
    keepExtensions: true,
  })
);
// app.use(express_formidable());

// 过如下代码就可以将 image 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了
app.use("/image", express.static(path.join(__dirname, "image")));

//接收post请求时，处理参数
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
var _ = require("underscore");

var month_arr = _.range(1, 31);
month_arr.forEach((item, index) => {
  month_arr[index] = item + "号";
});

var num_random = [];
for (var i = 0; i <= 29; i++) {
  num_random.push(_.random(200, 400));
}

function courseList_length(req) {
  return get_courseList(req).length;
}

function get_courseListByPage(req, res) {
  var total = courseList_length(req);
  var pageNum = Number(req.query.pageNum);
  var pageSize = Number(req.query.pageSize);
  var start_order = pageNum * pageSize;
  // console.log(pageNum, pageSize);
  if (!pageSize || pageNum == NaN) {
    return {
      code: "N",
      msg: "参数错了，看下啥参数没传",
    };
  } else if (total == 0) {
    return {
      code: "Y",
      msg: "暂无课程",
      list: [],
      total: 0,
    };
  } else if (start_order > total - 1) {
    return {
      code: "N",
      msg: "没那么多页",
    };
  } else {
    var end_order;
    if (start_order >= total + 1) {
      end_order = total;
    } else {
      end_order = start_order + pageSize;
    }
    var infoArr = get_courseList(req).slice(start_order, end_order);
    return {
      list: infoArr,
      total: total,
    };
  }
}

function get_courseList(req = {}) {
  var obj = fs.readFileSync(
    path.resolve(__dirname, "./db/db_course.json"),
    "utf8"
  );
  var tempobj = JSON.parse(obj);

  if (
    String(req.query.status) == "true" ||
    String(req.query.status) == "false"
  ) {
    tempobj = JSON.parse(obj).filter((item) => {
      return String(item.status) == String(req.query.status);
    });
  }

  // console.log("tempobj", tempobj);
  return tempobj;
}

function add_courseList(req, res) {
  // 上传图片的字段名称是courseImg，是必填项目
  if (req.files.courseImg && req.files.courseImg.name) {
    console.log("req", req.files.courseImg.path);
    var temp_img_index = req.files.courseImg.path.lastIndexOf("image");

    var oldvalue = get_courseList(req) ? get_courseList(req) : [];
    var newvalue = req.fields;

    newvalue.imgUrl = `http://127.0.0.1:3000/${req.files.courseImg.path.slice(
      temp_img_index
    )}`;
    if (oldvalue.length > 0) {
      newvalue.id = oldvalue[oldvalue.length - 1].id + 1;
    } else {
      newvalue.id = 1001;
    }
    oldvalue.push(newvalue);
    var valuestring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_course.json"),
      valuestring
    );
    return {
      code: "Y",
      msg: "新增成功",
    };
  } else {
    return {
      code: "N",
      msg: "图片是必填项目",
    };
  }
}

function change_courseList(req, res) {
  var oldvalue = get_courseList(req);
  var newvalue = req.fields;
  if (!newvalue.id) {
    return {
      code: "N",
      msg: "这里是改一个课程，所以要有id"
    };
  } else {
    // 修改的时候图片是非必传的，但是如果有的话，就要修改对应的值

    if (req.files.courseImg && req.files.courseImg.name) {
      var temp_img_index = req.files.courseImg.path.lastIndexOf("image");
      oldvalue.forEach((item, index) => {
        if (item.id == newvalue.id) {
          oldvalue[index] = Object.assign(oldvalue[index], newvalue);
          oldvalue[
            index
          ].imgUrl = `http://127.0.0.1:3000/${req.files.courseImg.path.slice(
            temp_img_index
          )}`;
        }
      });
    } else {
      oldvalue.forEach((item, index) => {
        console.log("修改这里", item.id, newvalue.id);

        if (item.id == newvalue.id) {
          oldvalue[index] = Object.assign(oldvalue[index], newvalue);
        }
      });
    }
    var valuestring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_course.json"),
      valuestring
    );
    return {
      code: "Y",
      msg: "修改成功"
    };
  }
}

app.get("/api/homeindex", function (req, res) {
  res.json({
    income_total: {
      today_income: 23,
      today_order: 2,
      seven_income: 234,
      seven_order: 13,
    },
    todo: {
      wait_pay: 4,
      wait_confirm: 23,
      wait_backmoney: 21,
    },
    income_detail: {
      week: {
        xalin: ["星期1", "星期2", "星期3", "星期4", "星期5", "星期6", "星期7"],
        yalin: [200, 300, 320, 100, 326, 600, 200],
      },
      month: {
        xalin: month_arr,
        yalin: num_random,
      },
    },
  });
});
app.get("/api/courseListByPage", function (req, res) {
  var obj = get_courseListByPage(req, res);
  res.json({
    code: "Y",
    info: obj,
  });
});
app.get("/api/courseList", function (req, res) {
  var obj = get_courseList(req);
  res.json({
    code: "Y",
    list: obj,
  });
});
app.post("/api/addOrChangeCourse", function (req, res) {
  var result;
  // 有id说明是修改，否则是新增
  if (req.fields.id) {
    result = change_courseList(req, res);
  } else {
    result = add_courseList(req, res);
  }
  res.json({
    result: result,
  });
});
app.get("/api/courseDetail", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "Y",
      msg: "查课程详情应该传课程id",
    });
  } else {
    var oldvalue = get_courseList(req);
    var data = oldvalue.find((item) => {
      // console.log(item.id, req.query.id, item.id == req.query.id);
      return item.id == req.query.id;
    });
    // console.log("详情", data, req.query);
    res.json({
      code: "Y",
      data: data,
    });
  }
});
app.get("/api/deleteCourse", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "Y",
      msg: "删除课程应该传该课程的id",
    });
  } else {
    var oldvalue = get_courseList(req);
    var id = oldvalue.findIndex((item) => {
      return item.id == req.query.id;
    });
    oldvalue.splice(id, 1);
    var tempstring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_course.json"),
      tempstring
    );
    res.json({
      code: "Y",
      mes: "删除成功",
    });
  }
});

function teacherList_length(req) {
  return get_teacherList(req).length;
}

function get_teacherListByPage(req, res) {
  var total = teacherList_length(req);
  var pageNum = Number(req.query.pageNum);
  var pageSize = Number(req.query.pageSize);
  var start_order = pageNum * pageSize;
  console.log(pageNum, pageSize);
  if (!pageSize || pageNum == NaN) {
    return {
      code: "N",
      msg: "参数错了，看下啥参数没传",
    };
  } else if (total == 0) {
    return {
      code: "Y",
      msg: "暂无教师",
      list: [],
      total: 0,
    };
  } else if (start_order > total - 1) {
    return {
      code: "N",
      msg: "没那么多页",
    };
  } else {
    var end_order;
    if (start_order >= total + 1) {
      end_order = total;
    } else {
      end_order = start_order + pageSize;
    }
    var infoArr = get_teacherList(req).slice(start_order, end_order);
    return {
      list: infoArr,
      total: total,
    };
  }
}

function get_teacherList(req = {}) {
  var obj = fs.readFileSync(
    path.resolve(__dirname, "./db/db_teacher.json"),
    "utf8"
  );
  var tempobj = JSON.parse(obj);

  if (req.query.teacherName) {
    tempobj = JSON.parse(obj).filter((item) => {
      return String(item.teacherName) == String(req.query.teacherName);
    });
  }

  console.log("tempobj", tempobj);
  return tempobj;
}

function add_teacherList(req, res) {
  // 上传图片的字段名称是teacherImg，是必填项目
  if (req.files.teacherImg && req.files.teacherImg.name) {
    console.log("req", req.files.teacherImg.path);
    var temp_img_index = req.files.teacherImg.path.lastIndexOf("image");

    var oldvalue = get_teacherList(req) ? get_teacherList(req) : [];
    var newvalue = req.fields;

    newvalue.imgUrl = `http://127.0.0.1:3000/${req.files.teacherImg.path.slice(
      temp_img_index
    )}`;
    if (oldvalue.length > 0) {
      newvalue.id = oldvalue[oldvalue.length - 1].id + 1;
    } else {
      newvalue.id = 1001;
    }
    oldvalue.push(newvalue);
    var valuestring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_teacher.json"),
      valuestring
    );
    return {
      code: "Y",
      msg: "新增成功",
    };
  } else {
    return {
      code: "N",
      msg: "图片是必填项目",
    };
  }
}

function change_teacherList(req, res) {
  var oldvalue = get_teacherList(req);
  var newvalue = req.fields;
  if (!newvalue.id) {
    return {
      code: "N",
      msg: "这里是改一个老师，所以要有id"
    };
  } else {
    // 修改的时候图片是非必传的，但是如果有的话，就要修改对应的值

    if (req.files.teacherImg && req.files.teacherImg.name) {
      var temp_img_index = req.files.teacherImg.path.lastIndexOf("image");
      oldvalue.forEach((item, index) => {
        if (item.id == newvalue.id) {
          oldvalue[index] = Object.assign(oldvalue[index], newvalue);
          oldvalue[
            index
          ].imgUrl = `http://127.0.0.1:3000/${req.files.teacherImg.path.slice(
            temp_img_index
          )}`;
        }
      });
    } else {
      oldvalue.forEach((item, index) => {
        console.log("修改这里", item.id, newvalue.id);

        if (item.id == newvalue.id) {
          oldvalue[index] = Object.assign(oldvalue[index], newvalue);
        }
      });
    }
    var valuestring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_teacher.json"),
      valuestring
    );
    return {
      code: "Y",
      msg: "修改成功"
    };
  }
}

app.get("/api/teacherListByPage", function (req, res) {
  var obj = get_teacherListByPage(req, res);
  res.json({
    code: "Y",
    info: obj,
  });
});
app.get("/api/teacherList", function (req, res) {
  var obj = get_teacherList(req);
  res.json({
    code: "Y",
    list: obj,
  });
});
app.post("/api/addOrChangeTeacher", function (req, res) {
  var result;
  // 有id说明是修改，否则是新增
  if (req.fields.id) {
    result = change_teacherList(req, res);
  } else {
    result = add_teacherList(req, res);
  }
  res.json({
    result: result,
  });
});

app.get("/api/teacherDetail", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "Y",
      msg: "查老师详情应该传该老师的id",
    });
  } else {
    var oldvalue = get_teacherList(req);
    var data = oldvalue.find((item) => {
      // console.log(item.id, req.query.id, item.id == req.query.id);
      return item.id == req.query.id;
    });
    // console.log("详情", data, req.query);
    res.json({
      code: "Y",
      data: data,
    });
  }
});
app.get("/api/deleteTeacher", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "Y",
      msg: "删除该老师应该传该老师的id",
    });
  } else {
    var oldvalue = get_teacherList(req);
    var id = oldvalue.findIndex((item) => {
      return item.id == req.query.id;
    });
    oldvalue.splice(id, 1);
    var tempstring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_teacher.json"),
      tempstring
    );
    res.json({
      code: "Y",
      mes: "删除成功",
    });
  }
});

function articleList_length(req) {
  return get_articleList(req).length;
}

function get_articleList(req = {}) {
  var obj = fs.readFileSync(
    path.resolve(__dirname, "./db/db_article.json"),
    "utf8"
  );
  var tempobj = JSON.parse(obj);

  console.log("tempobj", tempobj);
  return tempobj;
}

function get_articleListByPage(req, res) {
  var total = articleList_length(req);
  var pageNum = Number(req.query.pageNum);
  var pageSize = Number(req.query.pageSize);
  var start_order = pageNum * pageSize;
  console.log(pageNum, pageSize);
  if (!pageSize || pageNum == NaN) {
    return {
      code: "N",
      msg: "参数错了，看下啥参数没传",
    };
  } else if (total == 0) {
    return {
      code: "Y",
      msg: "暂无文章",
      list: [],
      total: 0,
    };
  } else if (start_order > total - 1) {
    return {
      code: "N",
      msg: "没那么多页",
    };
  } else {
    var end_order;
    if (start_order >= total + 1) {
      end_order = total;
    } else {
      end_order = start_order + pageSize;
    }
    var infoArr = get_articleList(req).slice(start_order, end_order);
    return {
      list: infoArr,
      total: total,
    };
  }
}

function add_articleList(req, res) {
  // 上传图片的字段名称是coverImg，是必填项目
  if (req.files.coverImg && req.files.coverImg.name) {
    console.log("req", req.files.coverImg.path);
    var temp_img_index = req.files.coverImg.path.lastIndexOf("image");

    var oldvalue = get_articleList(req) ? get_articleList(req) : [];
    var newvalue = req.fields;

    newvalue.imgUrl = `http://127.0.0.1:3000/${req.files.coverImg.path.slice(
      temp_img_index
    )}`;
    if (oldvalue.length > 0) {
      newvalue.id = oldvalue[oldvalue.length - 1].id + 1;
    } else {
      newvalue.id = 1001;
    }
    oldvalue.push(newvalue);
    var valuestring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_article.json"),
      valuestring
    );
    return {
      code: "Y",
      msg: "新增成功",
    };
  } else {
    return {
      code: "N",
      msg: "图片是必填项目",
    };
  }
}

function change_articleList(req, res) {
  var oldvalue = get_articleList(req);
  var newvalue = req.fields;
  if (!newvalue.id) {
    return {
      code: "N",
      msg: "这里是改一个文章，所以要有id"
    };
  } else {
    // 修改的时候图片是非必传的，但是如果有的话，就要修改对应的值

    if (req.files.coverImg && req.files.coverImg.name) {
      var temp_img_index = req.files.coverImg.path.lastIndexOf("image");
      oldvalue.forEach((item, index) => {
        if (item.id == newvalue.id) {
          oldvalue[index] = Object.assign(oldvalue[index], newvalue);
          oldvalue[
            index
          ].imgUrl = `http://127.0.0.1:3000/${req.files.coverImg.path.slice(
            temp_img_index
          )}`;
        }
      });
    } else {
      oldvalue.forEach((item, index) => {
        console.log("修改这里", item.id, newvalue.id);

        if (item.id == newvalue.id) {
          oldvalue[index] = Object.assign(oldvalue[index], newvalue);
        }
      });
    }
    var valuestring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_article.json"),
      valuestring
    );
    return {
      code: "Y",
      msg: "修改成功"
    };
  }
}

app.get("/api/articleListByPage", function (req, res) {
  var obj = get_articleListByPage(req, res);
  res.json({
    code: "Y",
    info: obj,
  });
});
app.get("/api/articleList", function (req, res) {
  var obj = get_articleList(req);
  res.json({
    code: "Y",
    list: obj,
  });
});
app.post("/api/addOrChangeArticle", function (req, res) {
  var result;
  // 有id说明是修改，否则是新增
  if (req.fields.id) {
    result = change_articleList(req, res);
  } else {
    result = add_articleList(req, res);
  }
  res.json({
    result: result,
  });
});
app.get("/api/articleDetail", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "Y",
      msg: "查文章详情应该传课程id",
    });
  } else {
    var oldvalue = get_articleList(req);
    var data = oldvalue.find((item) => {
      // console.log(item.id, req.query.id, item.id == req.query.id);
      return item.id == req.query.id;
    });
    // console.log("详情", data, req.query);
    res.json({
      code: "Y",
      data: data,
    });
  }
});
app.get("/api/deleteArticle", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "Y",
      msg: "删除文章应该传该文章的id",
    });
  } else {
    var oldvalue = get_articleList(req);
    var id = oldvalue.findIndex((item) => {
      return item.id == req.query.id;
    });
    oldvalue.splice(id, 1);
    var tempstring = JSON.stringify(oldvalue);
    fs.writeFileSync(
      path.resolve(__dirname, "./db/db_article.json"),
      tempstring
    );
    res.json({
      code: "Y",
      mes: "删除成功",
    });
  }
});

var feature_list = [{
    imgUrl: "http://www.12hua.com/images/201704/thumb_img/249_thumb_P_1493028503472.jpg",
    name: "轻风 - 小花束",
    des: "让清风捎去美丽，将幸福藏在你的心里，愿你在夏日的每天，都幸福快乐！",
    price: 95,
    id: 1001,
  },
  {
    imgUrl: "http://www.12hua.com/images/201704/goods_img/250_P_1493029180315.jpg",
    name: "仙境 - 扶郎花花束",
    des: "微笑是生活里永远明亮的阳光。愿你常常面带微笑，幸福快乐！！",
    price: 98,
    id: 1002,
  },
  {
    imgUrl: "http://www.12hua.com/images/201704/goods_img/247_P_1493008286929.jpg",
    name: "蜜露时节 - 扶郎花",
    des: "平淡交织的日子，美好在凝聚，快乐在复制，情意在传递。每一天，都愿你过得无忧无虑！",
    price: 118,
    id: 1003,
  },
  {
    imgUrl: "http://www.12hua.com/images/201705/goods_img/269_P_1494485351854.jpg",
    name: "天天开心 - 康乃馨",
    des: "让岁月的流水带走忧伤，让快乐的白鸟永远飞翔，愿你万事顺遂、天天开心！",
    price: 120,
    id: 1004,
  },
  {
    imgUrl: "http://www.12hua.com/images/201704/goods_img/246_P_1493007995707.jpg",
    name: "锁住心情 - 太阳花花束",
    des: "心灵有家，生命才会有路，守好心，走好路，珍惜最真的情感，感受最近的幸福，享受最美的心情。",
    price: 138,
    id: 1005,
  },
  {
    imgUrl: "http://www.12hua.com/images/201801/goods_img/96_P_1517284636191.jpg",
    name: "春江花语 - 百合康乃馨",
    des: "启开一串绵绵的岁月，这醇醇的怀念，虽是一份情意，却又是你我永远的心情",
    price: 138,
    id: 1006,
  },
];

app.get("/api/vanlist", function (req, res) {
  var total = 40;
  var pageNum = Number(req.query.pageNum);
  var pageSize = Number(req.query.pageSize);
  var start_order = pageNum * pageSize;
  console.log(pageNum, pageSize);
  if (!pageSize || pageNum == NaN) {
    res.json({
      code: "N",
      msg: "参数错了，看下啥参数没传",
    });
  } else if (start_order > total - 1) {
    res.json({
      code: "N",
      msg: "没那么多页",
    });
  } else {
    var end_order;
    if (start_order >= total + 1) {
      end_order = total;
    } else {
      end_order = start_order + pageSize;
    }
    var infoArr = _.range(start_order, end_order);
    res.json({
      code: "Y",
      list: infoArr,
      total: total,
      start_order: start_order,
      end_order: end_order,
    });
  }
});

app.post("/api/login", function (req, res) {
  console.log("req", req.fields);
  if (!req.fields.email) {
    res.json({
      code: "N",
      message: "登录失败，邮件不能为空",
      userCode: 1002,
      roletype: "developer",
    });
  } else if (!req.fields.password) {
    res.json({
      code: "N",
      message: "登录失败，密码不能为空",
      userCode: 1002,
      roletype: "developer",
    });
  } else {
    res.json({
      code: "Y",
      message: "登录成功",
      userCode: 1002,
      roletype: "developer",
      // res:req
    });
  }
});

app.get("/api/home", function (req, res) {
  res.json({
    carousel_list: [{
        imgUrl: "http://www.12hua.com/images/201704/thumb_img/249_thumb_P_1493028503472.jpg",
        name: "轻风 - 小花束",
        id: 1001,
      },
      {
        imgUrl: "http://www.12hua.com/images/201704/goods_img/250_P_1493029180315.jpg",
        name: "仙境 - 扶郎花花束",
        id: 1002,
      },
      {
        imgUrl: "http://www.12hua.com/images/201704/goods_img/247_P_1493008286929.jpg",
        name: "蜜露时节 - 扶郎花",
        id: 1003,
      },
    ],
    recent_list: [{
        imgUrl: "http://www.12hua.com/images/201705/goods_img/269_P_1494485351854.jpg",
        name: "天天开心 - 康乃馨",
        des: "让岁月的流水带走忧伤，让快乐的白鸟永远飞翔，愿你万事顺遂、天天开心！",
        price: 120,
        id: 1004,
        rate: 4,
      },
      {
        imgUrl: "http://www.12hua.com/images/201704/goods_img/246_P_1493007995707.jpg",
        name: "锁住心情 - 太阳花花束",
        des: "心灵有家，生命才会有路，守好心，走好路，珍惜最真的情感，感受最近的幸福，享受最美的心情。",
        price: 138,
        id: 1005,
        rate: 5,
      },
      {
        imgUrl: "http://www.12hua.com/images/201801/goods_img/96_P_1517284636191.jpg",
        name: "春江花语 - 百合康乃馨",
        des: "启开一串绵绵的岁月，这醇醇的怀念，虽是一份情意，却又是你我永远的心情",
        price: 138,
        id: 1006,
        rate: 2,
      },
    ],
  });
});

app.get("/api/recomment", function (req, res) {
  res.json({
    recomment_list: feature_list,
  });
});

app.get("/api/flowerdetail", function (req, res) {
  console.log(req.query);
  if (req.query.flowerId == 1001) {
    res.json(feature_list[0]);
  } else if (req.query.flowerId == 1002) {
    res.json(feature_list[1]);
  } else if (req.query.flowerId == 1003) {
    res.json(feature_list[2]);
  } else if (req.query.flowerId == 1004) {
    res.json(feature_list[3]);
  } else if (req.query.flowerId == 1005) {
    res.json(feature_list[4]);
  } else if (req.query.flowerId == 1006) {
    res.json(feature_list[5]);
  } else {
    res.json({
      code: "N",
      message: "查无此花，是不是没传flowerId，问下老师咋回事",
    });
  }
});

app.get("/api/holiday", function (req, res) {
  res.json({
    holiday_list: [{
        holiday: "父亲节",
        id: "1001",
      },
      {
        holiday: "母亲节",
        id: "1002",
      },
      {
        holiday: "情人节",
        id: "1003",
      },
      {
        holiday: "教师节",
        id: "1004",
      },
      {
        holiday: "国庆节",
        id: "1005",
      },
    ],
  });
});

app.get("/api/flowerlistforholiday", function (req, res) {
  if (!req.query.id) {
    res.json({
      code: "N",
      msg: "没有这个节日，是不是没传节日id，问下老师咋回事",
    });
  } else {
    res.json({
      list: feature_list,
    });
  }
});

app.post("/api/pay", function (req, res) {
  console.log("req", req.body);
  if (req.body.goods.length <= 0) {
    res.json({
      code: "N",
      message: "什么都没买吧",
      userCode: 1002,
      roletype: "developer",
      // res:req
    });
  } else if (!req.body.credit_name || !req.body.credit_number) {
    res.json({
      code: "N",
      message: "名称和账号是必填的",
      userCode: 1002,
      roletype: "developer",
    });
  } else {
    res.json({
      code: "Y",
      message: "购买成功",
      userCode: 1002,
      roletype: "developer",
    });
  }
});
// 这里是没有用express-formidable，无法用req.filed和req.files来区分文件
// app.post("/api/students", function (req, res) {
//   console.log("req", req.body);
//   var form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.multiples = true;
//   console.log(form.type);
//   form.uploadDir = path.join(__dirname, "students");
//   form.parse(req, function (err, fields, files) {
//     res.end(JSON.stringify({ fields, files }));
//   });
// });

// 购买的书籍id，数量，不用传价格，后端处理，数组[{id:1002,count:2},]
app.post("/api/buy", function (req, res) {
  console.log("req", req.fields);

  res.json({
    code: "Y",
    message: "购买成功",
    userCode: 1002,
    roletype: "developer",
    // res:req
  });
});

app.get("/api/books", function (req, res) {
  res.json({
    info: [{
        bookName: "追风筝的人",
        author: "卡勒德·胡赛尼",
        price: 1.8,
        imgUrl: "http://5b0988e595225.cdn.sohucs.com/images/20190303/f688b16173584e32afe9717a1947c3bd.jpeg",
        des: "为你，千千万万遍。”我想，小说描写了一种最为诚挚的情感，而且它让你相信有些东西依然存在。在这个没有人相信承诺的年代，让人再次看到承诺背后那些美丽复杂的情感。这是一本好看的书，它让你重新思考",
        otherPrice: [{
            platform: "淘宝",
            price: 3,
          },
          {
            platform: "拼多多",
            price: 2,
          },
          {
            platform: "京东",
            price: 2.3,
          },
          {
            platform: "当当",
            price: 2.4,
          },
        ],
        id: 1001,
      },
      {
        bookName: "解忧杂货店",
        author: "东野圭吾",
        price: 3,
        imgUrl: "http://5b0988e595225.cdn.sohucs.com/images/20190303/f18c33cccd044d3381bbc7f062ee8b84.jpeg",
        des: "对于东野来说，这是一本温柔的小书。可能也只有东野，能把看似这么多温柔美好的小故事，巧妙精致地联接起来，读到最后一分钟，才恍悟原来前后都是有必然联系的。人生如此奇妙，不好好过又对得起谁",
        otherPrice: [{
            platform: "淘宝",
            price: 3.3,
          },
          {
            platform: "拼多多",
            price: 2.5,
          },
          {
            platform: "京东",
            price: 2.8,
          },
          {
            platform: "当当",
            price: 2.8,
          },
        ],
        id: 1002,
      },
      {
        bookName: "小王子",
        author: "圣埃克苏佩里",
        price: 8,
        imgUrl: "http://5b0988e595225.cdn.sohucs.com/images/20190303/f4a9dc51b7884041a47ade20ee929a34.jpeg",
        des: "十几岁的时候渴慕着小王子，一天之间可以看四十四次日落。是在多久之后才明白，看四十四次日落的小王子，他有多么难过。",
        otherPrice: [{
            platform: "淘宝",
            price: 3.3,
          },
          {
            platform: "拼多多",
            price: 2.5,
          },
          {
            platform: "京东",
            price: 2.8,
          },
          {
            platform: "当当",
            price: 2.8,
          },
        ],
        id: 1003,
      },
      {
        bookName: "白夜行",
        author: "东野圭吾",
        price: 8,
        imgUrl: "http://5b0988e595225.cdn.sohucs.com/images/20190303/732b877b422f4f34b6e0d4cd7e1e56e6.jpeg",
        des: "昨晚两点开始看《白夜行》一直看到天亮看完。展现出东野圭吾对复杂叙事的掌控能力，精彩绝伦。但是我最欣赏的还是他对恶的动机，那种孜孜不倦的探求，一直向灵魂黑洞最深处走去。他书写的恶往往不是凡俗的恶，而是一种提纯的，高智商的，有分寸的，肃穆的恶。那种恶最终会让人动容，和纯粹的善一样",
        otherPrice: [{
            platform: "淘宝",
            price: 3.3,
          },
          {
            platform: "拼多多",
            price: 2.5,
          },
          {
            platform: "京东",
            price: 2.8,
          },
          {
            platform: "当当",
            price: 2.8,
          },
        ],
        id: 1004,
      },
      {
        bookName: "围城",
        author: " 銭锺书",
        price: 8,
        imgUrl: "http://5b0988e595225.cdn.sohucs.com/images/20190303/841a564b7c2746b6a77e08921c9a8ea8.jpeg",
        des: "有人说匠心太重，我倒喜欢这样的匠心。令人捧腹的句子不在少数，爱情与生活在调侃中被扒去鲜亮的外壳，讽刺到骨子里，真是又痛又要看下去。这书就是真理，赤裸裸啊",
        otherPrice: [{
            platform: "淘宝",
            price: 3.3,
          },
          {
            platform: "拼多多",
            price: 2.5,
          },
          {
            platform: "京东",
            price: 2.8,
          },
          {
            platform: "当当",
            price: 2.8,
          },
        ],
        id: 1005,
      },

      {
        bookName: "三体Ⅰ",
        author: "刘慈欣",
        price: 8,
        imgUrl: "http://5b0988e595225.cdn.sohucs.com/images/20190303/188ba44eb2e343e987e2d18e9ccd687e.jpeg",
        des: "刘慈欣对于中国科幻，就如同姚明对于中国篮球”“刘慈欣凭借一己之力将中国科幻提高到了世界级水平”。读完才知，名不虚传",
        otherPrice: [{
            platform: "淘宝",
            price: 3.3,
          },
          {
            platform: "拼多多",
            price: 2.5,
          },
          {
            platform: "京东",
            price: 2.8,
          },
          {
            platform: "当当",
            price: 2.8,
          },
        ],
        id: 1006,
      },
    ],
  });
});

app.post("/api/register", function (req, res) {
  console.log("req", req.body);
  res.json({
    code: "Y",
    message: "注册成功",
    userCode: 1002,
    roletype: "developer",
    // res:req
  });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
