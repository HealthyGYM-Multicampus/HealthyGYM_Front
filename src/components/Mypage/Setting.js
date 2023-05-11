import {NavLink, Route, Routes} from "react-router-dom";
import EditProfile from "./EditProfile";
import PwdChange from "./PwdChange";
import "./Setting.css";
import {useEffect, useRef} from "react";

function Setting() {
    const editProfileLinkRef = useRef(null);

    useEffect(() => {
        editProfileLinkRef.current.click();
    }, []);

    return (
        <div>
            <div className="setting-nav">
                <ul className="nav-ul">
                    <li className="nav-li">
                        <NavLink to="/mypage/setting/editprofile" ref={editProfileLinkRef}>
                            회원정보 수정
                        </NavLink>
                    </li>
                    <li className="nav-li">
                        <NavLink to="/mypage/setting/pwdchange">비밀번호 변경</NavLink>
                    </li>
                </ul>
            </div>
            <Routes>
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/pwdchange" element={<PwdChange />} />
            </Routes>
        </div>
    );
}

export default Setting;