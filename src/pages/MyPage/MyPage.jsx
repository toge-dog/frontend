import React from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

// 로컬 스토리지에서 사용자 데이터 가져오기
const fetchUserData = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const MyPage = () => {
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
  const { name, phone, email, nickName, gender, pets } = user;

  return (
    <PageWrapper>
      <ProfileCard>
        <ProfileHeader>회원 정보</ProfileHeader>
        <ProfileDetail><strong>이름:</strong> {name}</ProfileDetail>
        <ProfileDetail><strong>전화번호:</strong> {phone}</ProfileDetail>
        <ProfileDetail><strong>이메일:</strong> {email}</ProfileDetail>
        <ProfileDetail><strong>닉네임:</strong> {nickName}</ProfileDetail>
        <ProfileDetail><strong>성별:</strong> {gender}</ProfileDetail>
      </ProfileCard>

      <PetSection>
        <PetHeader>내 펫 정보</PetHeader>
        {pets && pets.length > 0 ? (
          pets.map((pet, index) => (
            <PetCard key={index}>
              <PetImage src={pet.petProfileImage} alt={pet.petName} />
              <PetInfo>
                <PetName>{pet.petName}</PetName>
                <PetDetail><strong>종류:</strong> {pet.petType}</PetDetail>
                <PetDetail><strong>나이:</strong> {pet.petAge} 세</PetDetail>
              </PetInfo>
            </PetCard>
          ))
        ) : (
          <div>펫 정보가 없습니다.</div>
        )}
      </PetSection>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.h2`
  margin-bottom: 10px;
`;

const ProfileDetail = styled.p`
  margin: 5px 0;
`;

const PetSection = styled.div`
  margin-top: 20px;
`;

const PetHeader = styled.h2`
  margin-bottom: 10px;
`;

const PetCard = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PetImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 10px;
`;

const PetInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h3`
  margin: 0;
`;

const PetDetail = styled.p`
  margin: 5px 0;
`;

export default MyPage;
