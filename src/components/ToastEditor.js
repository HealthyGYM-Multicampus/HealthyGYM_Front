import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from '../utils/CustomAxios';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Form, Button, Dropdown, Icon } from 'semantic-ui-react';
import youtubeicon from '../asset/icon_youtube.png';

export default function ToastEditor() {
    let navigate = useNavigate();

    const [memberseq, setMemberseq] = useState(0);
    const [bbstag, setBbstag] = useState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
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

    const handleBbstag = (value) => {
        if(value == 2) navigate("/community/gallery/write"); 
        if(value == 5) navigate("/mate/health/write");
        if(value == 10) navigate("/mate/meal/write");
        setBbstag(value);
    } ;

    // Editor DOM 선택용
    const editorRef = useRef();

    // 등록 버튼 핸들러
    const handleRegisterButton = () => {
        let markdown = editorRef.current.getInstance().getMarkdown();
        console.log(bbstag);
        if(bbstag === 0 || bbstag === undefined) {
            alert('토픽을 선택해주세요');
            return;
        } else if(title.trim() === ''){
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
            "title":title, 
            "content":content, 
            "bbstag":bbstag,
            "thumnail":contentImg[0]
        };

        // post
        axios.post("http://localhost:3000/writefreebbs", null, 
                    { params:paramsObj })
             .then(res => {
                console.log(res.data);
                if(res.data === "OK"){
                    alert("성공적으로 등록되었습니다");
                    navigate(`/community/${bbstag}`);
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

    const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
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
    
    // 유튜브 삽입을 위한 커스텀 툴바 아이템 생성
    const myCustomEl = document.createElement('span');
    myCustomEl.style = 'cursor: pointer;'

    const icon = document.createElement('img');
    icon.setAttribute('src', youtubeicon);
    icon.setAttribute('width', '32');
    myCustomEl.appendChild(icon);
    
    // 팝업 바디 생성
    const container = document.createElement('div');
    const description = document.createElement('p');
    description.innerText = "Youtube 주소를 입력하고 Enter를 누르세요!\n(퍼가기가 허용된 영상만 삽입 가능합니다.)";

    const urlInput = document.createElement('input');
    urlInput.style.width = '100%';

    // 팝업 input 창에 내용 입력 시 호출됨
    urlInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {    // 엔터를 누르면, 입력값이 Youtube 주소인지 정규식으로 검사
            if((/https:\/\/youtu.be\/.{11,}/).test(e.target.value)
                || (/https:\/\/www.youtube.com\/watch\?v=.{11,}/).test(e.target.value)) {

                let str = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/'
                + e.target.value.slice(-11)
                + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
                
                // 마크다운 모드에서 iframe 태그 삽입 후, 팝업을 닫고 위지윅 모드로 변환 
                editorRef.current.getInstance().changeMode('markdown');
                editorRef.current.getInstance().insertText(str);
                editorRef.current.getInstance().eventEmitter.emit('closePopup');
                editorRef.current.getInstance().changeMode('wysiwyg');
            }
        }
    });
    
    container.appendChild(description);
    container.appendChild(urlInput);

    return (
        <div className="edit_wrap">
            <br/>
            <h2>글쓰기</h2>
            <Form>
                <Dropdown
                    className='topic-select'
                    value={bbstag} onChange={(e, { value }) => handleBbstag(value)}
                    placeholder='토픽을 선택해주세요'
                    fluid
                    selection
                    options={[{key:0, value:0, text:'커뮤니티', disabled:true, icon:'discussions'},
                            {key:2, value:2, text:'바디갤러리'},
                            {key:3, value:3, text:'정보게시판'},
                            {key:4, value:4, text:'자유게시판'},
                            {key:11, value:11, text:'식단추천'},
                            {key:100, value:100, text:'헬친', disabled:true, icon:'child'},
                            {key:5, value:5, text:'운동메이트'},
                            {key:10, value:10, text:'식단메이트'}]}
                /><br/>
                
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="제목을 입력해주세요"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
            </Form><br/>
            <div>Tip! 이미지 편집 기능을 이용해 보세요! <Link to="/image/edit" target="_blank" style={{ color:'#5271FF'}}><Icon className="camera" />이미지 에디터</Link><br/><br/></div>
            <Editor
                placeholder="내용을 입력해주세요."
                initialValue={content}
                previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // 미리보기 스타일 지정
                height="500px" // 에디터 창 높이
                initialEditType="wysiwyg" // 초기 입력모드 설정
                language="ko-KR"
                toolbarItems={[           // 툴바 옵션 설정
                    ['heading', 'bold', 'italic', 'strike', 'quote'],
                    ['ul', 'ol', 'task'],
                    ['image', 'link'],
                    ['code', 'codeblock'],
                    [{
                        name: 'Youtube',
                        tooltip: 'Youtube 삽입',
                        el: myCustomEl,
                        popup: {
                            body: container,
                            style: { width: 'auto' },
                          }
                    }],
                    ['scrollSync']
                ]}
                useCommandShortcut={false} // 키보드 입력 컨트롤 방지
                ref={editorRef}
                onChange={() => setContent(editorRef.current.getInstance().getHTML())}
                hooks={{ addImageBlobHook: onUploadImage }}
                // 유튜브 삽입 및 미리보기를 위한 설정(iframe)
                customHTMLRenderer={{
                    htmlBlock: {iframe(node) {
                        return [
                        {
                            type: 'openTag',
                            tagName: 'iframe',
                            outerNewLine: true,
                            attributes: node.attrs
                        },
                        { type: 'html', content: node.childrenHTML },
                        { type: 'closeTag', tagName: 'iframe', outerNewLine: true }
                        ];
                    }}
                }}
            /><br/>
            <Button onClick={handleRegisterButton} size='large'
                style={{ color:'white', backgroundColor:'#5271FF', display: 'block', margin: 'auto' }}>
                &nbsp;등 록&nbsp;
            </Button><br/>

        </div>
    );
}