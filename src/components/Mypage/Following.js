import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import "./Follow.css";

function Following() {

    const [followingList, setFollowingList] = useState([]);

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    useEffect(() => {
        axios.post('http://localhost:3000/members/follow', token)
            .then((response) => {
                setFollowingList(response.data.followDtoList);

            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div className='follow-container'>
            <b>팔로잉</b>
            <div className='follow-list'>
                {followingList.length > 0 ? (
                    followingList.map((following) => (
                        <div className='follow-list-01' key={following.memberseq}>
                            <img
                                src={`http://localhost:3000/images/profile/${following.profile}`}
                                alt="이미지"
                                width="30"
                                height="30"
                            />
                            <div className='follow-list-02'>
                                <div className='follow-list-03'>{following.foltarget}</div>
                                <div className='follow-list-04'>팔로잉</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>팔로잉하는 유저가 없습니다</p>
                )}
            </div>
        </div>
    )
}

export default Following;