import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import youtubeicon from '../asset/icon_youtube.png';

export default function ToastEditor() {
    let navigate = useNavigate();

    const [memberseq, setMemberseq] = useState(1);
    const [bbstag, setBbstag] = useState(0);
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

    // Editor DOM 선택용
    const editorRef = useRef();

    // 등록 버튼 핸들러
    const handleRegisterButton = () => {
        let markdown = editorRef.current.getInstance().getMarkdown();

        if(bbstag === 0) {
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

        // 각자 사용 시 params 변경하면 됨!!!!
        axios.post("http://localhost:3000/writefreebbs", null, 
                    { params:paramsObj })
             .then(res => {
                console.log(res.data);
                if(res.data === "OK"){
                    alert("성공적으로 등록되었습니다");
                    navigate(`/topics/${bbstag}`);
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
        apiKey: "AIzaSyDpYZJPtXWK2JyTQW9vxbxiiysDhOGhx7k",
        authDomain: "healthygym-8f4ca.firebaseapp.com",
        projectId: "healthygym-8f4ca",
        storageBucket: "healthygym-8f4ca.appspot.com",
        messagingSenderId: "1087556149477",
        appId: "1:1087556149477:web:078cd9ec747dc5c863740c",
        measurementId: "G-HBKWRZVGEQ"
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
    description.innerText = "Youtube 주소를 입력하고 Enter를 누르세요!";

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
            <h2>글쓰기</h2><hr/>

            <select value={bbstag} onChange={(e) => setBbstag(e.target.value)}>
                <option value={0} hidden>토픽을 선택해주세요</option>
                <optgroup label='커뮤니티'>
                    <option value={2}>바디갤러리</option>
                    <option value={3}>정보</option>
                    <option value={4}>자유</option>
                    <option value={11}>식단추천</option>    

                </optgroup>
            </select><br/>

            <input
                type="text"
                id="title"
                name="title"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

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
            />
            <button onClick={handleRegisterButton}>등록</button>

        </div>
    );
}