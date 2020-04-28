<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group
          v-model="collect"
          size="mini"
          @change="onCollectChange"
        >
          <el-radio-button
            :label="false"
          >全部</el-radio-button>
          <el-radio-button
            :label="true"
          >收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
        >上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
          class="image"
        >
          <el-image
            style="height: 150px"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="colection">
            <!-- <i class="icon" @click="addLove" :class="{'el-icon-star-off': icon, 'el-icon-star-on': !icon}"></i> -->
            <i class="icon" @click="addLove(img.id, img.is_collected)" :class="img.is_collected?'el-icon-star-on':'el-icon-star-off'"></i>
            <i class="icon el-icon-delete" @click="delImages(img.id)"></i>
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
      <!-- 列表分页 -->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onCurrentChange">
      </el-pagination>
      <!-- /列表分页 -->
    </el-card>

    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >

      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :show-file-list="false"
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, addLove, delImage } from '@/api/image'

export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1, false)
  },
  mounted () {},
  methods: {
    loadImages (page, collect = false) {
      getImages({
        page,
        per_page: this.pageSize,
        collect
      }).then(res => {
        this.images = res.data.data.results
        this.totalCount = res.data.data.total_count
      })
    },

    onCollectChange (value) {
      this.loadImages(1, value)
    },

    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false

      // 更新素材列表
      this.loadImages(false)
    },
    onCurrentChange (page) {
      this.loadImages(page)
    },
    addLove (id, collect) {
      addLove(!collect, id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loadImages(1, false)
        this.$router.push('/image')
      }).catch(() => {
        this.$message({
          message: '操作失败',
          type: 'info'
        })
      })
    },
    delImages (id) {
      delImage(id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadImages(1, false)
      })
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image {
  position: relative;
  .colection {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 30px;
    background-color: #fff;
    opacity: .5;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      color: red;
      opacity: 1;
      z-index: 9999;
      display: inline-block;
    }
  }
}
</style>
