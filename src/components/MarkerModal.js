import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './MarkerModal.css'; // 커스텀 CSS 파일 임포트

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

  return (
    <Modal show={show} onHide={onClose} className="custom-modal" >
      <Modal.Header closeButton>
        <Modal.Title>매칭할래멍</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {markerData ? (
          <>
            {/* 사용자 정보 */}
            <div className="user-info">
              <h4>보호자님 정보</h4>
              <p><strong>닉네임:</strong> {markerData.data.memberNickname}</p>
              <p><strong>생년월일:</strong> {markerData.data.memberYearOfBirth}</p>
              <p><strong>성별:</strong> {markerData.data.memberGender}</p>
            </div>

            {/* 펫 ID 카드 */}
            <div className="pet-id-card">
              <p className="pet-id-card-title">함께걷개 등록증</p>
              <div className="pet-id-card-header">
                <p className="pet-name"><strong>{markerData.data.petName}</strong></p>
              </div>
              <div className="d-flex align-items-center pet-id-card-body">
                <div className="pet-profile-container">
                  <img 
                    src={markerData.data.petProfile} 
                    alt={`${markerData.data.petName} 프로필`} 
                    className="pet-profile-img"
                  />
                </div>
                <div className="pet-info-container">
                  <p><strong>탄생일:</strong> {markerData.data.petYearOfBirth}</p>
                  <p><strong>사이즈:</strong> {markerData.data.petSize}</p>
                  <p><strong>성격:</strong> {markerData.data.petPersonality}</p>
                  <p><strong>성별:</strong> {markerData.data.petNeutered}</p>
                </div>
              </div>
              <div className="certification-stamp">
                <img src="https://png.pngtree.com/png-vector/20220708/ourmid/pngtree-illustration-of-a-dogs-paw-print-stamp-for-a-new-year-greeting-card-vector-png-image_32570518.png" alt="함께걷개 인증 도장" />
              </div>
            </div>
          </>
        ) : (
          <p>정보를 불러오는 중...</p>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button 
          onClick={handleMatchRequest} 
          disabled={isButtonDisabled}
          className="cute-button"
        >
          {getButtonText()}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MarkerModal;
  