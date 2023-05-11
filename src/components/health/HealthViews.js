import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/CustomAxios';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { CopyToClipboard } from "react-copy-to-clipboard";

import BbsDropdown from "../bbs/BbsDropdown";
import { shareKakao } from "../../utils/shareKakao.js";
import ADDRESS_LIST from '../../asset/region.json';
import styled from 'styled-components';
import { Button, Icon } from 'semantic-ui-react';
import kakao from "../../asset/btn_kakao.png";

export default function HealthViews() {
    const [memberseq, setMemberseq] = useState(0);
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);
    const { bbsseq } = useParams();
    const currentUrl = `http://localhost:9100/mate/health/view/${bbsseq}`;
    const koBody = ["등", "가슴", "어깨", "팔", "복근", "하체", "유산소"];

    useEffect(()=>{
      const s = localStorage.getItem("memberseq");
      if(s !== null) setMemberseq(s);

      detailData(bbsseq);

      // 카카오톡 sdk 추가
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      document.body.appendChild(script);

      return () => document.body.removeChild(script);
    }, [bbsseq]);

    // 게시글 가져오기
    const detailData = async(seq) => {
        await axios.get('http://localhost:3000/mate/getdetail', { params:{"bbsseq":seq} })
        .then((res) => {

            console.log(memberseq);
            console.log(JSON.stringify(res.data));
            setDetail(res.data[0]);
            setBodyPart([res.data[0].back, res.data[0].chest, res.data[0].shoulder, res.data[0].arm, res.data[0].abs, res.data[0].leg, res.data[0].run]);
            setLoading(true);   // 여기서 rendering해줌
        })
        .catch((err) => {
            alert(err);
        });
    }
    if(loading === false){
        return <div>Loading...</div>
    }

    return (
        <div>
            <div>
                <h3>{detail.title}</h3>
                <img
                    src={`http://localhost:3000/images/${detail.profile}`}
                    alt="프로필 이미지"
                    width="30"
                    height="30"
                />
                <p>{detail.nickname}</p>
                <span>
                    <Icon name='clock outline' />
                    <Moment fromNow>{detail.wdate}</Moment>
                </span>
                <span>
                    <Icon name='globe' />
                    {detail.readcount}
                </span>

                <BbsDropdown bbsseq={bbsseq} memberseq={detail.memberseq} />
            </div><hr/>

            <div style={{ display:'inline-block', width:'50%' }}>
                <Viewer initialValue={detail.content || ''} />
            </div>

            <div style={{ display:'inline-block', width:'50%' }}>
                <div>지역 {ADDRESS_LIST.data[detail.addressfirst][0]} {ADDRESS_LIST.data[detail.addressfirst][1][detail.addresssecond]}</div>
                <div>헬스장 {detail.center ? <span>{detail.center}</span> : <span>-</span>}</div>
                <div>날짜 시간 {detail.mdate} {detail.mtime}</div>
                <div>운동 부위 {bodyPart.map((v, i) => {
                    if(v == 0) return;
                    return (
                        <Button active basic circular size='mini' color='grey' key={i}>{koBody[i]}</Button>
                    );
                })}</div>
            </div>
            
            <div style={{ height:'35px', marginTop:'30px' }}>

                
                <div style={{ float:'right'}}>
                    <CopyToClipboard text={currentUrl}>
                    <URLShareButton>URL</URLShareButton>
                    </CopyToClipboard>
                    
                    <KakaoShareButton onClick={() => shareKakao(currentUrl, detail.title)}>
                    <img alt='share to kakao' src={kakao} width={35} />
                    </KakaoShareButton>

                </div>
            </div>
            
            <Button>쪽지 보내기</Button>
        </div>
    );
}
const URLShareButton = styled.button`
	width: 35px;
	height: 35px;
	color: white;
	border-radius: 24px;
	border: 0px;
  margin-right: 5px;
	font-weight: 700;
	font-size: 12px;
	cursor: pointer;
	background-color: #5271FF;
	&:hover {
		background-color: #9EBFFF;
	}
`;
const KakaoShareButton = styled.a`
  display: inline-block;
  width: 35px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;