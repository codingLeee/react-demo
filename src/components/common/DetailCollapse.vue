<template>
    <el-collapse accordion class="detail_collapse" @change="collapseChange">
        <el-collapse-item v-for="(item,index) in collapseData" 
            :name="checkNotNull(item['properties']) ? 
              (checkNotNull(item['properties']['panelName']) ? item['properties']['panelName'] : item['name']) 
              : item['name']" 
              :key="item['name']+index"
            >
            <template slot="title">
                <span class="title_boder"></span>
                {{item['title']}}
                <div v-if="item['isModifiable']" class="title_icon">
                    <img @click.stop="updateInfo(item,index)" :src="`/static/ManageSystem/img/censusDetails_${item['isUpdate'] ? 'save' : 'update'}_icon.png`" alt="">
                </div>
            </template>
            <component
              :ref="item['name']" 
              :is="item['component']" 
              :tabName="item['tabName']" 
              :activeName="activeName" 
              :properties="item['properties']"
            />
        </el-collapse-item> 
    </el-collapse>
</template>

<script>
import { checkNotNull } from "@/lib";
export default {
  props: {
    collapseList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      activeName: "",
      collapseData:[]
    };
  },
  watch: {
    collapseList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.collapseData = JSON.parse(JSON.stringify(val));
          this.getCollapseComponent();
        }
      }
    }
  },
  methods: {
    checkNotNull,
    updateInfo(data,index) {
      const _this = this;
      _this.collapseData[index]["isUpdate"] = !_this.collapseData[index]["isUpdate"];
      _this.$nextTick(() => {
        _this.$refs[data["name"]][0].updateCollapseInfo(!_this.collapseData[index]["isUpdate"]);
      });
    },
    getCollapseComponent() {
      const _this = this;
      this.collapseData.forEach(m => {
        m["component"] = require(`@/views${m["path"]}/${
          m["name"]
        }.vue`).default;
      });
    },
    collapseChange(code) {
      const _this = this;
      _this.$nextTick(() => {
        _this.activeName = code;
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.detail_collapse {
  border: none;

  /deep/ .el-collapse-item {
    margin-bottom: 45px;

    .el-collapse-item__wrap,
    .el-collapse-item__header {
      background-color: #101f70;
    }
    .el-collapse-item__header {
      font-size: 16px;
      color: #fff;
      border-bottom: 2px solid #394688;
      margin-bottom: 25px;

      .title_boder {
        display: inline-block;
        width: 4px;
        height: 30px;
        background: #2f4fd6;
        margin-right: 20px;
      }

      .title_icon {
        width: 28px;
        height: 28px;
        flex: 1;
        text-align: right;
        padding-right: 55px;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .el-collapse-item__arrow {
        font-size: 24px;
        color: #a7bef7;
      }
    }
    .el-collapse-item__wrap {
      border: none;
      .el-collapse-item__content {
        padding: 0;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>
