import {fetch,AiPost } from '../request/http';
//登录
export const pLogin = (params) => AiPost({
    url: '/api/security/login',
    data: params
});