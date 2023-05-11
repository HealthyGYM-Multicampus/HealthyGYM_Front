import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from 'semantic-ui-react';

export default function MateNav() {
    const [activeItem, setActiveItem] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // URL 검사
        const path = window.location.pathname;

        if(path === "/mate/health") {
            setActiveItem("운동메이트");
          } else if(path === "/mate/gym") {
            setActiveItem('GYM 찾기');
          } else if(path === "/mate/meal") {
            setActiveItem("식단메이트");
          } else if(path === "/mate/sharing") {
            setActiveItem("식단공유");
          }
    }, [window.location.pathname]);

    const handleItemClick = (e, { name }) => {
        if(name === '운동메이트') {
            navigate('/mate/health');
        } else if(name === 'GYM 찾기') {
            navigate('/mate/gym');
        } else if(name === '식단메이트') {
            navigate('/mate/meal');
        } else if(name === '식단공유') {
            navigate('/mate/sharing');
        }
    };

    return (
        <>
            <Menu pointing secondary style={{ margin:'0px', width:'100%'}}>
                <Menu.Item
                    name='운동메이트'
                    active={activeItem === '운동메이트'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='GYM 찾기'
                    active={activeItem === 'GYM 찾기'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='식단메이트'
                    active={activeItem === '식단메이트'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='식단공유'
                    active={activeItem === '식단공유'}
                    onClick={handleItemClick}
                />
            </Menu>
        </>
    );
}