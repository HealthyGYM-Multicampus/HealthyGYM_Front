import React from 'react';
import Moment from 'react-moment';
import 'moment/locale/ko';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import defaultImage from '../../asset/GYM.png';

export default function PostCard(props) {
  const linkMap = {
    2: `/community/gallery/view/${props.data.bbsseq}`,
    3: `/view/${props.data.bbsseq}`,
    4: `/view/${props.data.bbsseq}`,
    5: `/mate/health/view/${props.data.bbsseq}`,
    10: `/mate/meal`,
  };
  
  const linkTo = linkMap[props.data.bbstag] || `/view/${props.data.bbsseq}`;
  // 링크 위치, 크기 변경
  return (
    
    <Card>
      <Card.Content>
        <Image
          floated="left"
          size="mini"
          src={`http://localhost:3000/images/profile/${props.data.profile}`}
          alt="profile"
        />
        <span style={{ display:'inline-block', margin: '7px 0', fontSize:'15px', color:'black'}}>{props.data.nickname}</span>
        <Card.Meta style={{ float: 'right' }}>
          <Moment fromNow>{props.data.wdate}</Moment>
        </Card.Meta>
      </Card.Content>
      <Link to={linkTo}> 
        <div style={{ width: '100%', paddingTop: '120%', position: 'relative' }}>
          <Image
            src={
              props.data.thumnail
                ? `https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${props.data.thumnail}?alt=media`
                : defaultImage
            }
            alt="thumbnail"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          </div>
        <Card.Content style={{ textAlign: 'center', fontWeight: 'bold', margin: '10px', color:'black', textOverflow:'ellipsis', overflow:'hidden' }}>
          {props.data.title}
        </Card.Content>
      </Link>
      <Card.Content extra>
        <span style={{ float: 'right' }}>
          <i className="heart outline like icon"></i>
          {props.data.likecount} likes
        </span>
        <span style={{ float: 'left' }}>
          <i className="comment icon"></i>
          {props.data.cmtcount} comments
        </span>
      </Card.Content>     
    </Card>
  );
}
