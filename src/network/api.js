import http from './http';

const base_url = "http://localhost:9001/hzh-user"

export const  SUCCESS_CODE = 'AAAAAA';

export const sendMailCode = (emailAddress) =>{
    return http.requestGet(base_url + "/email/register/emailCode?email=" + emailAddress)
};