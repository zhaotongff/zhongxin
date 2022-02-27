<template>
  <div class="employee-container">
    <div class="table-filter">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handelAdd">新增人员信息</el-button>
      <el-button class="refresh" type="text" @click="refresh">刷新</el-button>
    </div>

    <el-table
      :key="'0'"
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
      <el-table-column label="姓名" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" width="80" align="center">
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.status | statusFilter" />
        </template>
      </el-table-column>
      <el-table-column label="住址" width="140px">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phoneNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其他联系方式" align="center" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.otheContactInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="年龄"
        sortable="custom"
        prop="age"
        :class-name="getSortClass('age')"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.identifyID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="特长与技术" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.technology }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前评价"
        sortable="custom"
        prop="evaluate"
        :class-name="getSortClass('evaluate')"
        width="100"
      >
        <template slot-scope="{ row }">
          <span :class="{ red: row.evaluate < 30 }">{{ row.evaluate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="日薪"
        sortable="custom"
        prop="salary"
        :class-name="getSortClass('salary')"
        width="100"
      >
        <template slot-scope="{ row }">
          <span>{{ row.daySalary }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.marks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否接受小时工" class-name="status-col" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.isAcceptHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button class="action" type="text" @click="handleEdite(row)">编辑</el-button>
          <el-button class="action" type="text" @click="checkDetail(row)">详情</el-button>
          <el-button class="action" type="text" @click="confirmDetele(row, $index)">删除</el-button>
          <!-- <el-popconfirm title="确定删除改人员信息吗？" @confirm="confirmDetele(row, $index)">
            <el-button slot="reference" class="action" type="text">删除</el-button>
          </el-popconfirm>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="subParams.page"
      :limit.sync="subParams.limit"
      @pagination="getList"
    />
    <EmployeeForm
      v-if="dialogFormVisible"
      :dialog-form-visible="dialogFormVisible"
      :form-model="formModel"
      :row-data="rowData"
      @dialogFormVisible="closeFormDialog"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { getEmployeeList, deleteEmployee } from '@/api/employee'
import Pagination from '@/components/Pagination' // secondary p
import { FromModel } from '@/utils/constant'
import EmployeeForm from './operation/EmployeeForm'
@Component({
  components: {
    Pagination,
    EmployeeForm
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'green-circle', // 空闲
        2: 'yellow-circle', // 派遣中
        3: 'red-circle' // 忙碌
      }
      return statusMap[status]
    }
  }
})
export default class EmployeeTable extends Vue {
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
    this.getList()
  }

  // 获取劳务人员信息列表
  getList() {
    this.listLoading = true
    getEmployeeList(this.subParams).then(res => {
      this.listLoading = false
      if (res.code === 20000) {
        this.list = res.data.items
        this.total = res.data.total
      } else {
        this.$notify.error({
          title: '失败',
          message: '获取列表失败，请重试！'
        })
      }
    })
  }

  // 排序
  sortChange(data) {
    const { prop, order } = data
    this.subParams.sortBy = prop
    this.subParams.sort = order
  }

  // 点击新增人员按钮
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
    deleteEmployee(this.formData).then(res => {
      if (res.code === 20000) {
        this.$notify.success({
          title: '成功',
          message: '删除人员成功！'
        })
        this.refresh()
      } else {
        this.$notify.error({
          title: '失败',
          message: '删除人员失败，请重试！'
        })
      }
    })
  }

  // 关闭表单后清空数据项
  closeFormDialog() {
    this.rowData = {}
    this.dialogFormVisible = false
  }

  // 刷新列表
  refresh() {
    this.dialogFormVisible = false
    this.getList()
  }
  getSortClass(key) {
    const sort = this.subParams.sort
    return sort === `+${key}` ? 'ascending' : 'descending'
  }
}
</script>
<style lang="scss" scoped>
.employee-container {
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
.red {
  color: red;
}
</style>
