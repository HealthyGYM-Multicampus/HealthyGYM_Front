import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import "./Follow.css";

function Follower() {

    const [followerList, setFollowerList] = useState([]);

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    useEffect(() => {
        axios.post('http://localhost:3000/members/follower', token)
            .then((response) => {
                setFollowerList(response.data.followDtoList);

            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div className='follow-container'>
            <b>팔로워</b>
            <div className='follow-list'>
                {followerList.length > 0 ? (
                    followerList.map((follower) => (
                        <div className='follow-list-01' key={follower.memberseq}>
                            <img
                                src={`http://localhost:3000/images/profile/${follower.profile}`}
                                alt="이미지"
                                width="30"
                                height="30"
                            />
                            <div className='follow-list-02'>
                                <div className='follow-list-03'>{follower.foltarget}</div>
                                <div className='follow-list-04'>팔로잉</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>팔로워가 없습니다</p>
                )}
            </div>
        </div>
    )
}

export default Follower;