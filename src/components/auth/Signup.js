import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Icon, Form, Checkbox, Button, Dropdown } from 'semantic-ui-react';
import AuthEmail from "./AuthEmail";
import { Label, Description, SocialButton, Msg } from './authStyle';
import { ReactComponent as Kakao } from '../../asset/logo_kakao.svg';
import google from '../../asset/logo_google2.png';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [domain, setDomain] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [mailKey, setMailKey] = useState('');         // 이메일 인증코드
    const [isLoading, setIsLoading] = useState(false);  // 이메일 발송 중

    const [pwd, setPwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [confirmPwdMsg, setConfirmPwdMsg]= useState('');

    const [nickname, setNickname] = useState('');
    const [nicknameMsg, setNicknameMsg] = useState('');

    const [isAllchecked, setIsAllchecked] = useState(false);    // 약관 전체 동의
    const [isAgechecked, setIsAgechecked] = useState(false);
    const [isUsechecked, setIsUsechecked] = useState(false);

    // 유효성 검증
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkPwd, setCheckPwd] = useState(false);
    const [checkNickname, setCheckNickname] = useState(false);
    const [checkAuth, setCheckAuth] = useState(false);
    
    let navigate = useNavigate();

////// 이메일 핸들러 & 유효성 검증 & 중복검사 //////
    const onChangeEmail = (e) => {
        const currEmail = e.target.value;
        setEmail(currEmail);

        if(validateEmail(currEmail, domain)) {
            existsEmail(currEmail, domain);
        }
    };

    const onSelect = (e, { value }) => {
        setDomain(value);
        if(validateEmail(email, value)) {
            existsEmail(email, value);
        }
    };

    const handleAddition = (e, { value }) => {
        setOptions((prevState) => {
          return ([{ key:value, text: value, value:value }, ...prevState]);
        });
    };

    const [options, setOptions] = useState([
        { key: '0', text: '직접 입력', value: '0' },
        { key: 'naver.com', text: 'naver.com', value: 'naver.com' },
        { key: 'gmail.com', text: 'gmail.com', value: 'gmail.com' },
        { key: 'hanmail.net', text: 'hanmail.net', value: 'hanmail.net' },
        { key: 'daum.net', text: 'daum.net', value: 'daum.net' },
        { key: 'outlook.com', text: 'outlook.com', value: 'outlook.com' }
    ]);

    const validateEmail = (email, domain) => {
        if(email.match(/[a-zA-Z0-9+-\_.]+/) && domain.match(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)) {
            setEmailMsg('');
            return true;
        }
        setEmailMsg('이메일 형식이 올바르지 않습니다.');
        return false;
    };
    
    const existsEmail = async (email, domain) => {
        
        await axios.get(`http://localhost:3000/checkemail?email=${email}@${domain}`)
        .then((res) => {
            console.log(res.data);
            if(res.data === "OK") {
                setEmailMsg('');
                setCheckEmail(true);
            } else if(res.data === "kakao") {
                setEmailMsg("이미 카카오톡 간편가입으로 가입된 이메일입니다. '카카오톡' 버튼을 눌러 로그인해주세요.");
                setCheckEmail(false);
            } else {
                setEmailMsg("이미 구글 간편가입으로 가입된 이메일입니다. '구글' 버튼을 눌러 로그인해주세요.");
                setCheckEmail(false);
            }
        }).catch((err) => {
            alert('error');
        });
    };

////// 비밀번호 핸들러 & 유효성 검증 //////
    const onChangePwd = (e) => {
        const currPwd = e.target.value;
        setPwd(currPwd);

        if(validatePwd(currPwd)) {
            setCheckPwd(false);
        }
    };

    const onChangeConfirmPwd = (e) => {
        setConfirmPwd(e.target.value);
        if(pwd === e.target.value) {
            setConfirmPwdMsg('');
            if(pwd.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)) {
                setCheckPwd(true);
            }
        } else {
            setCheckPwd(false);
            setConfirmPwdMsg('비밀번호가 일치하지 않습니다.');
        }
    };
    
    const validatePwd = (pwd) => {
        if(pwd === "") {
            setPwdMsg('필수 입력 항목입니다.');
            return false;
        } else if(!pwd.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)) {
            setPwdMsg('비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
            return false;
        }
        setPwdMsg('');
        return true;
    };

////// 닉네임 핸들러 & 유효성 검증 & 중복검사 //////
    const onChangeNickname = (e) => {
        const currNickname = e.target.value;
        setNickname(currNickname);
        
        if(validateNickname(currNickname)) {
            existsNickname(currNickname);
        } else {
            setCheckNickname(false);
        }
    };

    const existsNickname = async (nickname) => {
   
        await axios.get(`http://localhost:3000/checknickname?nickname=${nickname}`)
        .then((res) => {
            //console.log(res.data);
            if(!res.data) {
                setNicknameMsg('');
                setCheckNickname(true);
            } else {
                setNicknameMsg('이미 사용중인 닉네임입니다.');
                setCheckNickname(false);
            }
        }).catch((err) => {
            alert('error');
        });

    };

    const validateNickname = (nickname) => {
        if(nickname === '') {
            setNicknameMsg('필수 입력 항목입니다.');
            return false;
        } else if(nickname.length < 2 || nickname.length > 15) {
            setNicknameMsg('2 ~ 15자로 입력해주세요.');
            return false;
        } else if(nickname.match(/\s/g)) {
            setNicknameMsg('공백은 사용할 수 없습니다.');
            return false;
        }
        return true;
    }

