<template>
    <div class="regust-page">
        <div class="title">注册</div>
        <div class="regust-from-part">
            <el-form label-width="80px" size="small">
                <el-form-item label="邮箱地址" :required="true">
                    <el-input v-model="userVo.email" @blur="checkMailCode"></el-input>
                    <el-button  Style="margin-left: 10px;" type="primary" 
                                @click="showVerification" :disabled="mailCodeSendDisable">
                        {{mailCodeSendBtnWords}}
                    </el-button>
                </el-form-item>
                <el-form-item label="验证码" :required="true">
                    <el-input v-model="emailCode" @blur="checkMailCode"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :required="true">
                    <el-input v-model="userVo.userName" :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>

                <el-dropdown>
                <span class="el-dropdown-link">
                    用户类型<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>系统用户</el-dropdown-item>
                    <el-dropdown-item disabled>超级用户</el-dropdown-item>
                    <el-dropdown-item disabled>贵宾</el-dropdown-item>
                    <el-dropdown-item divided>平台管理员</el-dropdown-item>
                    <el-dropdown-item>赛事管理员</el-dropdown-item>
                    <el-dropdown-item>球队管理用户</el-dropdown-item>
                    <el-dropdown-item>游客/访客</el-dropdown-item>
                    <el-dropdown-item>会员用户</el-dropdown-item>
                    <el-dropdown-item>队伍管理员</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>

                <el-form-item label="手机号">
                    <el-input v-model="userVo.phonenumber" :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>
                <el-form-item label="密码" :required="true">
                    <el-input v-model="userVo.password" type="password" :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  @click="regust" type="primary" :disabled="!isMailCodeCompleted">注册</el-button>
                    <span style="margin-left: 20px; color: #7e8c8d">
                        已注册？ 直接登录
                    </span>
                </el-form-item>
            </el-form>
        </div>
        <div class="verification-part">

            <Verify
            ref="verify"
            :captcha-type="'blockPuzzle'"
            :img-size="{width:'400px',height:'200px'}"
            @success="sendEmailCode"
            />
        </div>
    </div>
</template>

<script>
    //import e from 'express';
import * as api from '../../network/api' 
import Verify from '../../components/verifition/Verify.vue'

    export default {
        components: {
            Verify   
        },
        data() {
            return {
                userVo: {
                    email: '',
                    userName: '',
                    phonenumber:'',
                    password: '',
                },
                emailCode:'',
                // 验证码没填写 后面的内容不允许写入
                isMailCodeCompleted: false,
                mailCodeSendDisable: false,
                mailCodeSendBtnWords: '发送验证码'
            }
        },
        methods:{
            showVerification(){
                //检查邮箱是否正确的代码提前写道这了
                //发送之前检查邮箱地址  不可以为空 
                if(this.userVo.email === ''){
                    //给出提示
                    this.$message.error("请输入邮箱地址");
                    return;
                }
                //要符合邮箱的规则 
                // TODO
                   // 检查邮箱格式，判空
                let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
                if (!reg.test(this.userVo.email)) {
                    this.$message.error("邮箱地址格式不正确");
                    return
                }
                this.$refs.verify.show();
            },
            regust(){
                // 检查数据
                if(this.userVo.email === ''){
                    this.$message.error("请填写邮箱地址");
                    return;
                }
                if(this.userVo.emailCode === ''){
                    this.$message.error("请填写验证码");
                    return;
                }
                if(this.userVo.userName === ''){
                    this.$message.error("请填写用户名");
                    return;
                }
                if(this.userVo.phonenumber === ''){
                    this.$message.error("请填写手机号");
                    return;
                }
                if(this.userVo.password === ''){
                    this.$message.error("请设置密码");
                    return;
                }
                api.registerAccount(this.userVo).then(result => {
                   if(result.code === api.SUCCESS_CODE){
                    //注册成功，跳转到登录页面
                    this.$message.success(result.msg);
                    this.$router.push({
                        path:'/login'
                    })
                   }else{
                    //给出提示
                    this.$message.error("注册失败");
                   }
                })
            },
            sendEmailCode(params){
                console.log(params);
                console.log(params.captchaVerification,this.userVo.email);
                //发送邮箱验证码
                api.sendMailCode(encodeURIComponent(params.captchaVerification), this.userVo.email).then(result => {
                    if(result.code === api.SUCCESS_CODE){
                        //如果成功以后给出提示
                        this.$message.success(result.data.data)
                        //禁止发送按钮
                        this.mailCodeSendDisable = true;
                        //开始倒计时60s
                        this.countDown();
                    }else{
                        //给出提示
                        this.$message.error(result.msg)
                    }
                })            
            },
            countDown(){
                let time = 60;
                let that = this;
                let sendTimer = setInterval(function () {
                    time--;
                    //修改文字和按钮状态 '重新发送(' + time + ')'
                    if(time < 0) {
                        clearInterval(sendTimer);
                        //修改文字和按钮状态 '获取验证码'
                        that.mailCodeSendBtnWords = '获取验证码';
                        that.mailCodeSendDisable = false;
                    }else{
                        //修改文字  '重新发送(' + time + ')'
                        that.mailCodeSendBtnWords = '重新发送(' + time + ')';
                    }
                }, 1000)
            },
            checkMailCode (){
                //检查邮箱和验证码是否有内容
                if(this.userVo.email !== '' && this.emailCode !== ''){
                    this.isMailCodeCompleted = true
                }
            }
        }
    }
    
</script>


<style>

    .regust-from-part .el-input {
        width: 250px;
    }

    .regust-from-part {
        margin-top: 20px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }

</style>