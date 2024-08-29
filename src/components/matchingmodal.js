import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';

// 리스트 항목을 나타내는 컴포넌트
function ListItem({ petImg, name, createdAt, status, mode, matchingDone, setMatchingDone, matchingStandById }) {
  const [isClicked, setIsClicked] = useState(false); // 버튼 클릭 상태
  const [isMatched, setIsMatched] = useState(false); // 매칭 성사 상태

  // 버튼 클릭 시 색상을 변경하는 함수 (Host)
  const handleHostButtonClick = async () => {
    const confirmResult = window.confirm('정말로 매칭요청을 수락하시겠습니까?');

    if (confirmResult) {
      try {
        const response = await axios.patch(`http://localhost:8080/matchings/stand-by/${matchingStandById}`, {
          'status': 'STATUS_SUCCESS',
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your_token_here'
          }
        });

        if (response.status === 200) {
          setIsClicked(true);
          setIsMatched(true);
          setMatchingDone(true);
        }
      } catch (error) {
        console.error('Error while patching1:', error);
      }
    }
  };

  // 버튼 클릭 시 색상을 변경하는 함수 (Guest) ㅎㅇ
  const handleGuestButtonClick = async () => {
    const confirmResult = window.confirm('정말로 매칭요청을 취소하시겠습니까?');

    if (confirmResult) {
      try {
        const response = await axios.patch(`http://localhost:8080/matchings/stand-by/${matchingStandById}`, {
          'status': 'STATUS_FAIL',
        });

        if (response.status === 200) {
          setIsClicked(true);
          setIsMatched(true);
        }
      } catch (error) {
        console.error('Error while patching:', error);
      }
    }
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      padding: '12px',
      backgroundColor: '#ffffff',
      marginBottom: '12px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      transition: 'box-shadow 0.3s ease'
    }}>
      <Image
        src={petImg || 'https://via.placeholder.com/80'}
        roundedCircle
        style={{
          border: '2px solid #e0e0e0',
          width: '60px',
          height: '60px',
          marginRight: '12px',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>{createdAt}</div>
      </div>
      <Button
        onClick={mode === 'host' ? handleHostButtonClick : handleGuestButtonClick}
        disabled={matchingDone}
        style={{
          border: 'none',
          backgroundColor: isMatched ? (mode === 'host' ? '#4caf50' : '#9e9e9e') : (matchingDone ? '#9e9e9e' : (mode === 'host' ? '#2196f3' : '#f44336')),
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          cursor: 'pointer',
          marginLeft: '12px',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = mode === 'host' ? '#1976d2' : '#c62828'}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = isMatched ? (mode === 'host' ? '#4caf50' : '#9e9e9e') : (matchingDone ? '#9e9e9e' : (mode === 'host' ? '#2196f3' : '#f44336'));
        }}
      >
        {isMatched ? (mode === 'host' ? '매칭 성사' : '매칭 취소') : (matchingDone ? '매칭 완료' : status)}
      </Button>
    </div>
  );
}

// 메인 모달 컴포넌트
function ExampleModal() {
  const [show, setShow] = useState(false);
  const [matchingHostData, setMatchingHostData] = useState([]);
  const [matchingGuestData, setMatchingGuestData] = useState([]);
  const [matchingDone, setMatchingDone] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      const fetchMatchingHostData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/matchings/stand-by/host?page=1&size=10`);
          setMatchingHostData(response.data.data);
        } catch (error) {
          console.error('Error fetching matching_host data:', error);
        }
      };
      fetchMatchingHostData();
      const fetchMatchingGuestData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/matchings/stand-by/guest?page=1&size=10`);
          setMatchingGuestData(response.data.data);
        } catch (error) {
          console.error('Error fetching matching_guest data:', error);
        }
      };
      fetchMatchingGuestData();
    }
  }, [show]);

  return (
    <>
    <Button
  variant="primary"
  onClick={handleShow}
  style={{
    position: 'relative', /* Ensure position is set */
    backgroundColor: '#FF9800',
    color: '#ffffff',
    border: 'none',
    margin: '-140px auto',
    display: 'block',
    textAlign: 'center',
    padding: '10px 22px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontSize: '16px',
    fontWeight: '600',
    zIndex: 100, 
    transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9A825'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '##FF9800'}
      >
        🐶 매칭 리스트
      </Button>
      <Modal show={show} onHide={handleClose} size="lg" style={{ zIndex: '1050' }} dialogClassName="modal-dialog-centered">
        <Modal.Header closeButton>
          <Modal.Title>🐶매칭 목록🐶</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fafafa', padding: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
          <Row>
            {/* 왼쪽 영역: 보낸 매칭 요청 */}
            <Col xs={12} md={6} style={{
              padding: '0 12px',
              borderRight: '1px solid #e0e0e0',
              height: 'calc(60vh - 60px)',
              overflowY: 'auto'
            }}>
              <h5 style={{ color: '#ff6347', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>보낸 매칭 요청 - [Guest]</h5>
              {matchingGuestData.length > 0 ? (
                matchingGuestData.map((item) => (
                  <ListItem
                    key={item.matchingStandById}
                    petImg={item.partnerPetImage}
                    name={item.partnerNickName}
                    createdAt={item.createdAt}
                    status={item.status}
                    mode="guest"
                    matchingDone={matchingDone}
                    setMatchingDone={setMatchingDone}
                    matchingStandById={item.matchingStandById}
                  />
                ))
              ) : (
                <p style={{ color: '#888', textAlign: 'center' }}>보낸 매칭 요청이 없습니다.</p>
              )}
            </Col>

            {/* 오른쪽 영역: 받은 매칭 요청 */}
            <Col xs={12} md={6} style={{
              padding: '0 12px',
              height: 'calc(60vh - 60px)',
              overflowY: 'auto'
            }}>


              <h5 style={{ color: '#ff6347', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>받은 매칭 요청 - [Host]</h5>
              {matchingHostData.length > 0 ? (
                matchingHostData.map((item) => (
                  <ListItem
                    key={item.matchingStandById}
                    petImg={item.partnerPetImage}
                    name={item.partnerNickName}
                    createdAt={item.createdAt}
                    status={item.status}
                    mode="host"
                    matchingDone={matchingDone}
                    setMatchingDone={setMatchingDone}
                    matchingStandById={item.matchingStandById}
                  />
                ))
              ) : (
                <p style={{ color: '#888', textAlign: 'center' }}>받은 매칭 요청이 없습니다.</p>
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ExampleModal;
