<template>
  <div class="task-container">
    <div class="table-filter">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handelAdd">新增任务信息</el-button>
      <el-button class="refresh" type="text" @click="refresh">刷新</el-button>
    </div>

    <el-table
      :key="'1'"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :header-row-class-name="'table-header'"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" width="60">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="往来单位" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.coCompany }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作地点" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.workPlace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="80" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作时常" width="140px">
        <template slot-scope="{ row }">
          <span>{{ row.workHours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求人数" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.reqPersonNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前任务状态" align="center" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.taskStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求年龄" width="80" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.reqAge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求性别" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.reqGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="特殊需求" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.specialReq }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.marks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="本单预计总价" prop="predictPrice" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.predictPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="本单实际总价" prop="actualPrice" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.actualPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button class="action" type="text" @click="handleEdite(row)">编辑</el-button>
          <el-button class="action" type="text" @click="checkDetail(row)">详情</el-button>

          <el-dropdown>
            <span class="el-dropdown-link action">
              更多
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="text" @click="handleFished(row)">完成</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="action" type="text" @click="confirmDetele(row, $index)">删除</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="text" @click="handleAutoDspatch(row)">自动派遣</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="text" @click="handelManualDispatch(row)">手动派遣</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="subParams.page"
      :limit.sync="subParams.limit"
      @pagination="getTaskList"
    />
    <AutoDispatch
      v-if="dialogFormVisible"
      :dialog-form-visible="dialogFormVisible"
      :dialog-status="dialogStatus"
      :row-data="rowData"
      @dialogFormVisible="closeFormDialog"
      @refresh="refresh"
    />
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import { getTaskList, deleteTask } from '@/api/task'
import Pagination from '@/components/Pagination' // secondary p
import { FromModel } from '@/utils/constant'
import AutoDispatch from './operation/AutoDispatch'

@Component({
  components: {
    Pagination,
    AutoDispatch
  },
  filters: {}
})
export default class TaskTable extends Vue {
  list = []
  total = 0
  listLoading = true
  subParams = {
    page: 1,
    limit: 10,
    sort: 'asc/desc',
    sortBy: 'id'
  }
  rowData = {}
  dialogFormVisible = false
  formModel = FromModel.create

  created() {
    this.getTaskList()
  }

  // 获取任务信息列表
  getTaskList() {
    this.listLoading = true
    getTaskList(this.subParams).then(res => {
      this.list = res.data.items
      this.total = res.data.total
      this.listLoading = false
    })
  }

  // 排序
  sortChange(data) {
    const { prop, order } = data
    this.subParams.sortBy = prop
    this.subParams.sort = order
  }

  // 点击新增任务按钮
  handelAdd() {
    this.formModel = FromModel.create
    this.dialogFormVisible = true
  }

  // 点击编辑按钮
  handleEdite(row) {
    this.rowData = row
    this.formModel = FromModel.edit
    this.dialogFormVisible = true
  }
  // 查看详情
  checkDetail(row) {
    this.rowData = row
    this.formModel = FromModel.check
    this.dialogFormVisible = true
  }
  // 点击删除按钮
  confirmDetele(row, index) {
    deleteTask(this.formData).then(res => {
      if (res.code === 20000) {
        this.$notify.success({
          title: '成功',
          message: '删除任务成功！'
        })
        this.refresh()
      } else {
        this.$notify.error({
          title: '失败',
          message: '删除任务失败，请重试！'
        })
      }
    })
  }

  // 关闭表单后清空数据项
  closeFormDialog() {
    this.rowData = {}
    this.dialogFormVisible = false
  }
  // 自动派遣
  handleAutoDspatch() {}

  // 手动派遣
  handelManualDispatch() {}

  // 完成
  handleFished() {}
  // 刷新列表
  refresh() {
    this.dialogFormVisible = false
    this.getTaskList()
  }
  getSortClass(key) {
    const sort = this.subParams.sort
    return sort === `+${key}` ? 'ascending' : 'descending'
  }
}
</script>
<style lang="scss" scoped>
.task-container {
  .table-filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .filter-item {
      margin-bottom: 10px;
    }
    .refresh {
      margin-right: 16px;
    }
  }
  .action {
    margin: 0 8px;
  }
}
.el-dropdown-link {
  margin-left: 8px;
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
