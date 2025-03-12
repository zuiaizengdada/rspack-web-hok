<template>
  <div class="organization">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabConfigList"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <div v-if="item.name === 'organization'">
          <Organization />
        </div>
        <div v-if="item.name === 'position'">
          <Position />
        </div>
        <div v-if="item.name === 'role'">
          <Role />
        </div>
        <div v-if="item.name === 'subject'">
          <Subject />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Organization from './components/organization'
import Position from './components/position'
import Role from './components/role'
import Subject from './components/subject'

export default {
  name: 'TalentFile',
  components: { Organization, Position, Role, Subject },
  data() {
    return {
      tabConfigList: [
        {
          name: 'organization',
          label: '组织结构'
        },
        {
          name: 'position',
          label: '岗位管理'
        },
        {
          name: 'role',
          label: '角色管理'
        },
        {
          name: 'subject',
          label: '公司主体'
        }
      ],
      activeName: 'organization'
    }
  }
}
</script>

<style lang="scss" scoped>
.organization {
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
