<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--  内容主体区域 -->
        <el-card>
            <el-row>
                <!-- 搜索 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>

                <!-- 添加 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addGood">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 数据列表区域 -->
            <el-table
            :data="goodsList"
            stripe
            style="width: 100%">
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="商品名称" prop="goods_name" width="500px">
                </el-table-column>
                <el-table-column label="商品价格" prop="goods_price">
                </el-table-column>
                <el-table-column label="商品重量" prop="goods_weight">
                </el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
        </el-table>
        </el-card>

        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :background="true">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询参数
            queryInfo: {
                query: '',
                pagesize: 10,
                pagenum: 1
            },
            // 存放商品列表数据对象
            goodsList: [],
            // 商品总量
            total: 0
        }
        
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 获取商品列表
        async getGoodsList() {
            // goods get  params: pagesize pqgenum
            const {data: res} = await this.$http.get('/goods', {params: this.queryInfo})
            // console.log(res.data.total)
            if (res.meta.status !== 200) {
                return this.$message.error('获取列表数据失败')
            }
            // this.$message.success("商品数据获取成功")
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        // 监听pagesize的变事件
        handleSizeChange(newPageSize) {
            // console.log(newPageSize)
            this.queryInfo.pagesize = newPageSize
            this.getGoodsList()
        },
        // 监听当前页变化的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 删除
        async removeGoods(goods_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.error('删除已取消')
            }
            // console.log(goods_id)
            const {data: res} = await this.$http.delete('/goods/' + goods_id)
            // console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getGoodsList()
        },
        // 添加商品
        addGood() {
            this.$router.push('/goods/add')
        }
    }
}
</script>

<style lang="less" scoped>

</style>
