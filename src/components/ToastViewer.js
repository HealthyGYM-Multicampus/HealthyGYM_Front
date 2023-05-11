import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import BbsComment from "./bbs/BbsComment.js";

import clockicon from "../asset/icon_clock.png";
import readicon from "../asset/icon_readcount.png";
import doticon from "../asset/icon_dot.png";
import likeicon from "../asset/icon_like.png";
import likefilledicon from "../asset/icon_like_filled.png";
import MealRecommend from './Message/MealRecommend.js';




function ToastViewer() {
    let history = useNavigate();

    const [memberseq, setMemberseq] = useState(localStorage.getItem("memberseq"));  // 로그인 아이디로 세팅해야함!!!
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [liking, setLiking] = useState(false);      // 로그인한 유저의 좋아요 여부
    const [likecount, setLikecount] = useState(0);  // 게시글의 좋아요 수
    const [bbstag, setBbstag] = useState(0);      // Bbstag 몇번인지.

    const { bbsseq } = useParams();



    useEffect(()=>{
      const s = localStorage.getItem("memberseq");
      if(s !== null) setMemberseq(s);

      detailData(bbsseq);
    }, [bbsseq]);

    // 게시글 가져오기
    const detailData = async(seq) => {
        const response = await axios.get('http://localhost:3000/freebbsdetail', { params:{"bbsseq":seq, "memberseq":memberseq} });
        // console.log(memberseq);
        // console.log(JSON.stringify(response.data));
        setBbstag(response.data[0].bbstag);

        
        setDetail(response.data[0]);
        setLikecount(response.data[0].likecount);
        setLiking(response.data[0].liking);

        setLoading(true);   // 여기서 rendering해줌
    }

    // 좋아요 기능
    const likeHandler = async () => {
      if(memberseq !== null && memberseq !== 0) {

        if(liking) {  // 좋아요 해제
          await axios.post('http://localhost:3000/unlikebbs', null, { params:{"bbsseq":bbsseq, "memberseq":memberseq} })
              .then(function(res){
                  // console.log(res.data);
                  setLikecount(likecount - 1);
                  setLiking(!liking);
              })
              .catch(function(err){
                  console.log(err);
              })
        } else {  // 좋아요 누름
          await axios.post('http://localhost:3000/likebbs', null, { params:{"bbsseq":bbsseq, "memberseq":memberseq} })
              .then(function(res){
                  // console.log(res.data);
                  setLikecount(likecount + 1);
                  setLiking(!liking);
              })
              .catch(function(err){
                  console.log(err);
              })
        }
      }
    }

    if(loading === false){
        return <div>Loading...</div>
    }

    return (
      <div>
        <div>
          <h3>{detail.title}</h3>
          <p>{detail.nickname}</p>
          <span>
            <img alt="clock" src={clockicon} width="15"/>
            <Moment fromNow>{detail.wdate}</Moment>
          </span>
          <span>
            <img alt="eye" src={readicon} width="15"/>
            {detail.readcount}
          </span>
          <span><img alt="dot" src={doticon} width="15"/></span>
        </div><hr/>

        <Viewer 
          initialValue={detail.content || ''} 
          // 유튜브를 보기 위한 설정(iframe)
          customHTMLRenderer={{
            htmlBlock: {
              iframe(node) {
                return [
                  {
                    type: "openTag",
                    tagName: "iframe",
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: "html", content: node.childrenHTML },
                  {
                    type: "closeTag",
                    tagName: "iframe",
                    outerNewLine: false
                  }
                ];
            }}
          }}
        />
        <br/>
        {/* 11번 만 보이게 */}
        {bbstag === 11 && (
          <div>
            <MealRecommend detail={detail}/>
          </div>
        )}

        

        <br/>
        <span>
          <img alt="thumb" 
            src={liking?likefilledicon:likeicon} 
            width="15" 
            onClick={likeHandler}/>
          {likecount}
        </span>

        <hr/>
        <BbsComment bbsseq={bbsseq} />
      </div>
    );
}

export default ToastViewer;