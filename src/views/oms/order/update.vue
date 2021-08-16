<template> 
  <order-detail :is-edit='true'></order-detail>
</template>
<script>
  import OrderDetail from './components/OrderDetail'
  export default {
    name: 'updateOrder',
    components: { OrderDetail }
  }
</script>
<style>
</style>
