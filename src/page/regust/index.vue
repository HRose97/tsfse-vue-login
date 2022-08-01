<template>
    <div class="regust-page">
        <div class="title">注册</div>
        <div class="regust-from-part">
            <el-form label-width="80px" size="small">
                <el-form-item label="邮箱地址" :required="true">
                    <el-input v-model="userVo.email"></el-input>
                    <el-button  Style="margin-left: 10px;" type="primary" 
                                @click="sendEmailCode" :disabled="mailCodeSendDisable">
                        {{mailCodeSendBtnWords}}
                    </el-button>
                </el-form-item>
                <el-form-item label="验证码" :required="true">
                    <el-input v-model="emailCode"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :required="true">
                    <el-input v-model="userVo.name" :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="userVo.phone" :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>
                <el-form-item label="密码" :required="true">
                    <el-input v-model="userVo.password" :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button  @click="regust" type="primary" :disabled="!isMailCodeCompleted">注册</el-button>
                    <span style="margin-left: 20px; color: #7e8c8d">
                        已注册？ 直接登录
                    </span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import e from 'express';
import * as api from '../../network/api' 
    export default {
        data() {
            return {
                userVo: {
                    email: '',
                    code:'',
                    name: '',
                    phone:'',
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
            regust(){
            },
            sendEmailCode(){
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
                console.log(this.userVo.email);
                //发送邮箱验证码
                api.sendMailCode(this.userVo.email).then(result => {
                    if(result.code === api.SUCCESS_CODE){
                        //如果成功以后给出提示
                        this.$message.success(result.msg)
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

</style>