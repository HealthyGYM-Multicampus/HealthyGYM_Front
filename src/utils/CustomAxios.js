import axios from "axios";
import { Cookies } from 'react-cookie';
import moment from 'moment';

const cookies = new Cookies();
let isTokenRefreshing = false;

const CustomAxios = axios.create();

// 1. 요청 인터셉터
CustomAxios.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("accessToken");
        if(accessToken == null) return config;
        const expiresAt = localStorage.getItem("expiresAt");
        const refreshToken = cookies.get("refreshToken");
        
        console.log("axios.interceptors.request ", isTokenRefreshing);
        console.log(moment(expiresAt).diff(moment()));
        // 토큰이 만료되었다면
        if (moment(expiresAt).diff(moment()) < 1 && !isTokenRefreshing) {
            isTokenRefreshing = true;
            console.log("토큰을 재발급합니다!");
        
            //재발급 요청
            const res = await axios.post("http://localhost:3000/auth/reissue",{
                "accessToken":accessToken,
                "refreshToken":refreshToken
            });
            accessToken = res.data.accessToken; // 토큰 교체
            console.log("재발급 성공");
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("expiresAt",
                moment().add(30, "minute").format("yyyy-MM-DD HH:mm:ss")
            );
            cookies.set('refreshToken', res.data.refreshToken, { 
                sameSite: 'strict', 
                path: "/", 
                expires: new Date(new Date().setDate(new Date().getDate() + 7))
            });
            
            isTokenRefreshing = false;
        }
        
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

// 2. 응답 인터셉터
CustomAxios.interceptors.response.use(
    async function (response) {
        return response;
    },
    async function (error) {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            alert("다시 로그인해주세요. (", error.response.message, ")");
        }
        
        return Promise.reject(error);
    }
);

export default CustomAxios;