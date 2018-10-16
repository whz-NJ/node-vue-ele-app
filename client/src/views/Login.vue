<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">米修在线后台管理系统</span>
                <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="60px" class="loginForm">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="loginUser.email" placeholder="请输入email"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登录</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
                    </div>
                </el-form>
            </div>
        </section>
    </div>
</template>
<script>
    import jwt_decode from 'jwt-decode';

    export default{
        name: "login",
        components: {},
        data(){
            return {
                loginUser:{
                    email:"",
                    password:""
                },
                rules: {
                    email: [
                        {
                            type: "email",
                            required: true,
                            message: "邮箱格式不正确",
                            trigger: "blur"
                        }
                    ],
                    password: [
                        { required: true, message: "密码不能为空", trigger: "blur" },
                        { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                //console.log(formName); 输出"loginForm"
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 请求后台做Login鉴权
                        this.$axios.post('/api/users/login', this.loginUser).then(res => {
                            // 登录成功
                            const { token } = res.data;
                            // console.log(token);
                            const decoded = jwt_decode(token);
                            // console.log(decoded);
                            //token 存储到vuex中（isEmpty判断对象是否为空的公共方法，在Login.vue后面定义）
                            this.$store.dispatch("setIsAuthenticated", !this.isEmpty(decoded));
                            this.$store.dispatch("setUser", decoded);
                            localStorage.setItem("eleToken", token);
                            this.$router.push('/index'); //注册成功后，自动跳转到主页面
                        });
                    }
                    // else {
                    //     console.log('error submit!!');
                    //     return false;
                    // }
                });
            },
            isEmpty(value) {
                return (
                    value === undefined ||
                    value === null ||
                    (typeof value === "object" && Object.keys(value).length === 0) ||
                    (typeof value === "string" && value.trim().length === 0)
                );
            }
        }
    };
</script>

<style scoped>
    .login {
        position: relative;
        width: 100%;
        height: 100%;
        background: url(../assets/bg.jpg) no-repeat center center;
        background-size: 100% 100%;
    }
    .form_container {
        width: 370px;
        height: 210px;
        position: absolute;
        top: 20%;
        left: 34%;
        padding: 25px;
        border-radius: 5px;
        text-align: center;
    }
    .form_container .manage_tip .title {
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: 26px;
        color: #fff;
    }
    .loginForm {
        margin-top: 20px;
        background-color: #fff;
        padding: 20px 40px 20px 20px;
        border-radius: 5px;
        box-shadow: 0px 5px 10px #cccc;
    }

    .submit_btn {
        width: 100%;
    }
    .tiparea {
        text-align: right;
        font-size: 12px;
        color: #333;
    }
    .tiparea p a {
        color: #409eff;
    }
</style>
