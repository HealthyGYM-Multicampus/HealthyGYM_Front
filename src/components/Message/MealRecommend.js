// onfocus 

import React, { useState } from 'react';
import { Button, Icon, Modal, Form, TextArea, Input, Card, Grid, Table, Header } from 'semantic-ui-react';
import axios from 'axios';
import "./MealRecommend.css";

function MealRecommend(props) {
  const [firstOpen, setFirstOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);
  const [memberseq, setMemberseq] = useState(parseInt(localStorage.getItem("memberseq"), 10));  // 로그인 아이디로 세팅해야함!!!
  const { detail } = props;

  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [showForm3, setShowForm3] = useState(false);

  const [selectedMorning, setSelectedMorning] = useState([]);
  const [selectedLunch, setSelectedLunch] = useState([]);
  const [selectedDinner, setSelectedDinner] = useState([]);

  const [search, setSearch] = useState("");

  const [writemessage, setWriteMessage] = useState("");

  const [pageno, setPageno] = useState(1);

  const [totalCalories, settotalCalories] = useState(0);
  const [totalCarbo, settotalCarbo] = useState(0);
  const [totalprotein, settotalprotein] = useState(0);
  const [totalfat, settotalfat] = useState(0);
  

  const [result, setResult] = useState([]);

  function renderTotal(selectedMorning, selectedLunch, selectedDinner) {
  
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell
            textAlign="left"
            style={{
              fontWeight: "bold",
              fontSize: "10pt",
              color: "#666666",
              marginBottom: "1rem"
            }}
          >
            총 {selectedMorning.length + selectedLunch.length + selectedDinner.length}개
            <br />
            {totalCalories.toFixed(0)}Kcal
            <br />
            탄수화물 {totalCarbo.toFixed(1)}g
            <br />
            단백질 {totalprotein.toFixed(1)}g
            <br />
            지방 {totalfat.toFixed(1)}g
          </Table.HeaderCell>
          <Table.HeaderCell />
          <Table.HeaderCell />
        </Table.Row>
      </Table.Footer>
    );
  }
  


  const handleSearchClick = (meal) => {
    if (meal === '아침') {
      console.log("아침");
      setShowForm(prevState => !prevState);     // 상태 토글
      setShowForm2(false);
      setShowForm3(false);
    } else if (meal === '점심') {
      console.log("점심");
      setShowForm(false);
      setShowForm2(prevState => !prevState);
      setShowForm3(false);
    } else if (meal === '저녁') {
      console.log("저녁");
      setShowForm(false);
      setShowForm2(false);
      setShowForm3(prevState => !prevState);
    }
  }

  const addToSelectedItems = (item, state) => {
    settotalCalories(totalCalories + parseFloat(item.nutrcont1));
    settotalCarbo(totalCarbo + parseFloat(item.nutrcont2));
    settotalprotein(totalprotein + parseFloat(item.nutrcont3));
    settotalfat(totalfat + parseFloat(item.nutrcont4));
  

    if(state === 1) {    // 아침인 경우
      setSelectedMorning([...selectedMorning, item]);
      
    } 
    else if (state === 2) { // 점심인경우
      setSelectedLunch([...selectedLunch, item]);
    }
    else if (state === 3) { // state === 3  저녁인경우
      setSelectedDinner([...selectedDinner, item]);
    }
    
    settotalCalories(totalCalories + parseFloat(item.nutrcont1));
  }


    // Enter 입력시
    const handleKeyDown = (e, state) => {
        if (e.key === "Enter") {
            e.stopPropagation(); // 이 부분을 추가합니다.
            console.log("handle");
            // console.log(e.target.value, state)
            // console.log(e, state);
            console.log("step1");
            setResult([]);
            console.log("step2");
            SearchMealList();
            console.log("step3");
            e.stopPropagation(); // 이벤트 버블링 막기
            return;
        }
    };

    // icon 클릭시
    const searchIconClick = () => {
      setResult([]);
      SearchMealList();
    };

    const removeSelectedItem = (indexToRemove, state) => {
      const selectedItems = state === 1 ? selectedMorning : state === 2 ? selectedLunch : selectedDinner;
      const selectedItem = selectedItems[indexToRemove];
    
      settotalCalories(totalCalories - parseFloat(selectedItem.nutrcont1));
      settotalCarbo(totalCarbo - parseFloat(selectedItem.nutrcont2));
      settotalprotein(totalprotein - parseFloat(selectedItem.nutrcont3));
      settotalfat(totalfat - parseFloat(selectedItem.nutrcont4));
    
      if (state === 1) {
        setSelectedMorning(selectedMorning.filter((_, index) => index !== indexToRemove));
      } else if (state === 2) {
        setSelectedLunch(selectedLunch.filter((_, index) => index !== indexToRemove));
      } else if (state === 3) {
        setSelectedDinner(selectedDinner.filter((_, index) => index !== indexToRemove));
      }
    };
    

    


    // 공공데이터 포털 API / JSON 형태로 받기
    const SearchMealList = () => {
    if (search === undefined || search.trim() === "") {
      alert("검색어를 입력해주세요");
      return Promise.reject("검색어를 입력해주세요"); // Promise.reject를 사용하여 실패한 Promise 객체 반환
    }
  
    // console.log(search);
    // console.log(pageno);
  
    return axios
      .get("http://localhost:3000/FindMealList", { params: { "search": search, "pageNo": pageno } })
      .then(function(resp) {
        console.log(resp);
        console.log(resp.data);
  
        if (resp.data.length === 0) {
          alert("검색결과가 존재하지 않거나 마지막 페이지입니다.");
          return Promise.resolve("ex"); // Promise.resolve를 사용하여 성공한 Promise 객체 반환
        } else {

          setResult(resp.data);
          return Promise.resolve(); // Promise.resolve를 사용하여 성공한 Promise 객체 반환
        }
      })
      .catch(function(err) {
        return Promise.reject(err); // Promise.reject를 사용하여 실패한 Promise 객체 반환
      });
    }

    const MessageSend = () => {

      console.log("MessageSend");
      console.log(memberseq);

      // 메시지 전송 백엔드 작성 
      
      // 그리고 조언하기 버튼 노출되는 부분도 이제 다시 다른사람인경우에만 보여주도록.
      // 그리고 검색리스트 pageno 관리하는 부분 만들어주어야함.
      // 그리고 renderTotal 함수 부분또한 length의 합이 1이상인 경우에만 노출되도록.
      // or 0인경우 선택하지 않았다고 노출, 1이상인경우 그대로 노출.

      setFirstOpen(false);
      setSecondOpen(false);

      axios.post("http://localhost:3000/recommendmealmsgsend", { 
        memberseq: memberseq, // 로그인한 사람
        writemessage: writemessage, // 보내는 메시지
        target: props.detail.memberseq, // 글 작성자
        selectedMorning: selectedMorning, // 아침에 먹어야하는 추천 식단
        selectedLunch: selectedLunch, // 점심 (위와 동일)
        selectedDinner: selectedDinner // 저녁 (위와 동일)
      })
      .then(res => {
          alert(res.data);
      })
      .catch(function(err){
          alert(err);
      });


      
      // navigate로 bbstag11인 게시판으로 이동해야..



    }











  return (
    <div className='recommend-container'>
      {memberseq !== detail.memberseq && (
        <Button positive onClick={() => setFirstOpen(true)}>조언하기</Button>
      )}

      <Modal
        onClose={() => setFirstOpen(false)}
        onOpen={() => setFirstOpen(true)}
        open={firstOpen}
        className='recommend-modal'
      >
        <Modal.Header>"{detail.nickname}" 님에게 식단 추천하기</Modal.Header>
        <Modal.Content scrolling>
            <Form>
                <div style={{textAlign: 'center'}}>
                    {/* 아침 시작 */}
                    <h2>아침 &nbsp;&nbsp; 
                        {/* 1 */}
                        
                    <Button icon onClick={() => handleSearchClick('아침')}>
                       <Icon name={showForm ? 'minus' : 'plus'} />
                    </Button>
                    </h2>   

                    {/* 아침식단인 경우 */}
                    {showForm && (    
                        
                    <Grid columns={2}>
                    <Grid.Column width={6}>
                    
                    <Card fluid>
                      <Card.Content>
                        <Card.Header>아침 식단</Card.Header>
                        <Card.Description>
                          <Input
                            action={{ icon: 'search', onClick: () => searchIconClick() }}
                            placeholder="Search..."
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 1)}

                            
                          />
                        </Card.Description>
                        <br/><br/>
                        <Table color="green" selectable>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell textAlign='center'>상품명</Table.HeaderCell>
                              <Table.HeaderCell textAlign='center'>제조사</Table.HeaderCell>
                              <Table.HeaderCell textAlign='center'></Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {selectedMorning.map((item, index) => (
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

                    <Grid.Column width={10}>
                      <Card fluid>
                        <Card.Content>
                          <Card.Header>검색 결과</Card.Header>
                          <div className="card-wrapper d-flex flex-wrap justify-content-center">
                            {result.map((item, index) => (
                              <div className="card m-2 card-hover" style={{ width: "200px" }} key={index} onClick={() => addToSelectedItems(item, 1)}>
                                <div className="card-body">
                                <h5 className="card-title">{item.desckor}<p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{(item.animalplant.trim() === "") ? "N/A" : item.animalplant}</p></h5>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{item.nutrcont1} kcal ({item.servingwt}g)</p>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>탄수화물: {item.nutrcont2}g</p>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>단백질: {item.nutrcont3}</p>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>지방: {item.nutrcont4}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                    </Grid>
                        
                    )}  
                    {/* 아침 식단 추가의 끝 */}

                    <hr></hr>


                    {/* 점심 */}
                    <h2>점심 &nbsp;&nbsp; 
                        {/* 2 */}
                        
                    <Button icon onClick={() => handleSearchClick('점심')}>
                       <Icon name={showForm2 ? 'minus' : 'plus'} />
                    </Button>
                    </h2>

                    {/* 점심식단인 경우 */}
                    {showForm2 && (    
                        
                    <Grid columns={2}>
                    <Grid.Column width={6}>
                    
                    <Card fluid>
                      <Card.Content>
                        <Card.Header>점심 식단</Card.Header>
                        <Card.Description>
                          <Input
                            action={{ icon: 'search', onClick: () => searchIconClick() }}
                            placeholder="Search..."
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 2)}

                            
                          />
                        </Card.Description>
                        <br/><br/>
                        <Table color="green" selectable>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell textAlign='center'>상품명</Table.HeaderCell>
                              <Table.HeaderCell textAlign='center'>제조사</Table.HeaderCell>
                              <Table.HeaderCell textAlign='center'></Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {selectedLunch.map((item, index) => (
                              <Table.Row key={index}>
                                <Table.Cell>{item.desckor}</Table.Cell>
                                <Table.Cell>{item.animalplant.trim() === "" ? "N/A" : item.animalplant}</Table.Cell>
                                <Table.Cell>
                                  <Button icon onClick={() => removeSelectedItem(index, 2)} size='mini' circular>
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

                    <Grid.Column width={10}>
                      <Card fluid>
                        <Card.Content>
                          <Card.Header>검색 결과</Card.Header>
                          <div className="card-wrapper d-flex flex-wrap justify-content-center">
                            {result.map((item, index) => (
                              <div className="card m-2 card-hover" style={{ width: "200px" }} key={index} onClick={() => addToSelectedItems(item, 2)}>
                                <div className="card-body">
                                <h5 className="card-title">{item.desckor}<p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{(item.animalplant.trim() === "") ? "N/A" : item.animalplant}</p></h5>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{item.nutrcont1} kcal ({item.servingwt}g)</p>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>탄수화물: {item.nutrcont2}g</p>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>단백질: {item.nutrcont3}</p>
                                  <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>지방: {item.nutrcont4}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                    </Grid>
                        
                    )}     
                    {/* 점심 식단의 끝 */}


                    <hr/>

                    {/* 저녁 */}
                    <h2>저녁 &nbsp;&nbsp; 
                        {/* 3 */}
                        
                    <Button icon onClick={() => handleSearchClick('저녁')}>
                       <Icon name={showForm3 ? 'minus' : 'plus'} />
                    </Button>
                    </h2>

                    {/* 저녁식단인 경우 */}
                    {showForm3 && (    
                        
                        <Grid columns={2}>
                        <Grid.Column width={6}>
                        
                        <Card fluid>
                          <Card.Content>
                            <Card.Header>저녁 식단</Card.Header>
                            <Card.Description>
                              <Input
                                action={{ icon: 'search', onClick: () => searchIconClick() }}
                                placeholder="Search..."
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 3)}
    
                                
                              />
                            </Card.Description>
                            <br/><br/>
                            <Table color="green" selectable>
                              <Table.Header>
                                <Table.Row>
                                  <Table.HeaderCell textAlign='center'>상품명</Table.HeaderCell>
                                  <Table.HeaderCell textAlign='center'>제조사</Table.HeaderCell>
                                  <Table.HeaderCell textAlign='center'></Table.HeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {selectedDinner.map((item, index) => (
                                  <Table.Row key={index}>
                                    <Table.Cell>{item.desckor}</Table.Cell>
                                    <Table.Cell>{item.animalplant.trim() === "" ? "N/A" : item.animalplant}</Table.Cell>
                                    <Table.Cell>
                                      <Button icon onClick={() => removeSelectedItem(index, 3)} size='mini' circular>
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
    
                        <Grid.Column width={10}>
                          <Card fluid>
                            <Card.Content>
                              <Card.Header>검색 결과</Card.Header>
                              <div className="card-wrapper d-flex flex-wrap justify-content-center">
                                {result.map((item, index) => (
                                  <div className="card m-2 card-hover" style={{ width: "200px" }} key={index} onClick={() => addToSelectedItems(item, 3)}>
                                    <div className="card-body">
                                    <h5 className="card-title">{item.desckor}<p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{(item.animalplant.trim() === "") ? "N/A" : item.animalplant}</p></h5>
                                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>{item.nutrcont1} kcal ({item.servingwt}g)</p>
                                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>탄수화물: {item.nutrcont2}g</p>
                                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>단백질: {item.nutrcont3}</p>
                                      <p className="card-text" style={{ fontSize: "12px", color: "grey" }}>지방: {item.nutrcont4}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                        </Grid>
                            
                        )}     

                        <hr/>

                            

                                  

                    



                    <br/><br/><br/>
                    
                    <Table color="green" selectable>
                      {/* 아침 */}
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell colSpan={3} textAlign='center' style={{fontWeight: 'bold', fontSize: '15pt'}}>아침</Table.HeaderCell>
                      </Table.Row>
                      <Table.Row>
                        <Table.HeaderCell textAlign='center'>상품명</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>제조사</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {selectedMorning.map((item, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign='center'>{item.desckor}</Table.Cell>
                          <Table.Cell textAlign='center'>{item.animalplant.trim() === "" ? "N/A" : item.animalplant}</Table.Cell>
                          <Table.Cell textAlign='center'>
                            <Button icon onClick={() => removeSelectedItem(index, 1)} size='mini' circular>
                              <Icon color='red' name='close' />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>

                    {/* 점심 */}
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan={3} textAlign='center' style={{fontWeight: 'bold', fontSize: '15pt'}}>점심</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {selectedLunch.map((item, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign='center'>{item.desckor}</Table.Cell>
                          <Table.Cell textAlign='center'>{item.animalplant.trim() === "" ? "N/A" : item.animalplant}</Table.Cell>
                          <Table.Cell textAlign='center'>
                            <Button icon onClick={() => removeSelectedItem(index, 2)} size='mini' circular>
                              <Icon color='red' name='close' />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>

                    {/* 저녁 */}
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan={3} textAlign='center' style={{fontWeight: 'bold', fontSize: '15pt'}}>저녁</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header> 
                    <Table.Body>
                      {selectedDinner.map((item, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign='center'>{item.desckor}</Table.Cell>
                          <Table.Cell textAlign='center'>{item.animalplant.trim() === "" ? "N/A" : item.animalplant}</Table.Cell>
                          <Table.Cell textAlign='center'>
                            <Button icon onClick={() => removeSelectedItem(index, 3)} size='mini' circular>
                              <Icon color='red' name='close' />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>

                        {renderTotal(selectedMorning, selectedLunch, selectedDinner)}

                  </Table>

                      

                    <br/><br/><br/>

                    


                    <TextArea placeholder='조언하고싶은 문장을 적어주세요.' style={{ minHeight: 50 }} onChange={(e) => setWriteMessage(e.target.value)} rows={5}/>
                </div>
            </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setSecondOpen(true)} primary>
            쪽지 전송하기! <Icon name='right chevron' />
          </Button>
        </Modal.Actions>

        <Modal
          onClose={() => setSecondOpen(false)}
          open={secondOpen}
          size='small'
          className='recommend-modal2'
        >
          <Header icon='archive' content='확인요청!' />
          <Modal.Content>
            <p>전송하시겠어요??</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon='check'
              color='green'
              content='전송'
              onClick={() => MessageSend()}
            />
            <Button
              icon='cancel'
              content='취소'
              onClick={() => setSecondOpen(false)}
            />
          </Modal.Actions>
        </Modal>
      </Modal>
    </div>
  );
}

export default MealRecommend;
