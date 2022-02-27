<template>
  <div class="app-container">
    <EmployeeTable />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import EmployeeTable from './components/EmployeeTable'
@Component({ components: { EmployeeTable } })
export default class Employee extends Vue {
  created() {}
}
</script>
