import React, { useEffect, useState } from 'react'
import axios from '../../utils/CustomAxios';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'semantic-ui-react'
import { useReducer } from 'react';

export default function BbsDropdown(props) {
    const [memberseq, setMemberseq] = useState(0);
    const [isWriter, setIsWriter] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        const s = localStorage.getItem("memberseq");
        if(s !== null) setMemberseq(s);
        if(s == props.memberseq) setIsWriter(true);
    });
    // 게시글 수정
    const handleUpdateClick = async () => {
        window.location.href = `http://localhost:9100/community/update/${props.bbsseq}`;
    };
    // 게시글 삭제
    const handleDeleteClick = async () => {
        // 삭제 확인 모달창
        dispatch({ type: 'close' });
        
        await axios.post(`http://localhost:3000/deletebbs?bbsseq=${props.bbsseq}`)
        .then((res) => {
            if(res.data === "OK") {
                alert("글이 삭제되었습니다.");
                navigate(-1);
            }
        })
        .catch((error) => {
            alert(error);
        });
    };
    // 게시글 신고
    const handleReportClick = async () => {
        await axios.post('http://localhost:3000/updatebbs', null, { params:{"bbsseq":props.bbsseq, "memberseq":memberseq} })
        .then((res) => {
            if(res.data) {

            }
        })
        .catch((error) => {
            alert(error);
        });
    };
    const [state, dispatch] = useReducer(exampleReducer, {
        open: false,
        dimmer: undefined,
    });
    const { open, dimmer } = state;
    function exampleReducer(state, action) {
    switch (action.type) {
        case 'close':
        return { open: false }
        case 'open':
        return { open: true, dimmer: action.dimmer }
        default:
        throw new Error('Unsupported action...')
    }
    }
    return (
        <>
        <Dropdown text="글 관리"  style={{ float:'right'}}>
          <Dropdown.Menu>
            {isWriter &&
            <>
                <Dropdown.Item text="수정" onClick={handleUpdateClick} />
                <Dropdown.Item text="삭제" onClick={() => dispatch({ type: 'open', size: 'mini' })} />
            </>
            }
            <Dropdown.Item text="신고" onClick={handleReportClick} />
          </Dropdown.Menu>
        </Dropdown>

            <Modal
                size="mini"
                open={open}
                dimmer={dimmer}
                onClose={() => dispatch({ type: 'close' })}
            >
                <Modal.Content>
                    <p>게시글을 삭제하시겠습니까?</p>
                </Modal.Content>
                <Modal.Actions>
                <Button negative onClick={() => dispatch({ type: 'close' })}>
                    취소
                </Button>
                <Button positive onClick={() => handleDeleteClick()}>
                    확인
                </Button>
                </Modal.Actions>
            </Modal>
        </>
      );
}