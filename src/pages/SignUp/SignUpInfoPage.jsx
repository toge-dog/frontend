import React, { useState } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';

const SignUpInfoPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      memberName: '',
      memberNickname: '',
      memberEmail: '',
      memberPassword: '',
      memberPhone: '',
      memberBirth: '',
      memberMainAddress: '',
      memberDetailsAddress: '',
      memberGender: ''
    });

    const [errors, setErrors] = useState({});
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState('');

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'memberEmail':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = '유효한 이메일 주소를 입력해주세요. 예: abc@gmail.com';
        }
        break;
      case 'memberPassword':
        if (value.length < 8 || value.length > 13) {
          error = '비밀번호는 8글자에서 13글자 사이여야 합니다.';
        }
        break;
      case 'passwordConfirm':
        if (value !== formData.memberPassword) {
            error = '비밀번호가 일치하지 않습니다.';
        }
        break;
      case 'memberPhone':
        if (!/^010-\d{3,4}-\d{4}$/.test(value)) {
            error = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
        }
        break;
      case 'memberBirth':
        if (!/^\d{8}$/.test(value)) {
          error = '생년월일은 8자리 숫자로 입력해주세요. (예: 19990101)';
        }
        break;
      case 'memberMainAddress':
        if (!value) {
          error = '주소를 입력해주세요.';
        }
        break;
      case 'memberGender':
        if (!value) {
          error = '성별을 선택해주세요.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'memberPhone') {
      const phoneNumber = value.replace(/[^\d-]/g, '').slice(0, 13);
      setFormData(prevState => ({ ...prevState, [name]: phoneNumber }));
    } else if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
    
    const error = validateField(name, name === 'passwordConfirm' ? value : formData[name]);
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleAddressComplete = (data) => {
    setFormData(prevState => ({
      ...prevState,
      memberMainAddress: data.address
    }));
    setShowAddressModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
    });

    const passwordConfirmError = validateField('passwordConfirm', passwordConfirm);
    if (passwordConfirmError) {
        newErrors.passwordConfirm = passwordConfirmError;
    }

    if (Object.keys(newErrors).length === 0) {
        try {
            const response = await axios.post('http://localhost:8000/sign-up/members', formData);
            navigate('/sign-up/pets', { state: { memberId: response.data.memberId } });
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    } else {
        setErrors(newErrors);
    }
  };

  return (
    <StyledContainer>
      <StyledForm onSubmit={handleSubmit}>
        <Title>견주님의 정보를 입력주세요</Title>

        <InputGroup>
          <StyledInput
            type="text"
            name="memberName"
            placeholder="이름"
            value={formData.memberName}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberName}
            required
          />
          <ErrorMessage>{errors.memberName}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="text"
            name="memberNickname"
            placeholder="닉네임"
            value={formData.memberNickname}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberNickname}
            required
          />
          <ErrorMessage>{errors.memberNickname}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="email"
            name="memberEmail"
            placeholder="이메일"
            value={formData.memberEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberEmail}
            required
          />
          <ErrorMessage>{errors.memberEmail}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="password"
            name="memberPassword"
            placeholder="비밀번호"
            value={formData.memberPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberPassword}
            required
          />
          <ErrorMessage>{errors.memberPassword}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.passwordConfirm}
            required
          />
          <ErrorMessage>{errors.passwordConfirm}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="tel"
            name="memberPhone"
            placeholder="전화번호 (예: 010-1234-5678)"
            value={formData.memberPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberPhone}
            maxLength={13}
            required
          />
          <ErrorMessage>{errors.memberPhone}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="text"
            name="memberBirth"
            placeholder="생년월일 (예: 19990101)"
            value={formData.memberBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberBirth}
            required
          />
          <ErrorMessage>{errors.memberBirth}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="text"
            name="memberMainAddress"
            placeholder="주소"
            value={formData.memberMainAddress}
            readOnly
            isInvalid={!!errors.memberMainAddress}
            required
          />
          <AddressButton type="button" onClick={() => setShowAddressModal(true)}>
            주소 검색
          </AddressButton>
          <ErrorMessage>{errors.memberMainAddress}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="text"
            name="memberDetailsAddress"
            placeholder="상세 주소"
            value={formData.memberDetailsAddress}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <StyledSelect
            name="memberGender"
            value={formData.memberGender}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.memberGender}
            required
          >
            <option value="">성별 선택</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </StyledSelect>
          <ErrorMessage>{errors.memberGender}</ErrorMessage>
        </InputGroup>

        <NextButton type="submit">다음</NextButton>
      </StyledForm>

      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>주소 검색</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DaumPostcode onComplete={handleAddressComplete} />
        </Modal.Body>
      </Modal>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  max-width: 400px;
  margin-top: 50px;
`;

const StyledForm = styled(Form)`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h4`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
`;

const StyledInput = styled(Form.Control)`
  margin-bottom: 5px;
`;

const StyledSelect = styled(Form.Select)`
  margin-bottom: 5px;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875em;
  min-height: 20px;
`;

const NextButton = styled(Button)`
  width: 100%;
  background-color: #e57373;
  border-color: #e57373;
  &:hover {
    background-color: #ef5350;
    border-color: #ef5350;
  }
`;

const AddressButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
  background-color: #4a90e2;
  border-color: #4a90e2;
  &:hover {
    background-color: #357ae8;
    border-color: #357ae8;
  }
`;

export default SignUpInfoPage;