<template>
    <div class="index">
        <!--使用HeadNav组件-->
        <HeadNav></HeadNav>
        <LeftMenu></LeftMenu>
        <div class="rightContainer">
            <!-- 必须添加，否则二级路由页面不能显示 -->
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    // 引入 HeadNav 组件
    import HeadNav from '../components/HeadNav';
    import LeftMenu from '../components/LeftMenu';

    export default{
        name: "index",
        // components里注册一下HeadNav
        components: {
            HeadNav,
            LeftMenu
        }
    };
</script>

<style scoped>
    .index {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .rightContainer {
        position: relative;
        top: 0;
        left: 180px;
        width: calc(100% - 180px);
        height: calc(100% - 71px);
        overflow: auto;
    }
</style>
