import React, { useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import axios from 'axios';

function ListItem({ petImg, name, createdAt, status, matchingDone, setMatchingDone, matchingStandById }) {
  const [isCancelled, setIsCancelled] = useState(false); // 매칭 취소 상태

  // 요청 취소 버튼 클릭 시 처리
  const handleButtonClick = async () => {
    const confirmResult = window.confirm('정말로 매칭 요청을 취소하시겠습니까?');

    if (confirmResult) {
      try {
        const response = await axios.patch(`http://localhost:8080/matchings/stand-by/${matchingStandById}`, {
          'status': 'STATUS_FAIL',
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your_token_here'
          }
        });

        if (response.status === 200) {
          setIsCancelled(true);
          setMatchingDone(true);
        }
      } catch (error) {
        console.error('요청 취소 중 오류 발생:', error);
      }
    }
  };

  // 매칭 성공 시 나머지 요청 취소 처리
  const handleMatchSuccess = async () => {
    try {
      // 매칭 성공을 서버에 알림
      const successResponse = await axios.patch(`http://localhost:8080/matchings/success/${matchingStandById}`, {
        'status': 'STATUS_SUCCESS',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your_token_here'
        }
      });

      if (successResponse.status === 200) {
        setMatchingDone(true);
        
        // 다른 대기 중인 매칭 요청 취소
        await axios.patch(`http://localhost:8080/matchings/cancel-others/${matchingStandById}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your_token_here'
          }
        });
      }
    } catch (error) {
      console.error('매칭 성공 처리 중 오류 발생:', error);
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
        onClick={handleButtonClick}
        disabled={matchingDone}
        style={{
          border: 'none',
          backgroundColor: isCancelled ? '#9e9e9e' : (matchingDone ? '#9e9e9e' : '#f44336'),
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
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c62828'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = isCancelled ? '#9e9e9e' : '#f44336'}
      >
        {isCancelled ? '매칭 취소됨' : '요청 취소'}
      </Button>
      {!isCancelled && !matchingDone && (
        <Button
          onClick={handleMatchSuccess}
          style={{
            marginLeft: '8px',
            border: 'none',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388e3c'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4caf50'}
        >
          매칭 성공
        </Button>
      )}
    </div>
  );
}

export default ListItem;
