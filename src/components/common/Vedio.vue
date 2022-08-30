<template>
     <video
        class="ht-video"
        :id="`ht-flv-${flvId}`"
        controls
        preload="auto" 
        :height="height"
        :autoplay="isAutoStart"
        :muted="isMuted"
        :poster="poster"
        cors
    >
    </video>
</template>
<script>
import flvjs from 'flv.js';
export default {
    name: 'HtFlv',

    data(){
        return{
            flvPlayer:{}
        }
    },
    props:{
        height:{
            type: String,
            default: '400px',
            required: false
        },
        src:{
            type: String,
            default: '',
            required: true
        },
        flvId:{
            type: String,
            default: '',
            required: true
        },
        poster:{
            type: String,
            default: '',
            required: false
        },
        isMuted:{
            type: Boolean,
            default: false,
            required: false
        },
        isLive:{
            type: Boolean,
            default: true,
            required: false
        },
        isAutoStart:{
            type: Boolean,
            default: true,
            required: false
        }
    },
    watch:{
    },
    methods:{
        destoryVideo(){
            this.flvPlayer.pause();
            this.flvPlayer.unload();
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
            this.flvPlayer = null;
        },
        createVideo(){
            const $this = this;
            if (flvjs.isSupported()){
                const videoElement = document.getElementById(`ht-flv-${$this.flvId}`);
                $this.flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    isLive: $this.isLive,
                    url: $this.src
                });
                $this.flvPlayer.attachMediaElement(videoElement);
                $this.flvPlayer.load();
            }
        }
    },
    mounted(){
        const $this = this;
        
        $this.$nextTick(function(){
            $this.createVideo()
        })
    },
    destroyed(){
        this.destoryVideo();
    }
}
</script>
<style lang="scss" scoped>
.ht-video{
    width: 100%;
}
</style>