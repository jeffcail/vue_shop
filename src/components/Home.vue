<template>
    <el-container class="home-container">
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <img src="../assets/vue-shop.png" alt="" width="50px" height="50px">
                    <span>VUE-SHOP电商后台管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <!-- 页面主体区域 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle-button" @click="toglleCollapse">|||</div>
                    <el-menu background-color="#333744" text-color="#fff" 
                    active-text-color="#409FFF" 
                    :unique-opened="true" 
                    :collapse="isCollapse" 
                    :collapse-transition="false" 
                    :router="true"
                    :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模版区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="iconfont" :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        
                        <!-- 二级菜单 -->
                        <el-menu-item v-for="subItem in item.children" 
                        :key="subItem.id" 
                        :index="subItem.path + ''" 
                        @click="saveNavState(subItem.path + '')">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 右侧主体部分 -->
                <el-main>
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            iconsObj: {
                '125': 'el-icon-user',
                '103': 'el-icon-coordinate',
                '101': 'el-icon-goods',
                '102': 'el-icon-shopping-cart-full',
                '145': 'el-icon-s-data'
            },
            // 是否折叠
            isCollapse: false,

            // 保存激活的链接
            activePath: ''
        }
    },
    created() {
        this.getMenuList(),
        this.activePath = window.sessionStorage.getItem("activePath")
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push();
        },
        // 获取所有的菜单
        async getMenuList() {
            const {data: res} = await this.$http.get('menus')
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        // 点击按钮切换菜单的折叠和展开
        toglleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4A5064;
    color: white;
    font-size: 15px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
