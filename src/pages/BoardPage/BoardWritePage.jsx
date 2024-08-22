import React, { useState, useRef } from 'react';
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

const BoardWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { boardType } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`http://localhost:8080/boards`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/boards/${boardType}`);
    } catch (error) {
      console.error('게시글 작성에 실패했습니다:', error);
    }
  };

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