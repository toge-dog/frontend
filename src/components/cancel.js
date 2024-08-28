import React from 'react';
import './Modal.css'; // 모달 스타일

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>매칭을 취소하시겠습니까?</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
