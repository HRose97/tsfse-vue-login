<template>
    <div id="forgot-part">
        <div class="tital">修改密码</div>
        <div class="mail-part">
            <el-form label-width="80px" size="small">

                <el-form-item label="邮箱" :required="true">
                    <el-input v-model="userVo.email" placeholder="请输入邮箱"></el-input>
                    <el-button  Style="margin-left: 10px;" type="primary" 
                                @click="showVerification" :disabled="mailCodeSendDisable">
                        {{mailCodeSendBtnWords}}
                    </el-button>
                </el-form-item>

                <el-form-item label="验证码" :required="true">
                    <el-input v-model="mailCode"  placeholder="请输入验证码" 
                    :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>

                <el-form-item label="新密码" :required="true">
                    <el-input v-model="password"  placeholder="请输入新密码" 
                    :disabled="!isMailCodeCompleted"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button  @click="doResetPassword" type="primary" 
                    :disabled="!isMailCodeCompleted">重置密码</el-button>
                    <span >
                        <a style="margin-left: 20px; color: #3E76D4; text-decoration: none" 
                        href="#/login">直接登录</a>
                    </span>
                </el-form-item>
            </el-form>
        </div>
        <!-- 验证码 -->
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
    import Verify from '../../components/verifition/Verify.vue'
    import * as api from '../../network/api' ;
    import * as md5 from '../../utils/md5' ;
    export default {
        components: {
            Verify   
        },
        data() {
            return {
                userVo: {
                    email: '',
                    password:'',
                },
                password:'',
                mailCode:'',
                mailCodeSendDisable: false,
                mailCodeSendBtnWords: '发送验证码',
                isMailCodeCompleted: false,
                
            }
        },
        methods:{
            doResetPassword(){
                if(this.userVo.email === ''){
                    this.$message.error("请填写邮箱地址");
                    return;
                }
                if(this.userVo.mailCode === ''){
                    this.$message.error("请填写验证码");
                    return;
                }
                if(this.password === ''){
                    this.$message.error("请设置密码");
                    return;
                }
                //对密码进行编码
                this.userVo.password = md5.hex_md5(this.password);
                //重置密码
                  api.sendForgotMailCode(this.mailCode,this.userVo).then(result => {
                    //如果成功以后给出提示
                    if(result.code === api.SUCCESS_CODE){
                        this.$message.success(result.msg);
                        //重置成功
                        this.$router.push ({
                            path:'/login'
                        })
                    }else{
                         this.$message.error(result.msg);
                    }
                })
            },
            //先查邮箱
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
            sendEmailCode(params){
                console.log(params);
                console.log(params.captchaVerification,this.userVo.email);
                //发送邮箱验证码
                api.sendReSetPasswordEmail(encodeURIComponent(params.captchaVerification), this.userVo.email).then(result => {
                    if(result.code === api.SUCCESS_CODE){
                        //如果成功以后给出提示
                        this.$message.success(result.msg)
                        //禁止发送按钮
                        this.mailCodeSendDisable = true;
                        //开始倒计时60s
                        this.countDown();
                        this.isMailCodeCompleted = true;
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
        },
    }
</script>


<style >

    .mail-part .el-input {
        width: 250px;
    }

    .mail-part{
        margin-top: 20px;
    }

</style>