import http from './http';

const base_url = "http://localhost:9001/hzh-user"

export const  SUCCESS_CODE = 20000;
export const  SUCCESSERROR_CODE = 40000;

//新用户发送注册验证码
export const sendRegustMailCode = (verification,emailAddress) =>{
    return http.requestGet(base_url + "/user/register/emailCode?email=" + emailAddress
    + "&verification=" + verification);
};

//找回密码发送注册验证码
export const sendReSetPasswordEmail = (verification,emailAddress) =>{
    return http.requestGet(base_url + "/user/forget/emailCode?email=" + emailAddress
    + "&verification=" + verification);
};


//注册用户
export const registerAccount = (mailCode,userVo) =>{
    return http.requestPost(base_url + "/user/user/register?mailCode=" + mailCode,userVo);
};

//登录
export const userLogin = (verification,userVo) =>{
    return http.requestPost(base_url + "/user/user/login?verification=" + verification,userVo);
};


//验证token
export const checkToken = () =>{
    return http.requestGet(base_url + "/user/user/checkToken");
};

//退出登录
export const logout = () =>{
    return http.requestGet(base_url + "/user/user/logout");
};

//发送找回验证码
export const sendForgotMailCode = (mailCode,userVo) =>{
    return http.requestPut(base_url + "/user/user/reSetPasswordBySelf?mailCode=" + mailCode,userVo);
};

//获取所有用户列表
export const getAllUserByPage = (current,size) =>{
    return http.requestGet(base_url + "/email/register/emailCode?current=" + current
    + "&size=" + size);
};
