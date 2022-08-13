<template>
    <div id="index-part">
        <div v-if="hasLogin" class="login-part">
            <div class="avatar-part content-center">
                <img :src="avatar">
            </div>
            <div class="user_name-part content-center">
                <span>{{userName}}</span>
            </div>
            <div class="action-part content-center">
                <el-button type="parimary" size="small" @click="toFougotPage">重置密码</el-button>
                <el-button type="danger" size="small" @click="toLogout">退出登录</el-button>            
            </div>
        </div>

        <div v-else class="logout-part">
            <div class="no-login-tips"></div>
                <el-button type="parimary" size="small" @click="toLogin">登录</el-button>
                <el-button type="parimary" size="small"  @click="toRegust">注册</el-button>
        </div>
    </div>
       
</template>

<script>

import { application } from 'express';
import * as api from '../../network/api';

    export default {
        data(){
            return {
                avatar:'',
                userName:'',
                hasLogin: false
            }
        },
        methods:{
            toFougotPage(){
                this.$router.push({
                    path: '/forgot'
                })
            },
            toLogin(){
                this.$router.push({
                    path: '/login'
                })
            },
            toRegust(){        
                this.$router.push({
                    path: '/regust'
                })
            },
            toLogout(){
                api.logout().then(result => {
                    //跳转到登录页面
                    if(result.code === api.SUCCESS_CODE) {
                        this.$message.success(result.msg);
                        window.localStorage.setItem("avatar","");
                        window.localStorage.setItem("user_name","");
                        this.$router.push({
                            path: '/login'
                        })
                    }
                })
            },
            checkLogin(){
                console.log("cookie ==> "+ document.cookie)
                let cookieArray = document.cookie.split("; ");
                for(let i =0; i < cookieArray.length; i++){
                    let item = cookieArray[i];
                    let contentItem = item.split("=");
                    if(contentItem[0] === 'tsfse_token'){
                        let token = contentItem[1];
                        if(token === ''){
                            this.hasLogin = false;
                        }else{
                            if(this.avatar || this.userName){
                                this.hasLogin = false;
                            }else{
                                this.hasLogin = true;
                            }
                        }
                    }
                }
                console.log("this.hasLogin ====> " + this.hasLogin)
            }
        },
        mounted(){
            this.avatar = window.localStorage.setItem("avatar");
            this.userName = window.localStorage.setItem("user_name");
            this.checkLogin();
        }
    }
</script>
<style>
    .avatar-part img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    .action-part {
        margin-top: 10px;
    }

    .user-name-part span{
        font-size: 28px;
        color: #4d4d4d;
    }
    
    .content-center {
        text-align: center;
    }
    
    .no-login-tips{
        text-align: center;
    }


</style>