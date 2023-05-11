import {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import "./EditProfile.css";

function EditProfile() {

    const [memberseq, setMemberseq] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailname, setEmailname] = useState('');
    const [emaildomain, setEmaildomain] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [mbti, setMbti] = useState('');
    const [profile, setProfile] = useState('default.png');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef();

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/members/findmember", token)
            .then((response) => {
                setMemberseq(response.data.memberseq);
                setEmail(response.data.email);
                setProfile(response.data.profile);
                setNickname(response.data.nickname);
                setEmailname(response.data.email.match(/(.*)@/)[1]);
                setEmaildomain(response.data.email.match(/@(.*)/)[1]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/members/findmemberinfo", token)
            .then((response) => {
                setName(response.data.name);
                setAge(response.data.age);
                setGender(response.data.gender);
                setPhone(response.data.phone);
                setMbti(response.data.mbti);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    }

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    }

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    }

    const handleMbtiChange = (event) => {
        setMbti(event.target.value);
    }

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));

    }

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const deleteClick = () => {
        setPreviewUrl(null);
        setImage(null);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (image != null) {
            const formData = new FormData();
            formData.append("memberseq", memberseq);
            formData.append("email", email);
            formData.append("nickname", nickname);
            formData.append("gender", gender);
            formData.append("name", name);
            formData.append("age", age);
            formData.append("phone", phone);
            formData.append("mbti", mbti);
            formData.append("profile", profile);
            formData.append("image", image);

            axios
                .post("http://localhost:3000/members/profileupdate", formData)
                .then((response) => {
                    console.log(response.data);
                    alert("회원정보가 성공적으로 변경되었습니다.");
                    window.location.reload();
                });
        } else {
            const requestBody = {
                memberseq: memberseq,
                email: email,
                nickname: nickname,
                gender: gender,
                name: name,
                age: age,
                phone: phone,
                mbti: mbti,
                profile: profile,
                image: null,
            };

            axios.post("http://localhost:3000/members/profileupdatenull", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                console.log(response.data);
                alert("회원정보가 성공적으로 변경되었습니다.");
                window.location.reload();
            });
        }
    };

    return (
        <div className='edit-container'>
            <div className='edit-head'>
                <div className='edit-title'>회원정보수정</div>
                <div className='edit-delete-btn'>탈퇴하기</div>
            </div>
            <div className='edit-form-container'>
                <div className='edit-label'>
                    <div className='edit-label-title1'>
                        <div>이메일</div>
                        <div className='small-text'>*필수항목</div>
                    </div>
                    <div className='edit-label-title1'>
                        <div>별명</div>
                        <div className='small-text'>*필수항목</div>
                    </div>
                    <div className='edit-label-title2'>
                        성별
                    </div>
                    <div className='edit-label-title2'>
                        이름
                    </div>
                    <div className='edit-label-title2'>
                        나이
                    </div>
                    <div className='edit-label-title2'>
                        전화번호
                    </div>
                    <div className='edit-label-title2'>
                        Mbti
                    </div>
                    <div className='edit-label-title2'>
                        프로필 이미지
                    </div>
                </div>
                <div className='edit-form'>
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="memberseq" value={memberseq}/>
                        <input className='edit-input-email' type="hidden" value={email} onChange={handleEmailChange}/>
                        <div className='edit-form-content'>
                            <div className='email-domain-container'>
                            <input className='edit-input-email' type="email" value={emailname} readOnly /><div className='email-domain'>@</div>
                            <input className='edit-input-email' type="email" value={emaildomain} readOnly />
                        </div>
                        </div>
                        <div className='edit-form-content'>
                            <input className='edit-input' type="text" value={nickname} onChange={handleNicknameChange}/>
                        </div>
                        <div className='edit-form-content'>
                            <div className='edit-gender'>
                                <div>
                                    <input type="radio" name="gender" value="male" checked={gender === "male"}
                                           onChange={handleGenderChange}/></div>
                                <label>
                                    <div className='edit-gender-text'>남성</div>
                                </label>
                                <div>
                                    <input type="radio" name="gender" value="female" checked={gender === "female"}
                                           onChange={handleGenderChange}/></div>
                                <label>
                                    <div className='edit-gender-text'>여성</div>
                                </label>
                            </div>
                        </div>
                        <div className='edit-form-content'>
                            <input className='edit-input' type="text" value={name} onChange={handleNameChange}/>
                        </div>
                        <div className='edit-form-content'>
                            <input className='edit-input' type="text" value={age} onChange={handleAgeChange}/>
                        </div>
                        <div className='edit-form-content'>
                            <input className='edit-input' type="text" value={phone} onChange={handlePhoneChange}/>
                        </div>
                        <div className='edit-form-content'>
                            <select className='edit-input-mbti' value={mbti} onChange={handleMbtiChange}>
                                <option value={null}>선택</option>
                                <option value="ISTJ">ISTJ</option>
                                <option value="ISFJ">ISFJ</option>
                                <option value="INFJ">INFJ</option>
                                <option value="INTJ">INTJ</option>
                                <option value="ISTP">ISTP</option>
                                <option value="ISFP">ISFP</option>
                                <option value="INFP">INFP</option>
                                <option value="INTP">INTP</option>
                                <option value="ESTP">ESTP</option>
                                <option value="ESFP">ESFP</option>
                                <option value="ENFP">ENFP</option>
                                <option value="ENTP">ENTP</option>
                                <option value="ESTJ">ESTJ</option>
                                <option value="ESFJ">ESFJ</option>
                                <option value="ENFJ">ENFJ</option>
                                <option value="ENTJ">ENTJ</option>
                            </select>
                        </div>

                        <div className='edit-form-content'>
                            {previewUrl ? (
                                <div>
                                    <img src={previewUrl}
                                         alt="프로필 이미지"
                                         onClick={handleClick}
                                         style={{cursor: "pointer"}}
                                         width="130"
                                         height="130"
                                    />
                                    <button onClick={deleteClick}>삭제</button>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={`http://localhost:3000/images/profile/${profile}`}
                                        alt="프로필 이미지"
                                        onClick={handleClick}
                                        style={{cursor: "pointer"}}
                                        width="130"
                                        height="130"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{display: "none"}}
                            />
                        </div>
                        <div className='edit-form-content'>
                        <button className='edit-form-content-btn' type="submit">회원 정보 수정</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;