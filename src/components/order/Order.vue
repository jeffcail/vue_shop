<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索框 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
                    <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表区域 -->
            <el-table :data="orderList" stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格">
                </el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="定位" placement="top">
                            <el-button size="mini" type="success" icon="el-icon-location-outline" @click="showProgress"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

            <!-- 修改地址对话框 -->
            <el-dialog
            title="修改地址的对话框"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="resetForm">
            
            <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader 
                :options="cityData"
                v-model="addressForm.address1"
                :props="{ expandTrigger: 'hover' }">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

            <!-- 物流进度对话框 -->
            <el-dialog
            title="物流进度"
            :visible.sync="progressDialogVisible"
            width="50%">
            <span>这是一段信息</span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import cityData from './cityaddress.js'

export default {
    data() {
        return {
            orderList: [],
            // 查询条件
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            editDialogVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            addressRules: {
                address1: [
                    { required: true, message: '请选择省市区县', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },
            cityData,
            progressDialogVisible: false,
            progressInfo: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', {
                params: this.queryInfo
            })
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单数据失败')
            }
            // console.log(res.data)
            this.total = res.data.total
            this.orderList = res.data.goods
        },
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize = newPageSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showEdit() {
            this.editDialogVisible = true
        },
        resetForm() {
            this.$refs.addressFormRef.resetFields()
        },
        // 物流进度
        async showProgress() {
            // 物流信息查询 /kuaidi/:id  get 804909574412544580
            const {data: res} = await this.$http.get('/kuaidi/804909574412544580')
            if (res.meta.status !== 200) {
                return this.$message.error('获取物流进度信息失败')
            }
            this.progressInfo = res.data
            this.progressDialogVisible = true
            console.log(this.progressInfo)
        }
    }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
