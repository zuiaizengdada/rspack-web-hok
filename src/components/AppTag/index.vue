<!--
 * @Author: Aming 17666130388@163.com
 * @Date: 2023-05-25 16:19:27
 * @LastEditors: Aming 17666130388@163.com
 * @LastEditTime: 2023-05-25 18:41:06
 * @FilePath: \h5-hokd:\huoke\web-hok\src\components\AppTag\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 111
-->
<template>
  <div class="tag" :style="`background: ${bgColor}`">
    <slot name="icon" />
    <div class="text">
      <slot name="text" />
    </div>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['bgColor']
}
</script>
<style lang="scss" scoped>
.tag {
  line-height: 1;
  border-radius: 12px;
  padding: 4px 10px;
  display: inline-block;
  padding-bottom: 5px;
  >*{
    display: inline-block;
    vertical-align: middle;
  }
  > .text {
    margin-left: 3px;
    font-size: 12px;
    line-height: 1;
  }
}
</style>
