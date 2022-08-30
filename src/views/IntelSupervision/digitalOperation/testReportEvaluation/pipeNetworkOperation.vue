<!-- 管网运行情况评估及建议 -->
<template>
    <div class="pipe_network_operation">
        <pipeNetworkOperationTable :activeName="activeName" wellType="1" />
        <pipeNetworkOperationTable :activeName="activeName" wellType="2" />
    </div>
</template>

<script>
import pipeNetworkOperationTable from "./pipeNetworkOperationTable.vue";
export default {
  components: { pipeNetworkOperationTable },
  props: {
    activeName: {
      type: String,
      default: ""
    }
  },
  data(){
      return{}
  }
};
</script>
