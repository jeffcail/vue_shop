<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 警告区域 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关的参数！"
                type="warning"
                :closable="false"
                show-icon>
            </el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cate_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                    v-model="selectedCateKeys"
                    :options="cateList"
                    :props="{ 
                        expandTrigger: 'hover' ,
                        ...cateProps
                    }"
                    @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!--   tab 标签区域 -->
              <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible = true">添加动态参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag 标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>

                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible = true">添加静态属性</el-button>
                    <!-- 静态属性表格数据 -->
                    <el-table :data="onlyTableData" stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag 标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加动态参数对话框区域 -->
            <el-dialog
            :title="'添加' + tileText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="resetDialogClosed">
                <!-- 表单区域 -->
                <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="80px">
                    <el-form-item :label="tileText" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改动态参数对话框区域 -->
            <el-dialog
            :title="'修改' + tileText"
            :visible.sync="editDialogVisible"
            width="50%">
                <!-- 表单区域 -->
                <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
                    <el-form-item :label="tileText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEditParams">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            cateList: [],
            // 级联选择器框的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定的数据
            selectedCateKeys:[],
            // 默认选中的标签名称
            activeName: 'many',
            // 动态参数
            manyTableData: [],
            // 静态参数
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据
            addForm:{},
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [
                    { required: true, message: '必填参数', trigger: 'blur' }
                ]
            },
            editDialogVisible: false,
            editFormRules: {
                attr_name: [
                    { required: true, message: '必填参数', trigger: 'blur' }
                ]
            },
            editForm: {},
            // 控制按钮文本框的切换形式
            inputVisible: false,
            // 文本框中输入的内容
            inputValue: ''
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const {data: res} = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类数据失败')
            }
            this.cateList = res.data
            //console.log(this.cateList)
        },
        // 级联选择框选中项变化，会触发的函数
        handleChange() {
            this.getParamsData()
        },
        // tab标签点击事件的处理函数
        handleTabClick() {
            //console.log(this.activeName)
            this.getParamsData()
        },
        async getParamsData() {
            // 如果选中的不是三级类
            // if (this.selectedCateKeys != 3) {
            //     this.selectedCateKeys = []
            //     return this.$message.error('只能选择三级分类')
            // }
            // 证明选中的是三级类
            // 根据所选分类的id,和当前所处的面板，获取对应的参数
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel:this.activeName}})
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('获数据失败')
            }
            // console.log(res.data)
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : [] 
                // 添加一个boolean值
                // this.$set(element, inputVisible, false)
                // this.$set(element, inputValue, '')
                element.inputVisible = false
                element.inputValue = ''
            });
            if (this.activeName === 'many') { // 动态参数
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
        },
        // 对话框表单重置
        resetDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加动态参数
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid)
                if (!valid) return 
                const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, 
                {attr_name: this.addForm.attr_name, attr_sel: this.activeName})
                // console.log(res)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                this.getParamsData()
                this.addDialogVisible = false
            })
        },
        // 添加按钮展示修改对话框
        async showEditDialog(attr_id) {
            //console.log(attr_id)
            const {data: res} = await this.$http.get(`categories/${this.cateId}}/attributes/${attr_id}`, 
            {params: {attr_sel: this.activeName}})
            if (res.meta.status !== 200) {
                return this.$message.error('获取参数信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 保存动态参数修改
        saveEditParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, 
                {attr_name: this.editForm.attr_name, attr_sel: this.activeName})
                if (res.meta.status !== 200) {
                    return this.$message.error('修改失败')
                }
                this.$message.success('修改成功')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        // 删除
        async deleteParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.error('取消了删除操作')
            }
            const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getParamsData()
        },
        // 文本框失去焦点，或摁下 Enter 触发
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false 
                return 
            }
            // 如果没有return ，则证明输入的内容，需要做后续的处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            // 需要发起请求，保存这次操作
            // categories/:id/attributes/:attrid  put
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, 
            {attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')})
            if (res.meta.status !== 200) {
                return this.$message.error('修改参数项失败')
            }
            this.$message.success('修改参数项成功')
        },
        // 点击按钮，展示文本
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获得焦点
            // $nextTick函数的作用 当页面的元素被重新渲染之后，才会执行函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除对应的参数选项
        async handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, 
            {attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')})
            if (res.meta.status !== 200) {
                return this.$message.error('删除参数项失败')
            }
            this.$message.success('删除参数项成功')
        }
    },
    // 计算属性
    computed: {
        // 如果按钮需要被禁用，则返回true，否则返回false
        isBtnDisable() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类的id
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 动态计算标题的文本
        tileText() {
            if (this.activeName === 'many') {
                return "动态参数"
            } else {
                return "静态属性"
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cate_opt {
    margin: 15px 0;
}

.el-col {
    display: flex;
    margin-left: 0px;
}

.el-cascader {
    margin-left: 10px;
    margin-top: -8px;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 120px;
}
</style>
