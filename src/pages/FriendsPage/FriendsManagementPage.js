import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const FriendsManagementPage = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const memberEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (memberEmail) {
      fetchFriends(1);
      fetchFriendRequests();
    } else {
      console.error('memberEmail이 설정되지 않았습니다.');
    }
  }, [memberEmail]);

  const fetchFriends = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/friends', {
        params: { page, size: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/friends/${memberEmail}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFriendRequests(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleAddFriendClick = () => setShowAddFriend(true);
  const handleFriendEmailChange = (e) => setNewFriendEmail(e.target.value);

  const handleSendRequest = async () => {
    try {
      await axios.post(`http://localhost:8080/friends/${newFriendEmail}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShowAddFriend(false);
      setNewFriendEmail('');
    } catch (error) {
      console.error('친구 요청을 보내는 중 오류가 발생했습니다:', error);
    }
  };

  const handleAcceptRequest = async (friendRequestId) => {
    try {
      await axios.post(`http://localhost:8080/accept/${friendRequestId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchFriendRequests();
    } catch (error) {
      console.error('친구 요청을 수락하는 중 오류가 발생했습니다:', error);
    }
  };

  const handleRejectRequest = async (friendRequestId) => {
    try {
      await axios.delete(`http://localhost:8080/reject/${friendRequestId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      fetchFriendRequests();
    } catch (error) {
      console.error('친구 요청을 거절하는 중 오류가 발생했습니다:', error);
    }
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error.message}</p>;

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>친구 관리</SidebarTitle>
        <ActionButton onClick={handleAddFriendClick}>친구 추가</ActionButton>
        {showAddFriend && (
          <AddFriendForm>
            <FriendEmailInput
              type="email"
              placeholder="친구 이메일을 입력하세요"
              value={newFriendEmail}
              onChange={handleFriendEmailChange}
            />
            <SendRequestButton onClick={handleSendRequest}>요청 보내기</SendRequestButton>
          </AddFriendForm>
        )}
        <RequestList>
          <SidebarTitle>친구 요청 목록</SidebarTitle>
          {friendRequests.map((request) => (
            <RequestItem key={request.id}>
              <RequestInfo>
                <p>{request.friendName} ({request.friendEmail})</p>
                <p>닉네임: {request.friendNickName || '등록되지 않음'}</p>
                <p>전화번호: {request.friendPhone || '등록되지 않음'}</p>
                <p>생일: {request.friendBirth || '등록되지 않음'}</p>
              </RequestInfo>
              <ButtonGroup>
                <AcceptButton onClick={() => handleAcceptRequest(request.id)}>수락</AcceptButton>
                <RejectButton onClick={() => handleRejectRequest(request.id)}>거절</RejectButton>
              </ButtonGroup>
            </RequestItem>
          ))}
        </RequestList>
      </Sidebar>
      <MainContent>
        <Header>내 친구 목록</Header>
        <ContentArea>
          <ContactList>
            {friends.map(friend => (
              <ContactItem key={friend.friendEmail} onClick={() => handleFriendClick(friend)}>
                <FriendButton>
                  <FriendIcon src={friend.pets?.[0]?.petProfileImage || 'https://example.com/path-to-icon.png'} alt="프로필" />
                  <FriendName>{friend.friendName}</FriendName>
                </FriendButton>
              </ContactItem>
            ))}
          </ContactList>
        </ContentArea>
      </MainContent>
      <ProfileContent>
        {selectedFriend ? (
          <FriendProfile>
            <ProfileTitle>{selectedFriend.friendName}의 프로필</ProfileTitle>
            <ProfileDetail>이메일: {selectedFriend.friendEmail}</ProfileDetail>
            <ProfileDetail>닉네임: {selectedFriend.friendNickName || '등록되지 않음'}</ProfileDetail>
            <ProfileDetail>전화번호: {selectedFriend.friendPhone || '등록되지 않음'}</ProfileDetail>
            <ProfileDetail>생일: {selectedFriend.friendBirth || '등록되지 않음'}</ProfileDetail>
          </FriendProfile>
        ) : (
          <EmptyProfile>친구를 선택하면 프로필 정보가 여기에 표시됩니다.</EmptyProfile>
        )}
      </ProfileContent>
    </Container>
  );
};

// 스타일링 코드

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ProfileContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #f9f9f9;
  border-left: 1px solid #e0e0e0;
  min-width: 250px;
  position: relative;
  background-image: url('/path-to-paw-print.png'); /* 발바닥 이미지 경로 */
  background-repeat: no-repeat;
  background-position: bottom right;
  background-size: 100px; /* 이미지 크기 조정 */
`;

const RejectButton = styled.button`
  background-color: #FF6347; /* 거절 버튼 색상: 빨간색 */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #FF4500; /* 거절 버튼 호버 색상 */
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #f7f7f7;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px 15px;
  background-color: #FFD700;
  color: black;
  border: 1px solid #FFD700;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;

  &:hover {
    background-color: #FFC107;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const ContentArea = styled.div`
  background-color: #fff;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 100%;
  overflow-y: auto;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const FriendButton = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #FFD700;
  color: black;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: #FFC107;
  }
`;

const FriendIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const FriendName = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const FriendProfile = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 20px; /* 둥근 모서리 */
  border: 2px solid #FFD700; /* 노란색 테두리 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  text-align: center; /* 텍스트 가운데 정렬 */
  width: 100%; 
  max-width: 400px; /* 최대 너비를 설정하여 프로필이 너무 커지지 않도록 */
  margin: 0 auto; /* 중앙 정렬을 위해 */
`;

const ProfileTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
`;

const ProfileDetail = styled.p`
  font-size: 18px;
  color: #666;
  margin: 10px 0;
`;

const EmptyProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 16px;
`;

const AddFriendForm = styled.div`
  margin-top: 20px;
`;

const FriendEmailInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const SendRequestButton = styled.button`
  width: 100%;
  padding: 10px 15px;
  background-color: #FFD700;
  color: black;
  border: 1px solid #FFD700;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #FFC107;
  }
`;

const RequestList = styled.div`
  margin-top: 20px;
`;

const RequestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
`;

const RequestInfo = styled.div`
  flex-grow: 1;
`;

const AcceptButton = styled.button`
  background-color: #FFD700;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #FFC107;
  }
`;

export default FriendsManagementPage;