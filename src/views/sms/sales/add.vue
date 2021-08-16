<template> 
  <sales-detail :is-edit='false'></sales-detail>
</template>
<script>
  import SalesDetail from './components/SalesDetail'
  export default {
    name: 'addSales',
    components: { SalesDetail }
  }
</script>
<style>
</style>
