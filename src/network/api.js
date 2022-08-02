import http from './http';

const base_url = "http://localhost:9001/hzh-user"

export const  SUCCESS_CODE = 'AAAAAA';

export const sendMailCode = (verification,emailAddress) =>{
    return http.requestGet(base_url + "/email/register/emailCode?email=" + emailAddress
    + "&verification=" + verification);
};

export const registerAccount = (mailCode,userVo) =>{
    return http.requestPost(base_url + "/user/user/register?mailCode = " + mailCode,userVo);
};