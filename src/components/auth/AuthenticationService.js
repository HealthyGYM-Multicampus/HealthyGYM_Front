import axios from 'axios';
import { Cookies } from 'react-cookie';
import moment from 'moment';

const cookies = new Cookies();
let isTokenRefreshing = false;

class AuthenticationService {

    // 로그인 (백엔드로 이메일, 비밀번호 post)
    executeJwtAuthenticationService(email, pwd) {
        return axios.post('http://localhost:3000/auth/login', {
            "email":email,
            "pwd":pwd
        })
    }

    // 로그인 성공 후 설정
    registerSuccessfulLoginForJwt(memberseq, profile, accessToken, refreshToken) {
        console.log("===registerSuccessfulLoginForJwt===")
        const expireDate = new Date().setDate(new Date().getDate() + 7);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('memberseq', memberseq);
        localStorage.setItem('profile', profile);
        localStorage.setItem("expiresAt",
            moment().add(30, "minute").format("YYYY-MM-DDTHH:mm:ss.SSS")
        );
        cookies.set('refreshToken', refreshToken, { 
            sameSite: 'strict', 
            path: "/", 
            expires: new Date(expireDate)
        });

        //this.setupAxiosInterceptors();
    }


    logout() {
        localStorage.clear();
        cookies.remove('refreshToken', { sameSite: 'strict', path: "/" });
    }

    isUserLoggedIn() {
        const token = localStorage.getItem('accessToken');
        console.log("===UserloggedInCheck===");
        console.log(token);

        if (token) return true;
        
        return false;
    }

    // 사용 안함...ㅠㅠ
    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            async (config) => {
                const refreshToken = cookies.get("refreshToken");
                const expiresAt = localStorage.getItem("expiresAt");
                let accessToken = localStorage.getItem("accessToken");
                
                const now = new Date();
                const ex = new Date(expiresAt);
                console.log("axios.interceptors.request");
                console.log(ex.getTime() - now.getTime());
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
                        expires: new Date().setDate(new Date().getDate() + 7)
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

        axios.interceptors.response.use(
            async function (response) {
                return response;
            },
            async function (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    window.alert(error.response.message);
                }
                return Promise.reject(error);
            }
        );
    }
}

export default new AuthenticationService()