import {Link} from "react-router-dom";
import "./Profile.css";

function Profile() {
    return (
        <div className='profile-container-01'>
            <b>나의 헬친</b>
            <div className='profile-container-box'>
                <Link to="/mypage/mate">
                    <div className='profile-container-box-01'>
                        <b className='profile-container-box-02'>+ </b>나의 헬친을 등록해주세요
                    </div>
                </Link>
            </div>
            <br></br>
            <b>나의 사진</b>
            <div className='profile-container-box'>
                <Link to="/mypage/bodygallery">
                    <div className='profile-container-box-01'>
                        <b className='profile-container-box-02'>+ </b>나의 첫번째 사진을 등록해주세요
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Profile;