////// 전체 약관 동의 //////
    const checkAll = () => {
        if(isAllchecked) {
            setIsAgechecked(false);
            setIsUsechecked(false);
            setIsAllchecked(false);
        } else {
            setIsAgechecked(true);
            setIsUsechecked(true);
            setIsAllchecked(true);
        }
    };

////// 이메일 인증 //////
    const authEmailBtn = () => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/authemail?email=${email}@${domain}`)
        .then((res) => {
            //console.log(res);
            setMailKey(res.data);
            setIsLoading(false);
        })
        .catch((err) => {
            alert(err);
            setIsLoading(false);
        });
    };
    
////// 회원가입 버튼 //////
    const signupBtn = () => {
        const mem = {
            "email":email+'@'+domain,
            "pwd":pwd,
            "nickname":nickname
        };

        axios.post("http://localhost:3000/auth/signup", null, { params:mem })
        .then((res) => {
            console.log(res.data);
            if(res.data === "OK") {
                alert('회원 가입을 축하합니다!');
                navigate('/login');
            } else {
                alert('가입 실패');
            }
        })
        .catch((err) => {
            alert(err);
        });
    };

    
    const loginKakao = () => {
        const KAKAO_CLIENT_id = process.env.REACT_APP_KAKAO_CLIENT_id;
        const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;
        const KAKAO_OAUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code&prompt=login`;
        window.location.href = KAKAO_OAUTH_URL;
    };
    const loginGoogle = () => {
        const GOOGLE_CLIENT_id = process.env.REACT_APP_GOOGLE_CLIENT_id;
        const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_id}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;
    };

    return (
        <div style={{ width:'400px', margin:'0 210px' }}>
            <h2>회원가입</h2>

            <section style={{ textAlign:'center'}}>
                <Description>SNS계정으로 간편 로그인/회원가입</Description>
                <div>
                    <SocialButton onClick={loginGoogle}>
                        <img alt='' src={google} width={50}/>
                    </SocialButton>
                    <SocialButton onClick={loginKakao}>
                        <Kakao />
                    </SocialButton>
                </div>
            </section>
            <hr/>
            <div>
                <Form>
                    <Label>이메일</Label>
                    <Form.Group widths='equal' style={{ margin: "0em -0.5em"}}>
                        <Form.Field>
                            <input value={email} onChange={onChangeEmail} disabled={checkAuth} placeholder="이메일" />
                        </Form.Field>
                        <Icon name="at" style={{ margin:'auto 0px'}} />
                        
                        <Form.Field>
                            <Dropdown
                                options={options}
                                placeholder='선택해주세요'
                                search
                                selection
                                fluid
                                allowAdditions
                                additionLabel=''
                                onAddItem={handleAddition}
                                value={domain}
                                onChange={onSelect}
                                disabled={checkAuth}
                            />
                            
                        </Form.Field>
                    </Form.Group>
                    <Msg>{emailMsg}</Msg>
                
                    
                    
                    <Button type="button" onClick={authEmailBtn} disabled={!checkEmail || checkAuth} style={{ width:"100%"}}>
                        {checkAuth ? <span>이메일 인증 완료</span> : isLoading ? <Icon loading name='spinner' /> : <span>이메일 인증하기</span>}
                    </Button>
                    {(mailKey !== '') && !checkAuth 
                        && <AuthEmail mailKey={mailKey} setCheckAuth={setCheckAuth} authEmailBtn={authEmailBtn} />}
                    

                    <Form.Field>
                        <Label>비밀번호</Label>
                        <Description>영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</Description>
                        <input type="password" value={pwd} onChange={onChangePwd} placeholder="비밀번호" />
                        <Msg>{pwdMsg}</Msg>
                    </Form.Field>

                    <Form.Field>
                        <Label>비밀번호 확인</Label>
                        <input type="password" value={confirmPwd} onChange={onChangeConfirmPwd} placeholder="비밀번호 확인" />
                        <Msg>{confirmPwdMsg}</Msg>
                    </Form.Field>

                    <Form.Field>
                        <Label>닉네임</Label>
                        <Description>다른 유저와 겹치지 않도록 입력해주세요. (2~15자)</Description>
                        <input value={nickname} onChange={onChangeNickname} placeholder="별명 (2~15자)" />
                        <Msg>{nicknameMsg}</Msg>
                    </Form.Field>
                
                    <div>
                        <Label>약관동의</Label>
                        <div>
                            <Form.Field
                                control={Checkbox}
                                label='전체동의'
                                onChange={checkAll} checked={isAgechecked && isUsechecked}
                            />
                            <Form.Field
                                control={Checkbox}
                                label='만 14세 이상입니다 (필수)'
                                onChange={() => setIsAgechecked(!isAgechecked)} checked={isAgechecked}
                            />
                            <Form.Field
                                control={Checkbox}
                                label='이용약관 (필수)'
                                onChange={() => setIsUsechecked(!isUsechecked)} checked={isUsechecked}
                            />
                        </div>
                    </div>

                
                    <Button type="button" onClick={signupBtn} style={{ width:"100%"}}
                        disabled={!(isAllchecked && checkEmail && checkPwd && checkNickname && checkAuth)}>
                        회원가입하기
                    </Button>
                
                </Form>
                
                <span>이미 아이디가 있으신가요?</span>
                <Link to="/login">로그인</Link>
            </div>
        </div>
    );
}