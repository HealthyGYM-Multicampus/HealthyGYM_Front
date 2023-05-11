import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';

import AuthenticationService from './AuthenticationService';

// 소셜 로그인
export default function LoginCallback() {
    const history = useNavigate();
    const cookies = new Cookies();

    const { provider } = useParams();
    //console.log(provider);
    const code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        axios.get(`http://localhost:3000/auth/${provider}`, { params: {"code":code} })
        .then(function(res){
            console.log(res.data);

            if (res.data.provider === provider) {

                AuthenticationService.registerSuccessfulLoginForJwt(res.data.seq, res.data.profile, 
                                                                    res.data.token.accessToken, 
                                                                    res.data.token.refreshToken);
                history("/");
            } else {
                const provider = res.data.provider;
                alert(provider, "로 가입된 이메일입니다.");
                history("/login");
            }
        }).catch(function(error){
            let msg = "다시 로그인해주세요.";
            if (error.response && error.response.status === 401) {
                msg += "(" + error.response.message + ")";
            }
            localStorage.clear();
            alert(msg);
            history("/login");
        });
    }, []);

    
    return (
        <>
            <div>Loading</div>
        </>
    );

}