import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import "./PwdChange.css";

function PwdChange() {
    const [memberseq, setMemberseq] = useState('');
    const [pwd, setPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [message, setMessage] = useState("");

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/members/findmember", token)
            .then((response) => {
                setMemberseq(response.data.memberseq);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (pwd !== confirmPwd) {
            setMessage("비밀번호가 일치하지 않습니다.");
        } else if (pwd.length < 8 || !/\d/.test(pwd) || !/[a-zA-Z]/.test(pwd)){
            setMessage("비밀번호의 형식이 잘못되었습니다.");
        }
        else {
            try {
                await axios.post(
                    "http://localhost:3000/members/pwdupdate",
                    {
                        memberseq: memberseq,
                        pwd: pwd
                    }
                );
                alert("비밀번호가 성공적으로 변경되었습니다.");
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert("비밀번호경 중 오류가 발생했습니다.");
                window.location.reload();
            }
        }
    };

    return (
        <div className='pwdchange-container'>
            <div className='pwdchange-title'>비밀번호 변경</div>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="memberseq" value={memberseq}/>
                <div className="pwdchange-subtitle">새 비밀번호</div>
                <div className="pwdchange-text1">영문,숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</div>
                <input className='pwdchange-input'
                    type="password"
                    id="pwd"
                    value={pwd}
                    onChange={(event) => setPwd(event.target.value)}
                />
                <div>
                    <div className="pwdchange-subtitle">새 비밀번호</div>
                    <input className='pwdchange-input'
                        type="password"
                        id="confirmPwd"
                        value={confirmPwd}
                        onChange={(event) => setConfirmPwd(event.target.value)}
                    />
                </div>
                {message && <div>{message}</div>}
                <br></br>
                <button className='pwdchange-form-content-btn' type="submit">비밀번호 변경</button>
            </form>
        </div>
    );
}

export default PwdChange;