import { useState, useEffect, useCallback } from "react";

import useInfiniteScroll from "../../utils/useInfiniteScroll";
import axios from "../../utils/CustomAxios";
import ADDRESS_LIST from '../../asset/region.json';
import styled from "styled-components";
import { Form, Icon, Button } from 'semantic-ui-react';
import SelectBodyPart from "./SelectBodyPart";
import HealthBox from "./HealthBox";
import MateNav from "./MateNav";

export default function HealthList() {
    const [bbsList, setBbsList] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [addressFirst, setAddressFirst] = useState(0);
    const [addressSecond, setAddressSecond] = useState(0);
    const [mdate, setMdate] = useState('');
    const [mtime, setMtime] = useState('');
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);
    const [filtering, setfiltering] = useState(false);


    const getBbs = useCallback(async () => {
        setIsLoading(true);
        const paramObj = { "page":0, "addressFirst":addressFirst, "addressSecond":addressSecond,
                            "mdate":mdate, "mtime":mtime, "bodypart":bodyPart.join(",")  };
        console.log(paramObj);
        await axios.get('http://localhost:3000/mate/getlist', { params:paramObj })
            .then(function(res) {
                console.log(res.data);

                setPage(page + 1);
                setBbsList(prev => [...prev, ...res.data]);
                setHasMore(res.data.length === 3);
            })
            .catch(function(err){
                console.log(err);    
            });

        setIsLoading(false);
    }, [page]);

    useEffect(() => {
        setHasMore(true);
        setBbsList([]);
        setPage(0);
    }, [filtering]);

    const target = useInfiniteScroll(async (entry, observer) => {
        if(hasMore && !isLoading) {
            await getBbs()
        }
    });

    const timeLoop = () => {
        const arr = [];
        for(let i = 0; i < 24; i++) {
            arr.push(<option key={i} value={`${i}:%`}>
                        {i < 10 ? `0${i}`:i} ~ {i < 9 ? `0${i+1}`:i+1}
                    </option>);
        }
        return arr;
    };

    return (
        <div>
            <MateNav />
            <Form size="mini">
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>시도명</label>
                        <select value={addressFirst} onChange={(e) => setAddressFirst(e.target.value)}>
                            {ADDRESS_LIST.data.map((r, i) => {
                                return (
                                    <option key={i} value={i}>{r[0]}</option>
                                );
                            })}
                        </select>
                    </Form.Field>
                    <Form.Field>
                        <label>시군구명</label>
                        <select value={addressSecond} onChange={(e) => setAddressSecond(e.target.value)}>
                            {ADDRESS_LIST.data[addressFirst][1].map((r, i) => {
                                return (
                                    <option key={i} value={i}>{r}</option>
                                );
                            })}
                        </select>
                    </Form.Field>
                    <Form.Field>
                        <label>날짜</label>
                        <input type='date' value={mdate} onChange={(e) => {setMdate(e.target.value)}} />
                    </Form.Field>
                    <Form.Field>
                        <label>시간대</label>
                        <select value={mtime} onChange={(e) => setMtime(e.target.value)}>
                            <option value="">전체</option>
                            {timeLoop()}
                        </select>
                    </Form.Field>
                </Form.Group>
            </Form>
            <span>운동 부위</span>
            <div style={{ display:"inline-block", width:"400px" }}>
                <SelectBodyPart bodyPart={bodyPart} setBodyPart={setBodyPart} />
            </div>
            <Button size="mini" onClick={() => {setfiltering(!filtering)}}>필터 검색</Button>

            <BbsWrapper>
                {bbsList.map((bbs, i) => (
                    <HealthBox key={i} data={bbs} />
                ))}
            </BbsWrapper>

            {isLoading && hasMore && <p>Loading</p>}
            {hasMore ? <div ref={target}>target</div> : <div>게시글의 끝입니다.</div>}
        </div>
    );
}

const BbsWrapper = styled.div`
    &>div {
        display: inline-block; 
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1px solid lightgray;
    }
    &>div:nth-child(2n+1) {
        border-right: 1px solid lightgray;
    }
`;