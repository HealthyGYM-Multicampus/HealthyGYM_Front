import { Link } from "react-router-dom";
import styled from "styled-components";

export const BbsWrapper = styled.div`
    &>div {
        display: inline-block; 
        box-sizing: border-box;
        width: 50%;
        border-bottom: 2px solid rgba(34,36,38,.15);
        padding: 15px;
    }
    &>div:nth-child(2n+1) {
        border-right: 2px solid rgba(34,36,38,.15);
    }
`;
export const ImgLayer = styled.div`
    position: absolute;
    top: 0;
    text-align: center;
    width: 80px;
    height: 80px;
    line-height: 80px;
    background: rgba(0,0,0,0.5);
    color: white;
`;
export const TitleLink = styled(Link)`
    color: black;
    font-size: 16px;
    font-weight: 600;
    width:250px; 
    height:45px; 
    margin-bottom:14px;
    whiteSpace:normal; 
    overflow:hidden; 
    display:-webkit-box; 
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    :hover {
        color: black;
    }
`;
export const InfoDiv = styled.div`
    color: #94969b;
    font-size: 12px;
    display: flex;
    &>span {
        margin-right: 10px;
    }
    &>span:last-child {
        margin-left: auto;
    }
    &>span>span {
        margin-left: 3px;
    }
    &>span>time {
        margin-left: 3px;
    }
`;
