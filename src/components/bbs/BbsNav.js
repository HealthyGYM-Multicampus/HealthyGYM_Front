import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from 'semantic-ui-react';

export default function BbsNav(props) {
    const [activeItem, setActiveItem] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // URL 검사
        const path = window.location.pathname;

        if(path === "/community/0") {
            setActiveItem("토픽 베스트");
          } else if(path === "/community/1") {
            setActiveItem("운동루틴");
          } else if(path === "/community/2") {
            setActiveItem("바디갤러리");
          } else if(path === "/community/3") {
            setActiveItem("정보게시판");
          } else if(path === "/community/4") {
            setActiveItem("자유게시판");
          }
    }, [window.location.pathname]);

    const handleItemClick = (e, { name }) => {
        if(name === '토픽 베스트') {
            navigate('/community/0');
        } else if(name === '운동루틴') {
            navigate('/community/1');
        } else if(name === '바디갤러리') {
            navigate('/community/2');
        } else if(name === '정보게시판') {
            navigate('/community/3');
        } else if(name === '자유게시판') {
            navigate('/community/4');
        }
    };

    return (
        <>
            <Menu pointing secondary style={{ margin:'0px', width:'100%'}}>
                <Menu.Item
                    name='토픽 베스트'
                    active={activeItem === '토픽 베스트'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='운동루틴'
                    active={activeItem === '운동루틴'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='바디갤러리'
                    active={activeItem === '바디갤러리'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='정보게시판'
                    active={activeItem === '정보게시판'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='자유게시판'
                    active={activeItem === '자유게시판'}
                    onClick={handleItemClick}
                />
                <Menu.Menu position='right'>
                    <Dropdown
                        options={[{ key: '최신순',
                                    text: '최신순',
                                    value: 'wdate'
                                }, {
                                    key: '추천순',
                                    text: '추천순',
                                    value: 'likecount desc, wdate'}]}
                        defaultValue={'wdate'}
                        value={props.order}
                        onChange={(e, { value }) => props.setOrder(value)}
                        style={{ padding:'9px 16px'}} />
                </Menu.Menu>
            </Menu>
        </>
    );
}