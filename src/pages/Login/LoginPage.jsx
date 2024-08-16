import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <StyledContainer>
      <StyledForm onSubmit={handleSubmit}>
        <Title>로그인</Title>
        <p style={{textAlign: 'center', marginBottom: '30px'}}>함께걷개 방문을 환영합니다!</p>
        <StyledInput 
          type="text" 
          placeholder="아이디" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledInput 
          type="password" 
          placeholder="비밀번호" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <StyledButton type="submit">
          로그인
        </StyledButton>
        <LinkContainer>
          <StyledLink to="/members/find-id">아이디찾기</StyledLink>
          <StyledLink to="/members/find-pw">비밀번호찾기</StyledLink>
          <StyledLink to="/signup">회원가입</StyledLink>
        </LinkContainer>
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

const Title = styled.h2`
  color: #e57373;
  text-align: center;
  margin-bottom: 30px;
`;

const StyledInput = styled(Form.Control)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  background-color: #e57373;
  border-color: #e57373;
  &:hover {
    background-color: #ef5350;
    border-color: #ef5350;
  }
`;

const StyledLink = styled(Link)`
  color: #757575;
  text-decoration: none;
  font-size: 0.9em;
  &:hover {
    text-decoration: underline;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export default LoginPage;