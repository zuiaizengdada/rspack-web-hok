<template>
  <contractAgreement :fileType="2" />
</template>
<script>
import contractAgreement from '../contractAgreement/index'

export default {
  components: { contractAgreement },
  data() {},
  mounted() {
    this.$uweb?.setAction('Event_oa_companyAgreement_page')
  }
}
</script>

<style lang="scss" scoped></style>
