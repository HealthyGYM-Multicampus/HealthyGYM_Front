import styled from "styled-components";

export const SocialButton = styled.div`
    display:inline-block;
    width:48px;
    height:48px;
    border-radius:35;
    margin:0 10px;
    cursor: pointer;
    &:hover{
        opacity: 0.5;
    }
`;
export const Description = styled.div`
    margin-bottom: 10px;
    font-size: 14px;
    color: rgb(130, 140, 148);
`;
export const Label = styled.div`
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 700;
`;
export const Msg = styled.div`
    color: rgb(255, 119, 119);
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    padding: 10px 0;
`;