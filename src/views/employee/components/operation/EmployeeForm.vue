<template>
  <el-dialog
    :title="textMap[formModel]"
    :visible.sync="dialogFormVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="700px"
    top="10px"
    :before-close="
      () => {
        this.$emit('dialogFormVisible')
      }
    "
  >
    <el-form
      ref="employeeForm"
      :rules="rules"
      :model="formData"
      label-width="110px"
      label-position="right"
      :disabled="formDisabled"
      style="width: 500px; margin-left: 50px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" type="input" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="formData.gender" label="男" />
        <el-radio v-model="formData.gender" label="女" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="formData.age" :min="1" :max="100" />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNum">
        <el-input v-model="formData.phoneNum" type="input" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="是否接受小时工" prop="isAcceptHour">
        <el-radio v-model="formData.isAcceptHour" label="是" />
        <el-radio v-model="formData.isAcceptHour" label="否" />
      </el-form-item>
      <el-form-item label="时薪" prop="hourSalary">
        <el-input v-model="formData.hourSalary">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="日薪" prop="daySalary">
        <el-input v-model="formData.daySalary">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="formData.address" />
      </el-form-item>
      <el-form-item label="其他联系方式" prop="otheContactInfo">
        <el-input v-model="formData.otheContactInfo" type="input" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="身份证" prop="identifyID">
        <el-input v-model="formData.identifyID" type="input" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="特长与技术" prop="technology">
        <el-input
          v-model="formData.technology"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        @click="
          () => {
            this.$emit('dialogFormVisible')
          }
        "
      >取消</el-button>
      <el-button
        type="primary"
        @click="formModel == 'CREATE' ? addEmployeeSubmit() : editEmployeeSubmit()"
      >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { addEmployee, editEmployee } from '@/api/employee'
import { FromModel } from '@/utils/constant'

@Component({})
export default class EmployeeForm extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  dialogFormVisible

  @Prop({
    type: String,
    default: FromModel.create
  })
  formModel

  @Prop({
    type: Object,
    default: () => {}
  })
  rowData

  formDisabled = false
  formData = {
    id: '',
    name: '',
    gender: '男',
    age: '',
    phoneNum: '',
    hourSalary: '',
    daySalary: '',
    address: '',
    otheContactInfo: '',
    identifyID: '',
    technology: '',
    evaluate: '',
    isAcceptHour: '是',
    remark: ''
  }
  textMap = {
    [FromModel.create]: '新增人员信息',
    [FromModel.edit]: '编辑人员信息',
    [FromModel.check]: '查看人员信息'
  }
  rules = {
    name: [{ required: true, message: '此项必填', trigger: 'change' }],
    age: [
      { required: true, message: '此项必填', trigger: 'change' },
      { type: 'number', message: '年龄必须为数字', trigger: ['blur', 'change'] }
    ],
    phoneNum: [
      { required: true, message: '此项必填', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的电话号码', trigger: ['blur', 'change'] }
    ],
    hourSalary: [{ required: true, message: '此项必填', trigger: 'change' }],
    daySalary: [{ required: true, message: '此项必填', trigger: 'change' }],
    identifyID: [{ required: true, message: '此项必填', trigger: 'change' }],
    address: [{ required: true, message: '此项必填', trigger: 'change' }]
  }
  created() {}

  mounted() {
    if (this.rowData) {
      this.formData = this.rowData
    }
    this.formDisabled = this.formModel === FromModel.check
  }

  // 新增劳务人员信息
  addEmployeeSubmit() {
    this.$refs['employeeForm'].validate(valid => {
      if (valid) {
        this.formData.id = parseInt(Math.random() * 100) + 1024 // mock a id
        addEmployee(this.formData).then(res => {
          if (res.code === 20000) {
            this.$notify.success({
              title: '成功',
              message: '新增人员信息成功！'
            })
            this.$emit('refresh')
          } else {
            this.$notify.error({
              title: '失败',
              message: '新增人员信息失败，请重试！'
            })
          }
        })
      }
    })
  }

  // 更新劳务人员信息
  editEmployeeSubmit() {
    this.$refs['employeeForm'].validate(valid => {
      if (valid) {
        editEmployee(this.formData).then(res => {
          if (res.code === 20000) {
            this.$notify.success({
              title: '成功',
              message: '编辑人员信息成功！'
            })
            this.$emit('refresh')
          } else {
            this.$notify.error({
              title: '失败',
              message: '编辑人员信息失败，请重试！'
            })
          }
        })
      }
    })
  }
}
</script>
<style lang="scss"></style>
