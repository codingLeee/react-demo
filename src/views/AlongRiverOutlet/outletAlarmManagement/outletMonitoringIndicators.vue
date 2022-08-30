<template>
    <div class="outletMonitoringIndicators">
        <extremesStatistics v-if="activeTabName == 'statistics'"/>
        <informationAnalysis v-if="activeTabName == 'analysis'"/>
    </div>
</template>

<script>
import { mapState } from "vuex";
import extremesStatistics from "./extremesStatistics.vue";
import informationAnalysis from "./informationAnalysis.vue";
export default {
  components: { extremesStatistics, informationAnalysis },
  computed: {
    ...mapState({
      activeTabName: state => state.IntelSupervison.activeTabName
    })
  }
};
</script>

