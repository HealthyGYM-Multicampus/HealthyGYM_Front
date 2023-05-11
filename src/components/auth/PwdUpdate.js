import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Input, Button } from 'semantic-ui-react';
import { Msg } from "./authStyle";

export default function PwdUpdate() {
    const [pwd, setPwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [confirmPwdMsg, setConfirmPwdMsg]= useState('');
    const [checkPwd, setCheckPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  // 이메일 발송 중

    let navigate = useNavigate();
    const { email, mail_key } = useParams();

    const onChangePwd = (e) => {
        const currPwd = e.target.value;
        setPwd(currPwd);

        if(!currPwd.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)) {
            setPwdMsg('비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
            setCheckPwd(false);

        } else {
            setPwdMsg('');

            if(currPwd === confirmPwd) {
                setConfirmPwdMsg('');

                console.log(true);
                setCheckPwd(true);
            }
        }
    };

    const onChangeConfirmPwd = (e) => {
        setConfirmPwd(e.target.value);

        if(pwd === e.target.value) {
            setConfirmPwdMsg('');

            if(pwd.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)) {
                console.log(true);
                setCheckPwd(true);
            }
        } else {
            setCheckPwd(false);
            setConfirmPwdMsg('비밀번호가 일치하지 않습니다.');
        }
    };

    const updateBtn = async () => {
        setIsLoading(true);
        await axios.post("http://localhost:3000/updatepwd", null, { params:{"email":email, "mailKey":mail_key, "pwd":pwd} })
        .then((res) => {
            if(res.data) {
                setIsLoading(false);
                alert('비밀번호가 변경되었습니다.');
                navigate('/login');
            } else {
                alert('잘못된 접근입니다.');
                setIsLoading(false);
            }
        })
        .catch((error) => {
            alert(error);
            setIsLoading(false);
        });
    };

    return (
        <div style={{ width:'350px', margin:'0 210px' }}>
            <h2>비밀번호 재설정</h2>
            <p>새로운 비밀번호를 입력해주세요.<br/>(영문, 숫자 포함한 8자 이상)</p>

            <Input style={{width:'350px'}} type="password" value={pwd} onChange={onChangePwd} placeholder="비밀번호" />
            <Msg>{pwdMsg}</Msg>
            
            <Input style={{width:'350px'}} type="password" value={confirmPwd} onChange={onChangeConfirmPwd} placeholder="비밀번호 확인" />
            <Msg>{confirmPwdMsg}</Msg>

            <Button style={{width:'350px'}} onClick={updateBtn} disabled={!checkPwd}>
                {isLoading ? <span>loading</span> : <span>변경하기</span>}
            </Button>
        </div>
    );
}