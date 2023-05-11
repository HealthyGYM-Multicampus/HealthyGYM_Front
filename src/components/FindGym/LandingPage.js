import React, { useState } from 'react';
import Map from './Map';

const LandingPage = () => {
    // 입력 폼 변화 감지하여 입력 값 관리
    const [Value, setValue] = useState("");
    // 제출한 검색어 관리
    const [Keyword, setKeyword] = useState("");
    // 입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
    const keywordChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    };
    // 제출한 검색어 state에 담아주는 함수
    const submitKeyword = (e) => {
        e.preventDefault();
        setKeyword(Value);
    };
    // 검색어를 입력하지 않고 검색 버튼을 눌렀을 경우
    const valueChecker = () => {
        if (Value === "") {
            alert("검색어를 입력해주세요.");
        }
    };
    return (
    <div>
      <div>
        <div>
          <form onSubmit={ submitKeyword }>
              <input type="text" onChange={ keywordChange } placeholder="검색어를 입력하세요" required />
              <div>
                <input type="submit" value="검색" onClick={ valueChecker }/>
              </div>
          </form>
        </div>
        {/* 제출한 검색어 넘기기 */}
        <Map searchKeyword={ Keyword }/>
      </div>
    </div>
    );
};
export default LandingPage;