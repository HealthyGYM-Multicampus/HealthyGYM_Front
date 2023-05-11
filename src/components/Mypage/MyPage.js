import {Routes, Route, NavLink} from "react-router-dom";
import "./MyPage.css";
import "./MypageActive.css";
import Setting from "./Setting";
import BodyCom from "./BodyCom";
import Profile from "./Profile";
import ProfileCard from "./ProfileCard";

function Nav() {

    return (
        <div>
            <ul className="nav-ul">
                <li className="nav-li">
                    <NavLink to="/mypage/profilecard/profile">프로필</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/profilecard/bodycom">체성분</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/mywrite">내가 쓴 글</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/setting">설정</NavLink>
                </li>
            </ul>
            <hr></hr>
            <Routes>
                <Route path="profilecard/*" element={<ProfileCard/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="bodycom" element={<BodyCom/>}/>
                <Route path="mywrite" element={<Mywrite/>}/>
                <Route path="setting/*" element={<Setting/>}/>
            </Routes>
        </div>
    );
}

function Mywrite() {
    return (
        <div>
            <h2>Mywrite</h2>
            <hr/>
            <div>
                <h3>내가 쓴 글</h3>
            </div>
        </div>
    );
}

function MyPage() {

    return (
        <div>
            <Nav/>
        </div>
    );
}

export default MyPage;