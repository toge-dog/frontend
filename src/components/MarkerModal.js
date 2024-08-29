import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const MarkerModal = ({ show, onClose, markerData }) => {
  const [matchStatus, setMatchStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMatchStatus = async () => {
      if (markerData) {
        const match_Id = markerData.data.matchingId;
        try {
          const response = await axios.get(`http://localhost:8080/matchings/stand-by/${match_Id}`);
          if (response.status === 200) {
            setMatchStatus('MatchRegistered');
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setMatchStatus('MatchNotRegistered');
          } else {
            console.error('알 수 없는 오류입니다.', error);
            setMatchStatus('error');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    if (show) {
      setLoading(true);
      checkMatchStatus();
    }
  }, [show, markerData]);

  const handleMatchRequest = async () => {
    const userConfirmed = window.confirm('매칭 신청하시겠습니까?');
    if (userConfirmed) {
      try {
        const match_Id = markerData.data.matchingId;
        await axios.post(`http://localhost:8080/matchings/stand-by/${match_Id}`);
        alert('매칭 신청 완료!');
        onClose();
      } catch (error) {
        console.error('매칭 신청 실패:', error);
        alert('매칭 신청에 실패했습니다.');
      }
    }
  };

  const getButtonText = () => {
    if (loading) {
      return '로딩 중...';
    }
    if (matchStatus === 'MatchRegistered') {
      return '이미 신청된 매칭입니다';
    }
    return '매칭 신청하기';
  };

  const isButtonDisabled = loading || matchStatus === 'MatchRegistered';

  // 인라인 스타일
  const modalContentStyle = {
    borderRadius: '20px',
    backgroundColor: '#fffaf0',
    border: 'none',
    padding: '20px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    fontFamily: "'Ghibli', sans-serif",
    position: 'relative',
  };

  const modalTitleStyle = {
    textAlign: 'center',
  };

  const petIdCardStyle = {
    border: '3px solid #6b4226',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #ffe8d6 0%, #fff 100%), url(https://png.pngtree.com/png-vector/20220708/ourmid/pngtree-illustration-of-a-dogs-paw-print-stamp-for-a-new-year-greeting-card-vector-png-image_32570518.png) no-repeat center center',
    backgroundSize: 'cover',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const sparkleAnimation = {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.3)',
    mixBlendMode: 'screen',
    pointerEvents: 'none',
    animation: 'sparkle 1.5s infinite',
  };

  const holoAnimation = {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(255,255,255,0.2) 100%)',
    opacity: '0.3',
    transform: 'rotate(-30deg)',
    pointerEvents: 'none',
    animation: 'holoAnim 3s infinite linear',
  };

  const petIdCardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const petIdCardHeaderStyle = {
    textAlign: 'center',
  };

  const petNameStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0',
  };

  const certificationStampStyle = {
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    transform: 'rotate(-15deg)',
    width: '100px',
    height: '100px',
    backgroundColor: 'transparent',
  };

  const certificationStampImgStyle = {
    width: '100%',
    height: 'auto',
    opacity: '0.7',
  };

  const buttonStyle = {
    backgroundColor: '#f7a8a8',
    border: 'none',
    borderRadius: '30px',
    padding: '12px 25px',
    fontSize: '1.2rem',
    color: 'white',
    fontFamily: "'Ghibli', sans-serif",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff7f7f',
    transform: 'scale(1.05)',
  };

  return (
    <Modal show={show} onHide={onClose} className="custom-modal" dialogClassName="modal-dialog-centered">
      <Modal.Header closeButton style={modalTitleStyle}>
        <Modal.Title>매칭할래멍</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalContentStyle}>
        {markerData ? (
          <>
            {/* 사용자 정보 */}
            <div style={{ border: '1px solid #ddd', borderRadius: '15px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333', marginBottom: '15px', borderBottom: '2px solid #f7a8a8', paddingBottom: '10px' }}>보호자님 정보</h4>
              <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>닉네임:</strong> {markerData.data.memberNickname}</p>
              <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>생년월일:</strong> {markerData.data.memberYearOfBirth}</p>
              <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>성별:</strong> {markerData.data.memberGender}</p>
            </div>

            {/* 펫 ID 카드 */}
            <div style={petIdCardStyle}>
              <div style={sparkleAnimation}></div>
              <div style={holoAnimation}></div>
              <p style={petIdCardTitleStyle}>함께걷개 등록증</p>
              <div style={petIdCardHeaderStyle}>
                <p style={petNameStyle}><strong>{markerData.data.petName}</strong></p>
              </div>
              <div className="d-flex align-items-center pet-id-card-body">
                <div className="pet-profile-container">
                  <img 
                    src={markerData.data.petProfile} 
                    alt={`${markerData.data.petName} 프로필`} 
                    className="pet-profile-img"
                    style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                  />
                </div>
                <div className="pet-info-container">
                  <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>탄생일:</strong> {markerData.data.petYearOfBirth}</p>
                  <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>사이즈:</strong> {markerData.data.petSize}</p>
                  <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>성격:</strong> {markerData.data.petPersonality}</p>
                  <p style={{ fontSize: '1rem', color: '#666', margin: '10px 0' }}><strong>성별:</strong> {markerData.data.petNeutered}</p>
                </div>
              </div>
              <div style={certificationStampStyle}>
                <img src="https://png.pngtree.com/png-vector/20220708/ourmid/pngtree-illustration-of-a-dogs-paw-print-stamp-for-a-new-year-greeting-card-vector-png-image_32570518.png" alt="함께걷개 인증 도장" style={certificationStampImgStyle} />
              </div>
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>정보를 불러오는 중...</p>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          onClick={handleMatchRequest}
          disabled={isButtonDisabled}
          style={isButtonDisabled ? { ...buttonStyle, backgroundColor: '#d3d3d3', boxShadow: 'none' } : buttonStyle}
          onMouseEnter={e => {
            if (!isButtonDisabled) {
              e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
              e.target.style.transform = buttonHoverStyle.transform;
            }
          }}
          onMouseLeave={e => {
            if (!isButtonDisabled) {
              e.target.style.backgroundColor = buttonStyle.backgroundColor;
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {getButtonText()}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MarkerModal;
