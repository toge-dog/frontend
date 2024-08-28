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
      fetchFriendRequests();
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
      fetchFriends();
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
      <ContentWrapper>
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
                    <FriendIcon src={friend.pets?.[0]?.petProfileImage || '../../assets/sibadog.png'} alt="프로필" />
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
      </ContentWrapper>
    </Container>
  );
};

// 스타일링 코드

const Container = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 정렬 */
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  background-color: #FFFFFF;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #FDF5E6;
  padding: 20px;
  border: 2px solid #C47F7F;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
`;

const MainContent = styled.div`
  flex-grow: 1;
  margin-left: 10px;
  padding: 20px;
  background-color: #FDF5E6;
  border: 2px solid #C47F7F;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 상하단이 꽉 차도록 */
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: #8B4513; /* 따뜻한 갈색 */
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px 15px;
  background-color: #DEB887; /* 부드러운 갈색 */
  color: white;
  border: 1px solid #8B4513;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;

  &:hover {
    background-color: #CD853F;
  }
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #8B4513;
`;

const ContentArea = styled.div`
  background-color: #FFF8DC;
  padding: 0;
  border: none;
  height: 100%;
  overflow-y: auto;
  box-shadow: none;
  box-sizing: border-box;
  flex-grow: 1; /* 공간을 채우도록 설정 */
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  flex-grow: 1; /* 공간을 채우도록 설정 */
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #FAEBD7;
  border-radius: 8px;
  border: 1px solid #A52A2A;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  color: #8B4513;
`;

const ProfileContent = styled.div`
  flex-grow: 1;
  margin-left: 10px;
  padding: 20px;
  background-color: #FDF5E6;
  border: 2px solid #C47F7F;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FriendProfile = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 20px; /* 둥근 모서리 */
  border: 3px solid #A52A2A; /* 갈색 테두리 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  text-align: center; /* 텍스트 가운데 정렬 */
  width: 100%; 
  max-width: 400px; /* 최대 너비를 설정하여 프로필이 너무 커지지 않도록 */
  margin: 0 auto; /* 중앙 정렬을 위해 */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin-top: 10px; /* 위쪽에 간격 추가 */
`;

const ProfileTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  color: #8B4513;
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
  background-color: #FAEBD7;
  border-radius: 8px;
  border: 1px solid #A52A2A;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
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

export default FriendsManagementPage;
