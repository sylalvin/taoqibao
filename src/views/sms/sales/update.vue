<template> 
  <sales-detail :is-edit='true'></sales-detail>
</template>
<script>
  import SalesDetail from './components/SalesDetail'
  export default {
    name: 'updateSales',
    components: { SalesDetail }
  }
</script>
<style>
</style>
