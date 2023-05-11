import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import ADDRESS_LIST from '../../asset/region.json';
import { Form, Button } from 'semantic-ui-react';
import SelectBodyPart from './SelectBodyPart';

export default function HealthEditor() {
    let navigate = useNavigate();

    const [memberseq, setMemberseq] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [addressFirst, setAddressFirst] = useState(0);
    const [addressSecond, setAddressSecond] = useState(0);
    const [center, setCenter] = useState('');
    const [mdate, setMdate] = useState('');
    const [mtime, setMtime] = useState('');
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);

    const [imageArr, setImageArr] = useState([]);

    // login 되어 있는지 검사하고 member_seq 얻기
    useEffect(() => {
        const s = localStorage.getItem("memberseq");
        if(s !== null){
            setMemberseq(s);
        } else {
            alert('로그인 후 작성 가능합니다.');
            navigate('/login');
        }
    }, []);

    // Editor DOM 선택용
    const editorRef = useRef();

    // 등록 버튼 핸들러
    const handleRegisterButton = () => {
        let markdown = editorRef.current.getInstance().getMarkdown();

        if(title.trim() === ''){
            alert('제목을 입력해주세요.');
            return;
        } else if(markdown.length === 0) {
            alert('내용을 입력해주세요.');
            return;
        }

        // 이미지 배열 비교 및 삭제
        let [deleteImg, contentImg] = imageFilter(markdown);
        
        if(deleteImg !== null) {
            deleteImg.forEach(img => {

                let imageRef = ref(storage, "https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%"+img+"?alt=media");
                deleteObject(imageRef).then(() => {
                    console.log("이미지 삭제 완료");
                }).catch((error) => {
                    console.log("이미지 삭제 실패"); 
                });
            });
        }

        let paramsObj = {
            "memberseq":memberseq, 
            "bbstag":5,
            "title":title, 
            "content":content, 
            "addressfirst":addressFirst,
            "addresssecond":addressSecond,
            "center":center,
            "mdate":mdate,
            "mtime":mtime,
            "bodypart":bodyPart.join(",")
        };

        axios.post("http://localhost:3000/mate/write", null, 
                    { params:paramsObj })
             .then(res => {
                console.log(res.data);
                if(res.data){
                    alert("성공적으로 등록되었습니다");
                    navigate(`/mate/health`);
                }else{
                    alert("등록되지 않았습니다");
                }
             })
             .catch(function(err){
                alert(err);
             })
    };
    
    // 파이어베이스 설정
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: "healthygym-8f4ca.firebaseapp.com",
        projectId: "healthygym-8f4ca",
        storageBucket: "healthygym-8f4ca.appspot.com",
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    };

    const firebaseApp = initializeApp(firebaseConfig); 
    const storage = getStorage(firebaseApp); 
    
    // 이미지 업로드 핸들러
    const onUploadImage = async (blob, dropImage) => {
        // console.log(blob);
        
        const [url, filename] = await uploadImage(blob); // 업로드된 이미지 서버 url
        // console.log(url);
        dropImage(url, 'alt_text'); // 에디터에 이미지 추가

        // 이미지 배열에 저장
        setImageArr(prev => [...prev, filename]);
    };
    const uploadImage = async (blob) => { 
    	try{ // firebase Storage Create Reference 파일경로 / 파일명 . 확장자
            const filename = Date.now();
        	const storageRef = ref(storage, `files/${filename + '.' + blob.type.substring(6, 10)}`); 
            // firebase upload 
            const snapshot = await uploadBytes(storageRef, blob); 
            
            return [await getDownloadURL(storageRef), filename]; 
        } catch (err){ 
        	console.log(err) 
            return false; } 
    }

    // 본문과 imageArr 비교하여 삭제할 이미지들 반환
    const imageFilter = (ele) => {
        let deleteImg = imageArr;
        let contentImg = contentToArray(ele);

        for(let i = 0; i < imageArr.length; i++) {
            for(let j = 0; j < contentImg.length; j++) {
                if(imageArr[i] === contentImg[j]) {
                    deleteImg.splice(i, 1);
                }
            }
        }
        console.log(deleteImg);
        return [deleteImg, contentImg];
    }
    // 본문 마크다운에서 이미지 이름을 배열로 빼내기
    const contentToArray = (ele) => {
        let contentStr = ele.split("![alt_text]").filter(str=>str.includes("https://firebasestorage.googleapis.com/"));
        for(let j = 0; j < contentStr.length; j++) {
            contentStr[j] = contentStr[j].substring(contentStr[j].indexOf("%")+1, contentStr[j].indexOf("?"));
        }
       return contentStr;
    }

    return (
        <div className="edit_wrap">
            <br/>
            <h2>글쓰기</h2>
            <Form>
                <select onChange={(e) => {if(e.target.value < 5) navigate("/write");}}>
                    <optgroup label='커뮤니티'>
                        <option value={2}>바디갤러리</option>
                        <option value={3}>정보</option>
                        <option value={4}>자유</option>
                    </optgroup>
                    <optgroup label='헬친'>
                        <option value={5} selected>헬스메이트</option>
                        <option value={10}>식단메이트</option>
                    </optgroup>
                </select><br/>

                <input
                    type="text"
                    placeholder="제목을 입력해주세요"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                /><br/><br/>

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
                        <label>헬스장</label>
                        <input
                            type="text"
                            placeholder="헬스장을 입력해주세요"
                            value={center}
                            onChange={(e)=>setCenter(e.target.value)}
                        />
                    </Form.Field>
                </Form.Group>
                
                <Form.Group widths='equal'>
                    <Form.Field required>
                        <label>날짜</label>
                        <input type='date' onChange={(e) => {setMdate(e.target.value)}} />
                    </Form.Field>
                    <Form.Field required>
                        <label>시간</label>
                        <input type='time' onChange={(e) => {setMtime(e.target.value)}}/>
                    </Form.Field>
                </Form.Group>

                <Form.Field>
                    <label>운동 부위 선택</label>
                    <div style={{ backgroundColor:'#f7f9fc', borderRadius:'3px', padding:'9.5px 14px'}}>
                        <SelectBodyPart bodyPart={bodyPart} setBodyPart={setBodyPart} />
                    </div>
                </Form.Field>
            </Form><br/>

            <Editor
                placeholder="내용을 입력해주세요."
                initialValue={content}
                previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // 미리보기 스타일 지정
                height="300px" // 에디터 창 높이
                initialEditType="wysiwyg" // 초기 입력모드 설정
                language="ko-KR"
                toolbarItems={[           // 툴바 옵션 설정
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task'],
                    ['table', 'image', 'link'],
                    ['code', 'codeblock'],
                    ['scrollSync']
                ]}
                useCommandShortcut={false} // 키보드 입력 컨트롤 방지
                ref={editorRef}
                onChange={() => setContent(editorRef.current.getInstance().getHTML())}
                hooks={{ addImageBlobHook: onUploadImage }}
            /><br/>
            <Button onClick={handleRegisterButton} 
                style={{ color:'white', backgroundColor:'#5271FF', display: 'flex', margin: 'auto' }}>
                등 록
            </Button>
        </div>
    );
}