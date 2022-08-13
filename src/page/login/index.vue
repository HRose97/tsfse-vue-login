<template>
    <div id="login-part">
        <div class="title">登录</div>
        <!-- 
            需要的数据
            用户名/邮箱/手机号
            密码
         -->
        <div class="=login-form-part">
            <el-form label-width="80px" size="medium">
                <el-form-item label="账 号" :required ="true">
                    <el-input v-model="userVo.userName" placeholder="用户名/手机号/邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密 码" :required="true">
                    <el-input v-model="password" type="password"  placeholder="请输入密码"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button  @click="showVerification" type="primary">登 录</el-button>
                    <span >
                        <a style="color: #7e8c8d; text-decoration: none" 
                        href="#/regust">未注册？ 注册新账号</a>
                    </span>
                    <span >
                        <a style="margin-left: 20px; color: #3E76D4; text-decoration: none" 
                        href="#/forgot">忘记密码?</a>
                    </span>
                </el-form-item>

            </el-form>
        </div>
        <div class="verification-part">
            <Verify
            ref="verify"
            :captcha-type="'blockPuzzle'"
            :img-size="{width:'400px',height:'200px'}"
            @success="login"
            />
        </div>
    </div>
</template>



<script>

    import * as api from '../../network/api' 
    import Verify from '../../components/verifition/Verify.vue'
    import * as md5 from '../../utils/md5' 

    export default {
        components:{
            Verify
        },
        data(){
            return{
                userVo:{
                    userName:'',
                    password:''
                },
                password:''
            }
        },
        methods:{
            showVerification(){
                    //检查账号是否填写
                    //发送之前检查邮箱地址  不可以为空 
                    if(this.userVo.userName === ''){
                        //给出提示
                        this.$message.error("请输入用户名/手机号/邮箱");
                        return;
                    }
                    if(this.password === ''){
                        //给出提示
                        this.$message.error("密码不可以为空");
                        return;
                    }
                    this.$refs.verify.show();
                },
            login(params) {
                //计算MD5摘要信息
                this.userVo.password = md5.hex_md5(this.password);
                //登录
                api.userLogin(params.captchaVerification,this.userVo).then(result => {
                    if(result.code === api.SUCCESS_CODE){
                        this.$message.success(result.msg);
                        //登录成功，跳转到首页
                        let userVo = result.data;
                        window.localStorage.setItem("avatar",userVo.avatar);
                        window.localStorage.setItem("user_name",userVo.userName);
                        this.$router.push({
                            path:'/index'
                        })
                    }else{
                        //给出提示
                        //接口异常
                        this.$message.error(result.msg);
                    }
                })
            },
        }
    
    }
    
</script>

<style >
    .login-form-part  {
        margin-top :250px;
    }

    .login-form-part  .el-input {
        width: 250px;
    }


</style>