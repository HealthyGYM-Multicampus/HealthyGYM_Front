import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Icon, Label, Modal, Button, Popup, Input, Table, Menu } from 'semantic-ui-react';
import "./Message.css";

function Message(){

  // 시맨틱 ui 설정
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
  document.head.appendChild(styleLink);


    // 스크롤 Ref
    const scrollRef = useRef();

    

    const [memberseq, setMemberseq] = useState(parseInt(localStorage.getItem("memberseq"), 10));  // 로그인 아이디로 세팅해야함!!!
    const [notreadmessage, setNotreadmessage] = useState(0);



    const [talkinglist, setTalkingList] = useState([]); // 대화했던 사람들의 목록들
    const [messages, setMessages] = useState([]); // 선택한 사용자와의 대화기록 저장
    const [recommendmealrecv, setRecommendmealRecv] = useState([]); // 추천받은 음식들 배열로 받기
    const [selectedMessage, setSelectedMessage] = useState(1); // 누구의 대화목록인지 저장.

    const [writemessage, setWriteMessage] = useState(); // 사용자가 보내는 쪽지

    // 모달
    const [firstOpen, setFirstOpen] = React.useState(false)
    const [secondOpen, setSecondOpen] = React.useState(false)



    useEffect(function(){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages])

    useEffect(() => {   // 1회 실행.

        

        const loadMessageCnt = async () => {
            try {
                const res = await axios.post(
                  "http://localhost:3000/getnotreadmsgcnt",
                  null,
                  { params: { memberseq: memberseq } }
                );
                //console.log(res.data);
                console.log(memberseq);
                setNotreadmessage(res.data);
              } catch (error) {
                console.log(error);
              }
        };
        loadMessageCnt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [localStorage.getItem("memberseq")]);

      const talkingList = () => { // 쪽지목록 불러오기
        axios.post("http://localhost:3000/talkingmemberlist", null, {
          params: { memberseq: memberseq },
        })
        .then((res) => {
            console.log(res.data);
            setTalkingList(res.data);
            setFirstOpen(true);
        })
        .catch((error) => {
          console.log(error);
        });
      };




      const loadMessages = (target, memberseq) => {
          axios.post("http://localhost:3000/getmessages", null, {
              params: { target: target, memberseq: memberseq },
            })
            .then((res) => {
              console.log(res.data);
              setMessages(res.data.message);
              setRecommendmealRecv(res.data.fooddto);
              setFirstOpen(true);
            })
            .catch((error) => {
              console.log(error);
            });
      };


      



      const handleRefresh = async () => {
        try {
            const res = axios.post(
              "http://localhost:3000/getnotreadmsgcnt",
              null,
              { params: { memberseq: memberseq } }
            );
            //console.log(res.data);
            setNotreadmessage(res.data);
          } catch (error) {
            console.log(error);
          }
      };
      



      // 쪽지 목록 렌더링
      const renderMessages = () => {
        if (talkinglist.length === 0) {
          return <p>No messages</p>;
        }

        return (
          <div className="message-list-container" ref={scrollRef}> {/* 스타일을 적용하기 위한 컨테이너 */}
            <ul className="message-list">
              {talkinglist.map((tlist) => (
                <li key={tlist.memberseq} onClick={() => handleMessageClick(tlist)} className="message-list-item">
                  {/* 프로필 이미지 */}
                  <img src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${selectedMessage.profile}?alt=media`} />

                  {/* <img src={selectedMessage.profile} alt="Profile" /> */}

                  <div className="message-info-container">
                    <div className="message-info">
                      {/* 대화 목록당 읽지 않은 메시지의 개수 */}
                      {tlist.isreadcnt > 0 && (
                        <div className="unread-messages">
                          <Popup trigger={<Icon size="small" circular name="circle" color="red" />} wide="small" hideOnScroll>
                            <div>읽지 않은 쪽지가 {tlist.isreadcnt}개 있습니다.</div>
                          </Popup>
                          <span className="unread-count">+{tlist.isreadcnt}</span>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                      )}

                      {/* 닉네임 */}
                      <strong className="nickname">{tlist.nickname}</strong>

                      {/* 가장 최근 메시지의 작성일 */}
                      <span className="message-date right">{tlist.wdate}</span>
                    </div>

                    {/* 가장 최근의 메시지 */}
                    <div className="last-message">{tlist.lastletter}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      };


      // 대화목록에서 유저클릭 시
      const handleMessageClick = (memberdto) => {

        setSelectedMessage(memberdto);  // 대화 대상자의 dto 저장.
        // console.log(memberdto);
        loadMessages(memberdto.memberseq, memberseq); // 선택한 사용자의 memberseq(target)와 로그인 사용자의 memberseq전달.
        
        console.log(memberdto.memberseq);
        console.log(memberseq);
        
        // 쪽지 목록 조회시 읽음처리
        axios({
          method: "post",
          url: "http://localhost:3000/readthemessage",
          params: {
            target : memberdto.memberseq,
            memberseq: memberseq
          },
        }).then((res) => {
          //console.log(res);
        });

        setSecondOpen(true);

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      };

      const renderRecommendMeal = (recommendMeal) => {

        // 렌더링용
        const breakfastList = recommendMeal.filter((meal) => meal.whenmeal === 1);
        const lunchList = recommendMeal.filter((meal) => meal.whenmeal === 2);
        const dinnerList = recommendMeal.filter((meal) => meal.whenmeal === 3);


        return (
          
          <div>
              <Table  style={{ tableLayout: "fixed" }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ width: "80px", textAlign: "center"}}>분류</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: "190px", textAlign: "center" }}>식품명</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: "100px", textAlign: "center"}}>1회 제공량</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: "60px", textAlign: "center"}}>Kcal</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

                <Table.Body>

                {breakfastList.length > 0 && (
                  <>
                    <Table.Row>
                      <Table.Cell colSpan="4">
                        <Label ribbon>아침식단</Label>
                      </Table.Cell>
                    </Table.Row>
                    {breakfastList.map((meal, index) => (
                      <Table.Row key={`${meal.recseq}-${index}`}>
                      <Table.Cell>{index}</Table.Cell>
                      <Table.Cell>{meal.desckor}</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.servingwt}g</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.nutrcont1}</Table.Cell>
                      </Table.Row>
                    
                    ))}
                  </>
                )}

                {dinnerList.length > 0 && (
                  <>
                    <Table.Row>
                      <Table.Cell colSpan="4">
                        <Label ribbon>점심식단</Label>
                      </Table.Cell>
                    </Table.Row>
                    {dinnerList.map((meal, index) => (
                      <Table.Row key={`${meal.recseq}-${index}`}>
                      <Table.Cell>{index}</Table.Cell>
                      <Table.Cell>{meal.desckor}</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.servingwt}g</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.nutrcont1}</Table.Cell>
                      </Table.Row>
                    
                    ))}
                  </>
                )}

                  {lunchList.length > 0 && (
                  <>
                    <Table.Row>
                      <Table.Cell colSpan="4">
                        <Label ribbon>저녁식단</Label>
                      </Table.Cell>
                    </Table.Row>
                    {lunchList.map((meal, index) => (
                      <Table.Row key={`${meal.recseq}-${index}`}>
                      <Table.Cell>{index}</Table.Cell>
                      <Table.Cell>{meal.desckor}</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.servingwt}g</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.nutrcont1}</Table.Cell>
                      </Table.Row>
                    
                    ))}
                  </>
                )}


                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell>3 People</Table.HeaderCell>
                    <Table.HeaderCell>2 Approved</Table.HeaderCell>
                    <Table.HeaderCell />
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Footer>
              </Table>

            
          </div>
        );
      };

      const renderModalContent = () => {
        
        return (
          <div>
            {messages.map((message) => (
              <div key={message.msgseq} >
                <div  className="message-container">
                <div className={message.memberseq === memberseq ? 'message-receiver' : 'message-sender'}>
                <p>{message.message}</p>
                </div>
                </div>
                
                {/* 추천해준 식단이 있는경우. */}
                {recommendmealrecv.filter((meal) => meal.msgseq === message.msgseq).length > 0 && (
                  <div className="recommend-meal-container">
                    {renderRecommendMeal(recommendmealrecv.filter((meal) => meal.msgseq === message.msgseq))}
                  </div>
                )}

              </div>
            ))}
          </div>
        );
      };
      
      
      
      
      
      
      
      
      
      // Enter 입력시
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      };

      // 메시지 전송
      const sendMessage = () => {

        axios({
          method: "post",
          url: "http://localhost:3000/sendmessage",
          params: {
            target: selectedMessage.memberseq,
            memberseq: memberseq,
            writemessage: writemessage
          },
        })
          .then((res) => {
            console.log(res);
      
            // 사용자 후처리
      
            // 채팅방에 처리
            const lastMessage = messages[messages.length - 1]; // 이전 메시지 중 마지막 메시지 가져오기
            const newMsgseq = lastMessage ? lastMessage.msgseq + 1 : 1; // 이전 메시지의 msgseq 값에 1을 더한 값
            const newMessage = { msgseq: newMsgseq, memberseq: memberseq, message: writemessage };
      
            setMessages((prevMessages) => [...prevMessages, newMessage]);
      
            // 채팅글 지우기
            setWriteMessage("");
      
            // 스크롤을 최하단으로 이동
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      
            // 가장 마지막대화 처리
          })
          .catch((error) => {
            console.log(error);
          });
      };
      
    
    




      return (
        <div className="message-container">
          <div>
            <Label className="message-label" onClick={talkingList}>
              <Icon name='mail' />
              {notreadmessage > 0 ? (
                <span> <b>{notreadmessage}</b> </span>
              ) : (
                <span style={{ color: 'gray' }}>0</span>
              )}
            </Label>
      
            &nbsp;&nbsp;
      
            <Icon name='sync alternate' onClick={handleRefresh} /> 
          </div>
      
          <Modal
            onClose={() => setFirstOpen(false)}
            onOpen={() => setFirstOpen(true)}
            open={firstOpen}
            className="message-modal"
          >
            <Modal.Header>쪽지 목록</Modal.Header>
            <Modal.Content scrolling>
              {renderMessages()}
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setFirstOpen(false)}>Close</Button>
            </Modal.Actions>
          </Modal>
      
          <Modal
            onClose={() => setSecondOpen(false)}
            onOpen={() => setSecondOpen(true)}
            open={secondOpen}
            className="message-modal2"
            ref={scrollRef}
          >
            <Modal.Header> <img src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${selectedMessage.profile}?alt=media`} /> "{selectedMessage.nickname}" 님과의 쪽지</Modal.Header>
            <Modal.Content scrolling>
              {renderModalContent()}
            </Modal.Content>
            <Modal.Actions>
              {/* 데이터 입력 및 전송 */}
              <Input
                fluid
                placeholder="메시지 입력.."
                type="text"
                value={writemessage || ''}
                onChange={(e) => setWriteMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                size='large'
                action={{
                  color: 'teal',
                  labelPosition: 'left',
                  icon: 'paper plane outline',
                  content: '전송',
                  onClick: sendMessage
                }}
              />
                  <br/>
                
              <Button onClick={() => setSecondOpen(false)}>Close</Button>
            </Modal.Actions>
          </Modal>
        </div>
      );
}      

export default Message;