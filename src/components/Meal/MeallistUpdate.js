import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../utils/CustomAxios';

import { Button, Icon, Form, Table, Card, Grid, Input, Pagination, Modal, Header, Loader } from 'semantic-ui-react'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

import { useParams } from 'react-router-dom';


function MeallistUpdate() {
    const { bbsseq } = useParams();
    const parsedBbsseq = parseInt(bbsseq);

    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalCalories, settotalCalories] = useState(0);
    const [totalCarbo, settotalCarbo] = useState(0);
    const [totalprotein, settotalprotein] = useState(0);
    const [totalfat, settotalfat] = useState(0);

    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수

    

    const [totalCount, setTotalCount] = useState(0);
    const [totalpagenum, settotalpagenum] = useState(0);

    let navigate = useNavigate();

    const [memberseq, setMemberseq] = useState(); 
    const bbstag = 10;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [pageno, setPageno] = useState(1);

    const [open, setOpen] = React.useState(false);


    // 검색할때마다 totalCount 변경
    useEffect(() => {
        settotalpagenum(Math.ceil(totalCount / 10));
    //console.log(totalpagenum);
    }, [totalCount]);

    // login 되어 있는지 검사하고 member_seq 얻기
    useEffect(() => {
        const s = parseInt(localStorage.getItem("memberseq"), 10);
        if(s !== null){
            setMemberseq(s);
        } else {
            alert('로그인 후 수정이 가능합니다.');
            navigate('/login');
        }
        // 세션검사 끝

        // 기존 글의 초기 설정 불러오기

        
        
        
        axios.post('http://localhost:3000/mealupdate', {
            bbsseq: parsedBbsseq
            

          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(response => {
            //console.log(response);
            //console.log(response.data.bbsdto.content);
            setContent(response.data.bbsdto.content);
            setTitle(response.data.bbsdto.title);
            setSelectedItems(response.data.foodlist);

            setLoading(true);   // 여기서 rendering해줌
          });
    }, []);

    

   // Editor DOM 선택용
  const editorRef = useRef();  

  
  // icon 클릭시
  const searchIconClick = () => {
    setResult([]);
    SearchMealList(1);
  };

  // Enter 입력시
  const handleKeyDown = (e, state) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      // console.log("handle");
      // console.log("step1");
      setResult([]);
      // console.log("step2");
      SearchMealList(1);
      // console.log("step3");
      return;
    }
  };

  const removeSelectedItem = (indexToRemove, state) => {
    const selectItem2 = selectedItems[indexToRemove];
  
    settotalCalories(totalCalories - parseFloat(selectItem2.nutrcont1));
    settotalCarbo(totalCarbo - parseFloat(selectItem2.nutrcont2));
    settotalprotein(totalprotein - parseFloat(selectItem2.nutrcont3));
    settotalfat(totalfat - parseFloat(selectItem2.nutrcont4));
  
    
    setSelectedItems(selectedItems.filter((_, index) => index !== indexToRemove));
    
  };

  const handlePageChange = (event, data) => {
    const { activePage } = data;

    SearchMealList(activePage);
  };


  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPageno(1);
  }

  
  // 공공데이터 포털 API / JSON 형태로 받기
  const SearchMealList = (activePage) => {
    if (search === undefined || search.trim() === "") {
      alert("검색어를 입력해주세요");
      return Promise.reject("검색어를 입력해주세요"); // Promise.reject를 사용하여 실패한 Promise 객체 반환
    }
  
    // console.log(search);
    // console.log(pageno);
  
    return axios
      .get("http://localhost:3000/FindMealList", { params: { "search": search, "pageNo": activePage } })
      .then(function(resp) {
        //console.log(resp);
        // console.log(resp.data);
        // console.log(resp.data.totalCount);
        setTotalCount(resp.data.totalCount);
        
        const totalcnt = resp.data.totalCount;
        // console.log(totalcnt);
        
  
        if (totalcnt === 0) {
          alert("검색결과가 존재하지 않습니다.");
          setTotalCount(0);
          setSearch("");
          return; // Promise.resolve를 사용하여 성공한 Promise 객체 반환
        } else {

          setResult(resp.data.foodDtoList);
          return Promise.resolve(); // Promise.resolve를 사용하여 성공한 Promise 객체 반환
        }
      })
      .catch(function(err) {
        alert("오류가 발생했습니다. 잠시후 다시 실행해주세요.");
        return Promise.reject(err); // Promise.reject를 사용하여 실패한 Promise 객체 반환
      });
    }
  
  
  
  
  
  

  const addToSelectedItems = (item) => {
    setSelectedItems([...selectedItems, item]);
    settotalCalories(totalCalories + parseFloat(item.nutrcont1));
    
  }

  // 등록 버튼 핸들러
  const handleRegisterButton = () => {
    // 입력한 내용을 HTML 태그 형태로 출력
    // console.log(editorRef.current.getInstance().getHTML());
    // 입력한 내용을 MarkDown 형태로 출력
    // console.log(editorRef.current.getInstance().getMarkdown());
    // 제목 출력
    // console.log(title, memberseq, bbstag);

    if(title.trim() === ''){
      alert('제목을 입력해주세요.');
      return;
  } else if(editorRef.current.getInstance().getMarkdown().length === 0) {
      alert('내용을 입력해주세요.');
      return;
  }
  /*
  const foodDtos = selectedItems.map(item => {
    return {
      desckor: item.desckor,
      servingwt: item.servingwt,
      nutrcont1: item.nutrcont1,
      nutrcont2: item.nutrcont2,
      nutrcont3: item.nutrcont3,
      nutrcont4: item.nutrcont4,
      nutrcont5: item.nutrcont5,
      nutrcont6: item.nutrcont6,
      nutrcont7: item.nutrcont7,
      nutrcont8: item.nutrcont8,
      nutrcont9: item.nutrcont9,
      bgnyear: item.bgnyear,
      animalplant: item.animalplant

      
    };
    console.log(foodDtos);
  });
  */

 
    



    // 각자 사용 시 params 변경하면 됨!!!!
    axios.post("http://localhost:3000/updatemeal1", null, 
    {params:{  "bbsseq":parsedBbsseq, "title":title, "content":content, "bbstag":bbstag}})
          .then(res => {

            if(selectedItems.length !== 0){
               // DB에 저장하기 위해 선택된 항목들을 JSON으로 담기.
                const selectedItemsJson = JSON.stringify(selectedItems);
                // console.log(selectedItemsJson);
                axios.post('http://localhost:3000/updatemeal2', selectedItemsJson, {
                headers: {
                  'Content-Type': 'application/json',
                },
                params:{
                  bbsseq: parsedBbsseq  
                }
              })
              .then(response => {
                //console.log(response);
              })
              .catch(error => {
                console.error(error);
              });
            } // 2중 axios 끝

            // console.log(res.data);
            
            if(res.data === 1){
                alert("성공적으로 수정되었습니다");
                navigate('/mate/meal');
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

  
  // const firebaseApp = initializeApp(firebaseConfig); 
  // const storage = getStorage(firebaseApp); 

  // 파이어베이스 중복 초기화 방지
  let storage;

  if(getApps().length === 0){
    const firebaseApp = initializeApp(firebaseConfig);
    storage = getStorage(firebaseApp);  
  } else {
    storage = getStorage(getApp());
  }
  
  
    

    // 이미지 업로드 핸들러
    const onUploadImage = async (blob, dropImage) => {

      console.log(blob);
      
      const url = await uploadImage(blob); //업로드된 이미지 서버 url
      dropImage(url, 'alt_text'); //에디터에 이미지 추가
    };

    const uploadImage = async(blob) => { 
      try{ //firebase Storage Create Reference 파일 경로 / 파일 명 . 확장자 
          const storageRef = ref(storage, `files/${generateName() + '.' + blob.type.substring(6, 10)}`); 
            //firebase upload 
            const snapshot = await uploadBytes(storageRef, blob); 
            
            
            return await getDownloadURL(storageRef); 
        } catch (err){ 
          console.log(err) 
            return false; } 
    }

    // 랜덤 파일명 생성 
    const generateName = () => { 
      const ranTxt = Math.random().toString(36).substring(2,10); //랜덤 숫자를 36진수로 문자열 변환 
        const date = new Date(); 
        const randomName = ranTxt+'_'+date.getFullYear()+''+date.getMonth()+1+''+date.getDate()+''+date.getHours()+''+date.getMinutes()+''+date.getMinutes()+''+date.getSeconds(); 
        return randomName; 
    }


  if(loading === false){
      return <Loader active />
  }

  // 함수 끝 구조 생성
  return (
    <div>
      <br/>
      <h2>식단 공유 수정하기</h2>
      <Form>
      <input
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
      />
      </Form>
      <br/>
      <Editor
        placeholder="내용을 입력해주세요."
        value={content}
        initialValue={content}
        previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // 미리보기 스타일 지정
        height="300px" // 에디터 창 높이
        initialEditType="wysiwyg" // 초기 입력모드 설정
        language="ko-KR"
        toolbarItems={[           // 툴바 옵션 설정      ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['table', 'image', 'link'],
            ['code', 'codeblock'],
            ['scrollSync']
        ]}
        useCommandShortcut={false} // 키보드 입력 컨트롤 방지
        ref={editorRef}
        onChange={() => setContent(editorRef.current.getInstance().getHTML())}
        hooks={{
            addImageBlobHook: onUploadImage
        }}
      />


      <br/> 
      

          
        <Grid columns={2}>
        <Grid.Column width={16}>
        
        
        <Card fluid>
          <Card.Content style={{ maxHeight: "505px", minHeight: "505px", overflowY: "scroll"}}>
            <Card.Header>&nbsp;식단 검색/추가</Card.Header>
            <br/>
            <Card.Description>
              <Input
                action={{ icon: 'search', onClick: () => searchIconClick() }}
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 1)}

                
              />
            </Card.Description>
            
            <Table color="green" selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign='center'>상품명</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center'>제조사</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center'></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body style={{ maxHeight: "360px"}}>
                {selectedItems.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.desckor}</Table.Cell>
                    <Table.Cell>{item.animalplant.trim() === "" ? "N/A" : item.animalplant}</Table.Cell>
                    <Table.Cell>
                      <Button icon onClick={() => removeSelectedItem(index, 1)} size='mini' circular>
                        <Icon color='red' name='close' />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

          </Card.Content>
        </Card>
        

        </Grid.Column>

        <Grid.Column width={16}>
          { result.length > 0 && (
            <Card fluid>
            <Card.Content>
              <Card.Header>&nbsp;&nbsp;&nbsp;검색 결과</Card.Header>
              <div className="card-wrapper d-flex flex-wrap justify-content-center">
                {result.map((item, index) => (
                  <div className="card m-2 card-hover" style={{ width: "200px" }} key={index} onClick={() => addToSelectedItems(item, 1)}>
                    <div className="card-body">
                    <h5 className="card-title">{item.desckor}<p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{(item.animalplant.trim() === "") ? "N/A" : item.animalplant}</p></h5>
                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{item.nutrcont1} kcal ({item.servingwt}g)</p>
                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>탄수화물: {item.nutrcont2}g</p>
                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>단백질: {item.nutrcont3}g</p>
                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>지방: {item.nutrcont4}g</p>
                    </div>
                  </div>
                ))}
              </div>
              <br/>
              {result.length > 0 && (
                <div style={{ textAlign: 'center' }}>
                <Pagination
                  boundaryRange={0}
                  defaultActivePage={1}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={2}
                  totalPages={totalpagenum}
                  onPageChange={handlePageChange}
                  
                />
                </div>
              )}

              
            </Card.Content>
          </Card>
          )}
        </Grid.Column>
        </Grid>
            
      

      
      {/* <Button onClick={handleRegisterButton} style={{ color:'white', backgroundColor:'#5271FF', display: 'block', margin: 'auto' }}>
          등 록
      </Button> */}

      <Modal
      closeIcon
      open={open}
      trigger={<Button style={{ color:'white', backgroundColor:'#5271FF', display: 'block', margin: 'auto' }}>
                등 록
              </Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header content='확인해주세요!' icon='check circle outline' />
      <Modal.Content>
        <p>총 {selectedItems.length}개의 식품을 선택하셨습니다. 글을 작성하시겠어요?</p> 
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={() => handleRegisterButton()}>
          <Icon name='checkmark' /> 등록하기
        </Button>
        <Button color='red' onClick={() => setOpen(false)}>
          <Icon name='remove' /> 취소
        </Button>
      </Modal.Actions>
    </Modal>
    <br/>

      


      

      
      

      {/* <div>
        <p>선택한 음식들:</p>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item.desckor} / {item.nutrcont1} kcal
            </li>
          ))}
        </ul>
        <p>총 칼로리: {totalCalories} kcal</p>
      </div> */}
    </div>
  )
}

export default MeallistUpdate;