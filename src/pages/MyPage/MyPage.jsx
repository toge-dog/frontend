import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';

// 로컬 스토리지에서 사용자 데이터 가져오기
const fetchUserData = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

function MyPage() {
  const [selectedTab, setSelectedTab] = useState('info'); // 초기 탭은 'info'

  // 사용자 데이터 쿼리
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    staleTime: Infinity,
  });

  // 로딩 및 에러 처리
  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <div>Error loading data</div>;

  // 사용자 정보와 펫 정보
  const { name, image, phone, email, nickName, gender, pets } = user;

  return (
    <Container style={{ maxWidth: '600px', marginTop: '50px' }}>
      <h2 style={{ textAlign: 'center', color: '#ff6b6b', marginBottom: '30px' }}>마이 페이지</h2>
      
      <Row className="mb-4" style={{ backgroundColor: '#f7f7f7', borderRadius: '25px', padding: '10px' }}>
        <Col>
          <Button
            variant={selectedTab === 'info' ? 'success' : 'light'}
            style={{
              width: '100%',
              borderRadius: '25px',
              padding: '10px',
              fontWeight: selectedTab === 'info' ? 'bold' : 'normal'
            }}
            onClick={() => setSelectedTab('info')}
          >
            <i className="bi bi-person-circle"></i> 회원정보
          </Button>
        </Col>
        <Col>
          <Button
            variant={selectedTab === 'card' ? 'success' : 'light'}
            style={{
              width: '100%',
              borderRadius: '25px',
              padding: '10px',
              fontWeight: selectedTab === 'card' ? 'bold' : 'normal'
            }}
            onClick={() => setSelectedTab('card')}
          >
            <i className="bi bi-card-heading"></i> 댕댕카드
          </Button>
        </Col>
        <Col>
          <Button
            variant={selectedTab === 'password' ? 'success' : 'light'}
            style={{
              width: '100%',
              borderRadius: '25px',
              padding: '10px',
              fontWeight: selectedTab === 'password' ? 'bold' : 'normal'
            }}
            onClick={() => setSelectedTab('password')}
          >
            <i className="bi bi-lock-fill"></i> 비밀번호 수정
          </Button>
        </Col>
      </Row>

      {selectedTab === 'info' && (
        <Form>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control type="email" value={email || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Group>

          <Form.Group controlId="phone" className="mb-3">
            <Form.Label>회원 전화번호</Form.Label>
            <Form.Control type="text" value={phone || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Group>

          <Form.Group controlId="nickName" className="mb-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control type="text" value={nickName || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Group>

          <Form.Group controlId="gender" className="mb-3">
            <Form.Label>성별</Form.Label>
            <Form.Control type="text" value={gender || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Group>
        </Form>
      )}

      {selectedTab === 'card' && (
        <CardEditForm pets={pets} image={image} />
      )}
    </Container>
  );
}

function CardEditForm({ pets , image}) {
  const pet = pets[0]; // 예시로 첫 번째 반려동물의 정보를 사용

  if (!pet) return <div>No pet data available</div>;

  return (
    <div>
      <h5 style={{ color: '#4caf50', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>나의 댕댕카드 1</h5>
      
      <Card style={{ backgroundColor: '#f0fff0', borderRadius: '15px', padding: '15px', marginBottom: '30px' }}>
        <Row>
          <Col xs={3}>
            <img src={pet.petProfileImage || 'https://via.placeholder.com/80'} alt="댕댕이 사진" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
          </Col>
          <Col xs={9}>
            <p style={{ margin: 0 }}>이름 : {pet.petName}</p>
            <p style={{ margin: 0 }}>성별 : {pet.petGender}</p>
            <p style={{ margin: 0 }}>나이 : {pet.petBirth}</p>
            <p style={{ margin: 0 }}>품종 : {pet.petBreed}</p>
            <p style={{ margin: 0 }}>사이즈 : {pet.petSize}</p>
            <p style={{ margin: 0 }}>성격 : {pet.petPersonality}</p>
            <p style={{ margin: 0 }}>중성화 여부 : {pet.petNeutered ? 'O' : 'X'}</p>
          </Col>
        </Row>
      </Card>
      
      <Form>
        <Form.Group controlId="dogName" className="mb-3">
          <Form.Label>댕댕이 이름</Form.Label>
          <Form.Control type="text" value={pet.petName || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
        </Form.Group>

        <Form.Group controlId="dogAge" className="mb-3">
          <Form.Label>댕댕 나이</Form.Label>
          <Form.Control type="text" value={pet.petBirth || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
        </Form.Group>

        <Form.Group controlId="dogBreed" className="mb-3">
          <Form.Label>댕댕이 품종</Form.Label>
          <Form.Control type="text" value={pet.petBreed || ''} disabled style={{ backgroundColor: '#f5f5f5' }} />
        </Form.Group>

        <Form.Group controlId="dogNeutered" className="mb-3">
          <Form.Label>댕댕 중성화 여부</Form.Label>
          <div>
            <Form.Check
              type="radio"
              inline
              label="했어요"
              name="neuteredOptions"
              id="neuteredYes"
              checked={pet.petNeutered}
              disabled
            />
            <Form.Check
              type="radio"
              inline
              label="안 했어요"
              name="neuteredOptions"
              id="neuteredNo"
              checked={!pet.petNeutered}
              disabled
            />
          </div>
        </Form.Group>

        <Form.Group controlId="dogGender" className="mb-3">
          <Form.Label>강아지 성별</Form.Label>
          <div>
            <Form.Check
              type="radio"
              inline
              label="여"
              name="genderOptions"
              id="genderFemale"
              checked={pet.petGender === 'F'}
              disabled
            />
            <Form.Check
              type="radio"
              inline
              label="남"
              name="genderOptions"
              id="genderMale"
              checked={pet.petGender === 'M'}
              disabled
            />
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default MyPage;
