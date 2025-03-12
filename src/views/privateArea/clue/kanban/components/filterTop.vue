<template>
  <div class="allHeader">
    <div class="cardTitle">
      <div class="headerTop">
        <!-- <MTitle>数据概况</MTitle> -->
        <div>数据概况</div>
        <span>更新时间：{{ statDate || '0000-00-00 00:00:00' }}</span>
      </div>
      <el-form
        v-if="dataType === 1"
        :inline="true"
        size="small"
        :model="form"
        class="search-form"
      >
        <el-form-item label="来源渠道：">
          <m-select
            v-model="form.channelId"
            style="width: 150px"
            :dict-list="channelSourceType"
          />
        </el-form-item>
        <el-form-item label="IP：">
          <TeacherSelect
            ref="teacherSelect"
            :default-tearch-id="form.teacherId"
            :value="form.teacherName"
            @selected="teacherSelect"
          />
        </el-form-item>
        <el-form-item label="线索有效性：">
          <el-select v-model="form.isAvailable" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" size="small" @click="handleOk">查询</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <div class="cardList">
      <list
        v-for="(item, index) in cardList"
        :key="index"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTeacherList } from '@/api/shop'
import list from './list.vue'
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import { getSelectListTeacher } from '@/api/privateArea/kanban'
export default {
  components: {
    list,
    TeacherSelect
  },
  props: {
    cardList: {
      type: Array,
      default: () => []
    },
    statDate: {
      type: String,
      default: '00-00-00 00:00:00'
    },
    dataType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      getSelectListTeacher,
      active: {},
      cartList: [
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 1
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 2
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 3
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 4
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 5
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 6
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 7
        },
        {
          title: '分配线索数',
          num: 1232,
          text: '加微率',
          rale: '12.02%',
          id: 8
        }
      ],
      options: [
        {
          label: '有效',
          value: 0
        },
        {
          label: '无效',
          value: 1
        }
      ],
      getTeacherList,
      form: {
        channelId: '',
        teacherId: '',
        isAvailable: ''
      }
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  mounted() {},
  methods: {
    handleOk() {
      this.$emit('handleOk', this.form)
    },
    teacherSelect(val) {
      console.log(val)
      this.form.teacherId = val.lecturerId
      this.form.teacherName = val.lecturerName
    },
    handleReset() {
      this.form = {
        channelId: '',
        teacherId: '',
        teacherName: '',
        isAvailable: ''
      }
      this.$emit('handleOk', this.form)
    }
  }
}
</script>

<style lang='scss' scoped>
.allHeader {
  .cardTitle{
    background: #fff;
    padding:20px;
    padding-bottom: 0;
    margin-bottom: 20px;
    border-radius: 0 0 10px 10px;
  }
  .headerTop {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    >div{
      font-weight: bold;
    }
    > span {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
      margin-left: 10px;
    }
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
.cardList {
  display: flex;
  flex-flow: wrap;
  > div {
    width: 15.8%;
    margin-right: 1.02%;
    margin-bottom: 20px;
  }
  > div:nth-of-type(6n) {
    margin-right: 0;
  }
}
</style>
