export default {
  methods: {
    // 跳转页面
    JumpTo(str, obj) {
      this.$router.push({
        name: str,
        query: obj
      });

    },
    // 返回上一页
    back() {
      this.$router.go(-1)
    },
    // 消息提示
    opento(type, str) {
      this.$notify({
        message: str,
        type: type
      });
    },
    // 获取数据get
    getData(url, obj, callback) {
      this.$axios({
        method: 'get',
        url: url,
        params: obj
      }).then(res => {
        callback(res)
      })
    },
    postData(url, fromdata, callback) {
      this.$axios({
        method: 'post',
        url: url,
        params: fromdata
      }).then(res => {
        callback(res)
      })
    },
    // 截取数据
    sliceData() {
      let start = (this.currentPage - 1) * this.psize;
      let end = start + this.psize;
      this.tableData = this.allData.slice(start, end);
    },
    // 筛选功能
    onFilter() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.getAll();
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除数据
    delData(index, row, url) {
      this.getData(url, {
        id: row.id
      }, res => {
        console.log(res);
        if (res.data.code === "Y") {
          this.tableData.splice(index, 1);
          this.opento("success", res.data.mes);
        } else {
          this.opento("warning", res.data.mes);
        }
      });
    },
    // 全选函数
    allSelection(rows) {
      this.$refs.multipleTable.toggleAllSelection()

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length == this.psize) {
        this.allSelect = true
      } else {
        this.allSelect = false

      }
    },
    handleSizeChange(val) {
      this.psize = val;
      this.sliceData();

      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.sliceData();

    },
    // 验证表单数据
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          if (this.canSubmit) {
            this.canSubmit = false;
            setTimeout(() => {
              this.canSubmit = true;
              // console.log(this.canSubmit);
            }, 2000);
            this.changeFormdata();

          } else {
            this.$message('请不要点击过快')
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 图片上传
    handleAvatarSuccess(img) {
      this.imgfile = event.target.files[0];
      this.imageUrl = URL.createObjectURL(this.imgfile);
      if (img === 'courseImg') {
        this.form.courseImg = this.imageUrl;
      } else if (img === 'teacherImg') {
        this.form.teacherImg = this.imageUrl;
      } else if (img === 'coverImg') {
        this.form.coverImg = this.imageUrl;
      }
      this.$refs.form.validateField(img);
    },
    beforeAvatarUpload() {
      this.$refs.from_img.click();
    },
    resetForm() {
      this.imageUrl = ''
      this.$refs.form.resetFields();

    },
    // 弹窗警告
    messageBox(callback) {
      this.$confirm('是否保存已填写数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        callback()
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.resetForm();
        callback();
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    }

  }
}
