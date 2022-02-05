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
            <el-row>
                <el-col :span="7">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>

                <el-col :span="4">
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>