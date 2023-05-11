import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';
import { Icon } from 'semantic-ui-react';
import readicon from "../../asset/icon_readcount.png";
import styled from 'styled-components';
import { ImgLayer, InfoDiv, TitleLink } from './bbsStyle';

export default function BbsBox(props) {
    const [imgNum, setImgNum] = useState(0);

    useEffect(() => {

        if(props.data.content !== undefined) {
    
            const imgArr = props.data.content.split('<img').filter(str=>str.includes("src"));
            if(imgArr.length > 0) setImgNum(imgArr.length);
        }
    }, []);

    
    return (
        <div>
            <div style={{ position:'relative'}}>

                <TitleLink to={`/view/${props.data.bbsseq}`}>{props.data.title}</TitleLink>
                <p>{props.data.nickname}</p>

                <span style={{ position:'absolute', top:'0', right:'0'}}>
                    {props.data.thumnail !== undefined && 
                        <img 
                            src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${props.data.thumnail}?alt=media`} 
                            alt=''
                            width={70}
                            height={70}/>
                    }
                    {imgNum > 1 &&
                        <ImgLayer>
                            +{imgNum - 1}
                        </ImgLayer>
                    }
                </span>
            </div>
            
            <InfoDiv>
                <span>
                    <Icon name='eye' size='tiny' />
                    <span>{props.data.readcount}</span>
                </span>
                <span>
                    <Icon name='thumbs up outline' size='tiny' />
                    <span>{props.data.likecount}</span>
                </span>
                <span>
                    <Icon name='comment outline' size='tiny' />
                    <span>{props.data.cmtcount}</span>
                </span>
                <span>
                    <Icon name='clock outline' size='tiny' />
                    <Moment fromNow>{props.data.wdate}</Moment>
                </span>
            </InfoDiv>
        </div>
    );
}
