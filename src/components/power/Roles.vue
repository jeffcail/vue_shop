<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <!-- <el-col :span="7">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col> -->
                <el-col :span="2">
                    <el-button type="primary" @click="addDialodRole = true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表数据 -->
            <el-table :data="roleList" stripe="">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                                    {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="['bdtop', i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                        </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName
                                            }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>
                            {{scope.row}}
                        </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述"prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable=false>
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDiablog(scope.row.id)">编辑</el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable=false>
                            <el-button  size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable=false>
                            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                        </el-tooltip>
                
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色区域 -->
            <el-dialog
                title="添加角色"
                :visible.sync="addDialodRole"
                width="50%">
                
                <el-form :model="addForm" ref="addFormRef" :rules="addRoleRules" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addForm.roleName"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="addForm" :rules="addRoleRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="角色描述" prop=roleDesc>
                        <el-input v-model="addForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogClosed">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑角色区域 -->
            <el-dialog
                title="添加角色"
                :visible.sync="editDialodRole"
                width="50%">
                
                <el-form :model="editForm" ref="editFormRef" :rules="editRoleRules" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop=roleDesc>
                        <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogClosed">取 消</el-button>
                    <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配权限 -->
            <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogViable"
            width="50%"
            @close="setRightsDialogClosed">
            
            <!-- 树形控件 -->
            <el-tree :data="rightsList" :props="treeProps" 
            show-checkbox node-key="id" 
            default-expand-all
            :default-checked-keys="defkeys"
            ref="treeRef"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogViable = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色的列表数据
            roleList: [],
            // 添加角色隐藏对话框
            addDialodRole: false,
            // 添加表单验证规则
            addRoleRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            // 添加表单--数据对象
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            // 编辑角色隐藏对话框 
            editDialodRole: false,
            // 编辑表单验证规则
            editRoleRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            // 编辑表单--数据对象
            editForm: {},
            // 控制分配权限对话框的显示
            setRightDialogViable: false,
            // 所有权限数据
            rightsList: [],
            // 树形控件的数据对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的数据
            defkeys: [],
            // 即将分配权限的角色id
            roleId: ''
        }
    },
    created() {
        this.getRoleList()
    }, 
    methods: {
        // 获取所有角色的列表
        async getRoleList() {
            const {data: res} = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败')
            }
            this.roleList = res.data
            console.log(this.roleList)
        },
        // 根据id删除对应的权限
        async removeRightById(role, rightd) {
            // 弹窗提示是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') {
                return this.$message.error('取消了删除')
            }
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightd}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            // this.getRoleList()
            role.children = res.data
        },
        // 监听点击取消重置表单
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
            this.addDialodRole = false
        }, 
        // 添加角色
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                const {data: res} = await this.$http.post('roles',this.addForm)
                console.log(res)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加角色失败')
                }
                this.addDialodRole = false
                this.$message.success('添加角色成功')
                this.getRoleList()
            })
        },
        // 点击编辑展示对话框
        async showEditDiablog(id) {
            // console.log(id)
            const {data: res} = await this.$http.get('roles/' + id)
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('查询角色信息失败')
            }
            // console.log(res.data)
            this.editForm = res.data
            this.editDialodRole = true
        },
        // 编辑对话框，点击取消重置表单为空
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
            this.editDialodRole = false
        },
        // 编辑角色预校验--编辑角色信息提交
        editUser() {
            this.$refs.editFormRef.validate(async valid => {
                // if (!valid) return 
                const {data: res} = await this.$http.put("roles/" + this.editForm.roleId,
                {roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc})
                console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('修改角色失败')
                }

                this.$message.success('修改角色成功')
                this.editDialodRole = false
                this.getRoleList()
            })
        },
        // 根据id删除角色
        async removeRoleById(id) {
            // console.log(id)
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.error('已取消删除')
            }
            const {data: res} = await this.$http.delete('roles/' + id)
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getRoleList()
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id
            // console.log(role)
            const {data: res} = await this.$http.get('rights/tree')
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('获取所有权限失败')
            }
            // 把获取到的权限数据保存到 rightsList 中
            this.rightsList = res.data
            // console.log(this.rightsList)
            this.getLeafKeys(role, this.defkeys)
            this.setRightDialogViable = true
        },
        // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defkeys数组中
        getLeafKeys(node, arr) {
            // 如果当前node节点不包含children属性则是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => (
                this.getLeafKeys(item, arr)
            ))
        },
        // 监听权限对话框的关闭事件
        setRightsDialogClosed() {
            this.defkeys = []
        },
        // 角色授权
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys)
            const ids = keys.join(',')
            const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: ids})
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRoleList()
            this.setRightDialogViable = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdottom {
    border-top: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
