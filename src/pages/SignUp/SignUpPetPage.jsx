import React, { useState, useRef } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPetPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      petName: '',
      petAge: '',
      petBreed: '',
      petNeutered: '',
      petGender: '',
      petImage: null
    });

    const [profilePreview, setProfilePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setFormData(prevState => ({
            ...prevState,
            petImage: file
          }));
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically validate the form data
        try {
          const formDataToSend = new FormData();
          Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
          });
    
          const response = await axios.post('http://localhost:8000/sign-up/pets', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          navigate('/sign-up-complete'); // Navigate to completion page
        } catch (error) {
          alert('반려견 정보 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <StyledContainer>
            <StyledForm onSubmit={handleSubmit}>
                <Title>반려견의 정보를 알려주세요</Title>

                <InputGroup>
                    <ProfileImageWrapper>
                        {profilePreview ? (
                            <ProfileImage src={profilePreview} alt="Pet Preview" />
                        ) : (
                            <DefaultProfileImage>반려견 이미지</DefaultProfileImage>
                        )}
                    </ProfileImageWrapper>
                    <HiddenFileInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    <FileUploadButton type="button" onClick={handleFileButtonClick}>
                        {formData.petImage ? '이미지 변경' : '이미지 선택'}
                    </FileUploadButton>
                </InputGroup>

                <InputGroup>
                    <StyledInput
                        type="text"
                        name="petName"
                        placeholder="댕댕이 이름"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>

                <InputGroup>
                    <StyledInput
                        type="number"
                        name="petAge"
                        placeholder="댕댕이 나이"
                        value={formData.petAge}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>

                <InputGroup>
                    <StyledInput
                        type="text"
                        name="petBreed"
                        placeholder="댕댕이 품종"
                        value={formData.petBreed}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>

                <RadioGroup>
                    <RadioLabel>댕댕이 중성화 여부</RadioLabel>
                    <RadioButtonGroup>
                        <RadioButtonWrapper>
                            <RadioButton
                                type="radio"
                                name="petNeutered"
                                value="true"
                                checked={formData.petNeutered === 'true'}
                                onChange={handleChange}
                            />
                            <RadioButtonLabel>했어요</RadioButtonLabel>
                        </RadioButtonWrapper>
                        <RadioButtonWrapper>
                            <RadioButton
                                type="radio"
                                name="petNeutered"
                                value="false"
                                checked={formData.petNeutered === 'false'}
                                onChange={handleChange}
                            />
                            <RadioButtonLabel>안 했어요</RadioButtonLabel>
                        </RadioButtonWrapper>
                    </RadioButtonGroup>
                </RadioGroup>

                <RadioGroup>
                    <RadioLabel>강아지 성별</RadioLabel>
                    <RadioButtonGroup>
                        <RadioButtonWrapper>
                            <RadioButton
                                type="radio"
                                name="petGender"
                                value="male"
                                checked={formData.petGender === 'male'}
                                onChange={handleChange}
                            />
                            <RadioButtonLabel>남</RadioButtonLabel>
                        </RadioButtonWrapper>
                        <RadioButtonWrapper>
                            <RadioButton
                                type="radio"
                                name="petGender"
                                value="female"
                                checked={formData.petGender === 'female'}
                                onChange={handleChange}
                            />
                            <RadioButtonLabel>여</RadioButtonLabel>
                        </RadioButtonWrapper>
                    </RadioButtonGroup>
                </RadioGroup>

                <SubmitButton type="submit">회원가입 완료</SubmitButton>
            </StyledForm>
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

const ProfileImageWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const ProfileImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultProfileImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileUploadButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  background-color: #4a90e2;
  border-color: #4a90e2;
  &:hover {
    background-color: #357ae8;
    border-color: #357ae8;
  }
`;

const StyledInput = styled(Form.Control)`
  margin-bottom: 5px;
`;

const RadioGroup = styled.div`
  margin-bottom: 20px;
`;

const RadioLabel = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
`;

const RadioButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
`;

const RadioButton = styled(Form.Check.Input)`
  margin-right: 8px;
`;

const RadioButtonLabel = styled.label`
  margin-bottom: 0;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  background-color: #e57373;
  border-color: #e57373;
  &:hover {
    background-color: #ef5350;
    border-color: #ef5350;
  }
`;

export default SignUpPetPage;