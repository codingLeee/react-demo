<template>
  <el-dialog
    width="45%"
    height="30%"
    :visible.sync="visible"
    v-if="visible"
    class="tile-dialog"
    :destroy-on-close="true"
    :title="'视频播放'"
    v-dialogDrag
    @close="close"
  >
    <div style="{'width':'100%','height':'100px'}">
        <vedio :flvId="'vedio'" :src="src"></vedio>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import Vedio from "@/components/common/Vedio.vue";
import {
  getFlvAddr,
} from "@/api/drainageOperation";
import { awaitWrap, checkNotNull } from "@/lib";
export default {
  name: "pointInfoDialog",
  components: {
    Vedio,
  },
  data() {
    return {
      visible:false,
      src:''
    };
  },
  props: {
    ipcId: {
      type: String,
      default() {
        return '';
      },
    },
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    ...mapState({
      dataStateOptions: (state) => state.IntelSupervison.dataStateOptions,
      equipStatusOptions: (state) => state.IntelSupervison.equipStatusOptions,
    }),
  },
  watch: {
    ipcId: {
      immediate: true,
      handler() {
          this.getVedioSrc();
      },
      },
    show: {
      immediate: true,
      handler() {
          this.visible = this.show
      },
    },
  },
  methods: {
      close(e) {
          this.$emit('close')  
      },
      async getVedioSrc() {
        //设备故障类型数据处理
        let url = (await awaitWrap(getFlvAddr({ipcId:this.ipcId})))[1] || {};
        if (checkNotNull(url) && checkNotNull(url["data"])) {
          url = url["data"];
          this.src = url["data"];
        } else {
          this.src = '';
        }
      }
  },
  created() {
      
  },
  mounted() {
  },
  beforeDestroy() {},
};
</script>


<style lang="scss" scoped>

</style>
