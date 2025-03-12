<template>
  <div class="dt" />
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
    }
  },
  created() {
    const token = getToken()
    location.href = process.env.VUE_APP_TO_QUERY_SITE + `?token=${token}`
  }
}
</script>
