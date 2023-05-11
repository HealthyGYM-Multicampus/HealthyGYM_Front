import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';
import { Icon, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import ADDRESS_LIST from '../../asset/region.json';

export default function HealthBox(props) {
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);
    const koBody = ["등", "가슴", "어깨", "팔", "복근", "하체", "유산소"];
    useEffect(() => {

        setBodyPart([props.data.back, props.data.chest, props.data.shoulder, props.data.arm, props.data.abs, props.data.leg, props.data.run]);
    }, []);
    return (
        <div>
            <div style={{  }}>
                <img
                    src={`http://localhost:3000/images/${props.data.profile}`}
                    alt="프로필 이미지"
                    width="30"
                    height="30"
                />
                <div>{props.data.nickname}</div>
                <Link to={`/mate/health/view/${props.data.bbsseq}`}>{props.data.title}</Link>

                <span style={{}}>
                    <span>{ADDRESS_LIST.data[props.data.addressfirst][0]} {ADDRESS_LIST.data[props.data.addressfirst][1][props.data.addresssecond]}</span>
                    <span>{props.data.mdate} {props.data.mtime}</span>
                    <div>{bodyPart.map((v, i) => {
                        if(v == 0) return;
                        return (
                            <span key={i}>{koBody[i]} </span>
                        );
                    })}</div>
                </span>
            </div>
            
            <div>
                <span>
                    <Icon name='sign-in' />
                    {props.data.readcount}
                </span>
                
                <span>
                    <Icon name='clock outline' />
                    <Moment fromNow>{props.data.wdate}</Moment>
                </span>
            </div>
        </div>
    );
}