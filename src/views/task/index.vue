<template>
  <div class="app-container">
    <TaskTable />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import TaskTable from './components/TaskTable'

@Component({ components: { TaskTable } })
export default class Task extends Vue {
  created() {}
}
</script>
