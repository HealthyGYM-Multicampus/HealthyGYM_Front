import { useState } from "react";
import axios from "axios";
import { Icon, Button, Input } from 'semantic-ui-react';
import { Msg } from "./authStyle";

export default function PwdEmail() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [isEmail, setIsEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  // 이메일 발송 중

    const onChangeEmail = (e) => {
        const currEmail = e.target.value;
        setEmail(currEmail);

        if(currEmail.match(/[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)) {
            setMsg('');
            setIsEmail(true);
        } else {
            setMsg('이메일 형식이 올바르지 않습니다.');
            setIsEmail(false);
        }
    };

    const sendBtn = async () => {
        setIsLoading(true);
        await axios.get('http://localhost:3000/pwdemail?email=' + email)
        .then((res) => {
            if(res.data === "NO") {
                alert('가입되지 않은 이메일입니다.');
            } else if(res.data === "kakao") {
                alert("카카오톡 간편 가입으로 가입한 계정입니다.\n비밀번호 찾기는 '이메일 가입하기'로 가입한 경우에만 가능합니다.");
            } else if(res.data === "google") {
                alert("구글 간편 가입으로 가입한 계정입니다.\n비밀번호 찾기는 '이메일 가입하기'로 가입한 경우에만 가능합니다.");
            } else {
                alert('비밀번호 재설정 메일이 발송되었습니다.\n메일이 오지 않을 경우 스팸메일함 등을 확인해주세요.');
            }
            setIsLoading(false);
        })
        .catch((error) => {
            alert(error);
            setIsLoading(false);
        });
    };

    return (
        <div style={{ width:'350px', margin:'0 210px' }}>
            <h2>비밀번호를 잊어버리셨나요?</h2>
            <p>가입한 이메일 주소를 입력해주세요.<br/>비밀번호를 재설정할 수 있는 이메일을 보내드립니다.</p>
            <Input style={{width:'350px'}} type="email" value={email} onChange={onChangeEmail} placeholder="이메일"/>
            <Msg>{msg}</Msg>
            
            <Button style={{width:'350px'}} type="button" onClick={sendBtn} disabled={!isEmail}>
                {isLoading ? <Icon loading name='spinner' /> : <span>이메일 발송하기</span>}
            </Button>
        </div>
    );
}