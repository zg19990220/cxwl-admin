<template>
  <div class="homeBox" >
    <components is="userComponent" />
  </div>
</template>

<script>
import userComponent from './user'
import { mapGetters } from 'vuex'
export default {
  components: {
    userComponent
  }
}
</script>
