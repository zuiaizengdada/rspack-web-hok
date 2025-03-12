<template>
    <div class='warp'>
        <div class="item">
            <div>视频水印</div>
            <el-switch v-model="form.isActivated" @change="handleSwitch" :active-value="1" :inactive-value="0">
            </el-switch>
            <span>开启视频水印后 所有已购课程的正式课程会带水印</span>
        </div>
        <div class="item">
            <div>水印内容</div>
            <el-radio-group v-model="form.type" class="radioBox" @change="handleSwitch">
                <el-radio :label="item.value" v-for="item in typeList" :key="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>
<script>
import { getWatermarkConfig, setWatermarkConfig } from '@/api/shop'
export default {
    components: {},
    data: () => ({
        typeList: [
            {
                label: '用户ID',
                value: 1
            }
        ],
        form: {
            type: 1,
            isActivated: 0
        }
    }),
    computed: {},
    watch: {},
    methods: {
        async handleSwitch(){
            const { code } = await setWatermarkConfig(this.form)
            if(code===1) this.$message.success('操作成功！')
        },
        async getWatermarkConfig() {
            const { code, data } = await getWatermarkConfig()
            if (code === 1 && data) this.form = { ...data }
        },
    },
    created() {
        this.getWatermarkConfig()
    },
    mounted() { },
}
</script>
<style lang='scss' scoped>
.warp {
    padding: 20px;

    >.item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        >div:nth-of-type(1) {
            margin-right: 10px;
        }

        >span {
            margin-left: 10px;
            font-size: 12px;
            color: #999999;
        }

        .radioBox {
            padding-top: 4px;
        }
    }
}
</style>
