<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <!-- 添加区域 -->
            <el-row :gutter="20">
                <el-col :span="2">
                    <el-button type="primary" @click="showAddCateDialog">添加商品分类</el-button>
                </el-col>
            </el-row>

            <!-- 商品分类列表 -->
            <tree-table class="treeTab" 
            :data="catelist" 
            :columns="columns" 
            :selection-type="false"
            :expand-type="false"
            show-index>
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                    </el-tooltip>
                     <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button size="mini" type="danger" icon="el-icon-deleted" @click="removeCate(scope.row)">删除</el-button>
                    </el-tooltip>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-sizes="[5, 10, 100, 500]"
                :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加商品分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <!-- 添加分类的表单 -->
            <el-form 
            :model="addCateForm" 
            :rules="addCateFormRules" 
            ref="addCateFormRef" 
            label-width="80px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                     <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="{
                             expandTrigger: 'hover',
                             ...cascaderProps,
                             checkStrictly: 'true'
                            }"
                        @change="parentCateChanged" :clearable="true">
                    </el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editCateDialogVisible"
            width="50%">
            
            <!-- 编辑分类表单区域 -->
            <el-form ref="editCateRef" :model="editCate" :rules="editCateRules" label-width="80px">
                <el-form-item label="分类名称">
                    <el-input v-model="editCate.cat_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分配数据列表
            catelist: [],
            // 查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 总数据条数
            total: 0,
            // 为table 指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 将当前列定义为模版列
                    type: 'template',
                    // 当前列使用的模版名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            // 控制添加对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                cat_name: '',
                // 父级分类id
                cat_pid: 0,
                // 当前分类的等级
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级分类列表对象
            parentCateList: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 选中的父级分类的id数组
            selectedKeys: [],
            // 控制编辑分类对话框的显示与隐藏
            editCateDialogVisible:  false,
            // 编辑分类的cate_id
            editCateId:0,
            // 编辑分类表单数据
            editCate: {},
            // 编辑分类的验证规则对象
            editCateRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const {data: res} = await this.$http.get('categories', {params: this.querInfo})
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败')
            }
            //console.log(res.data.result)
            this.catelist = res.data.result
            this.total = res.data.total
            // console.log(this.catelist)
        },
        // 监听pagesize改变事件
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum 的改变事件
        handleCurrentChange(newPage) {
            this.querInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击按钮展示添加分类的对话框
        showAddCateDialog() {
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const {data: res} = await this.$http.get('categories', {params: {type: 2}})
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败')
            }
            // console.log(res.data)
            this.parentCateList = res.data
        },
        // 选择项发生变化时触发这个函数
        parentCateChanged() {
            // console.log(this.selectedKeys)
            // 如果selectedKey数组大雨0则证明选中，否则没有选中
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
            }
        },
        // 添加分类
        addCate() {
            // console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return 
                const {data: res} = await this.$http.post('categories', this.addCateForm)
                // console.log(this.addCateForm)
                // console.log(res)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件，重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 展示编辑分类的对话框
        async showEditDialog (cateInfo) {
            // console.log(cateInfo)
            this.editCateId = cateInfo.cat_id
            const {data: res} = await this.$http.get('categories/' + this.editCateId)
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('获取分类信息失败')
            }
            this.editCate = res.data
            console.log(this.editCate)
            // 根据cat_id 查询分类的信息
            this.editCateDialogVisible = true
        },
        // 保存编辑分类
        saveEditCate() {
            // console.log(this.editCate)
            this.$refs.editCateRef.validate(async valid => {
                if (!valid) return 
                const {data: res} = await this.$http.put('categories/' + this.editCate.cat_id, 
                {cat_name: this.editCate.cat_name})
                // console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('更新分类信息失败')
                } 
                this.getCateList()
                this.editCateDialogVisible = false
            })
        },
        // 删除分类
        async removeCate(cateInfo) {
            // console.log(cateInfo.cat_id)
            const confirmRustle = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmRustle)
            if (confirmRustle !== 'confirm') {
                return this.$message.error('已取消删除操作')
            }
            const {data: res} = await this.$http.delete('categories/' + cateInfo.cat_id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除分类失败')
            }
            this.$message.success('删除分类成功')
            this.getCateList()
        }
    }
}
</script>

<style lang="less" scoped>
.treeTab {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}

</style>
