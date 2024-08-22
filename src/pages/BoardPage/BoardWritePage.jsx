import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Container, 
    Title, 
    Form, 
    Input, 
    TextArea, 
    SubmitButton, 
    ImagePreview, 
    ImageUploadButton,
    ButtonContainer,
    SubmitButtonContainer
} from './BoardStyles';
import { useAuth } from '../../hooks/useAuth';

const BoardWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { boardType } = useParams();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    console.log('Login status:', isLoggedIn);
    console.log('User object:', user);
  }, [isLoggedIn, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data; // Assuming the response contains the image URL
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
      return null;
    }
  };

  let adjustedBoardType;
  switch (boardType) {
    case 'R':
      adjustedBoardType = 'REVIEW';
      break;
    case 'B':
      adjustedBoardType = 'BOAST';
      break;
    case 'I':
      adjustedBoardType = 'INQUIRY';
    default:
      adjustedBoardType = 'ANNOUNCEMENT';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Step 1: Upload the image to S3 and get the image URL
    const contentImg = await handleImageUpload();
  
    // Step 2: Prepare the data object
    const data = {
      title,
      content,
      contentImg,  // Include the image URL if it was uploaded
      boardType: adjustedBoardType,
      memberId: user?.id, // Assuming the user ID is part of the user object
    };
  
    console.log('Payload data:', JSON.stringify(data));
  
    try {
      const response = await axios.post('http://localhost:8080/boards', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response);
      navigate(`/boards/${boardType}`);
    } catch (error) {
      console.error('게시글 작성에 실패했습니다:', error.response ? error.response.data : error.message);
      console.log('전체 에러 객체:', error);
      if (error.response) {
        console.log('서버 응답 데이터:', error.response.data);  // 서버 응답 데이터 출력
      }
    }
  };
  

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Container>
      <Title>{boardType === 'R' ? '매칭 후기 작성' : boardType === 'B' ? '자랑하기' : '게시글 작성'}</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <ButtonContainer>
          <ImageUploadButton type="button" onClick={handleImageUploadClick}>
            이미지 업로드
          </ImageUploadButton>
        </ButtonContainer>
        {imagePreview && (
          <ImagePreview>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </ImagePreview>
        )}
        <SubmitButtonContainer>
          <SubmitButton type="submit">작성완료</SubmitButton>
        </SubmitButtonContainer>
      </Form>
    </Container>
  );
};

export default BoardWritePage;
