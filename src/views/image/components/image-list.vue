<template>
  <div class="image-list">
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
          v-if="isShowAdd"
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
          @click.native="selected = index"
        >
          <el-image
            style="height: 150px"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="colection" v-if="isShowAction">
            <!-- <i class="icon" @click="addLove" :class="{'el-icon-star-off': icon, 'el-icon-star-on': !icon}"></i> -->
            <i class="icon" @click="addLove(img)" :class="img.is_collected?'el-icon-star-on':'el-icon-star-off'"></i>
            <i class="icon el-icon-delete" @click="delImages(img.id)"></i>
          </div>
          <div
          class="selected"
          v-if="isShowSelected && selected === index"
          ></div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
      <!-- 列表分页 -->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        :page-size.sync="pageSize"
        :current-page.sync="page"
        @current-change="onCurrentChange">
      </el-pagination>
    <!-- /数据分页 -->

    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
      width="70%"
    >

      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :show-file-list="ture"
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
  name: 'ImageList',
  components: {},
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },

    // 是否显示图片下方的操作（收藏和删除）
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  // 使用数组声明 prop，不建议，不够严谨，而且功能也不够强大，仅适合 demo 演示
  // props: ['dsadsadsa'],
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
      totalCount: 0,
      selected: null // 选中的索引
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
      this.page = page
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
      this.loadImages(1, false)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onCurrentChange (page) {
      this.loadImages(page)
    },
    addLove (img) {
      addLove(!img.is_collected, img.id).then(() => {
        this.$message({
          message: img.is_collected ? '取消收藏成功' : '收藏成功',
          type: 'success'
        })
        img.is_collected = !img.is_collected
      })
    },
    delImages (id) {
      delImage(id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadImages(1)
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
    left: 5px;
    bottom: 0;
    right: 5px;
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
.selected {
  background: url(./selected.png) no-repeat;
  background-size: contain;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999999999999999;
}
</style>
