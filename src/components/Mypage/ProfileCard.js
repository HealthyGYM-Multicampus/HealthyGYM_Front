import {Link, Route, Routes} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import Follower from "./Follower";
import Following from "./Following";
import "./ProfileCard.css";
import Profile from "./Profile";
import BodyCom from "./BodyCom";

function ProfileCard() {
    const [member, setMember] = useState({});
    const [followNum, setFollowNum] = useState(0);
    const [followerNum, setFollowerNum] = useState(0);

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    useEffect(() => {
        // member 정보 가져오기
        axios
            .post("http://localhost:3000/members/findmember", token)
            .then((response) => {
                setMember(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    useEffect(() => {
        // following 정보 가져오기
        axios
            .post("http://localhost:3000/members/follow", token)
            .then((response) => {
                setFollowNum(response.data.followNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    useEffect(() => {
        // follower 정보 가져오기
        axios
            .post("http://localhost:3000/members/follower", token)
            .then((response) => {
                setFollowerNum(response.data.followerNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div className="mypage-container-01">
            <div className="profile-card">
                <img
                    src={`http://localhost:3000/images/profile/${member.profile}`}
                    alt="프로필 이미지"
                    width="90"
                    height="90"
                />
                <div className='profile-card-nickname'>{member.nickname}</div>
                <div>
                    <div className='profile-card-follow'>
                        <Link to="/mypage/profilecard/follower" className='profile-card-follow-02'>
                            팔로워<b className='profile-card-follow-01'>{followerNum}</b>
                        </Link>
                        <div className='profile-card-text-01'>|</div>
                        <Link to="/mypage/profilecard/following" className='profile-card-follow-02'>
                            팔로잉<b className='profile-card-follow-01'>{followNum}</b>
                        </Link>
                    </div>
                </div>
                <Link to="/mypage/setting/editprofile" className="setting-btn">
                    설정
                </Link>
            </div>
            <div className='connect'>
                <Routes>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="bodycom" element={<BodyCom/>}/>
                    <Route path="follower" element={<Follower/>}/>
                    <Route path="following" element={<Following/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default ProfileCard;
