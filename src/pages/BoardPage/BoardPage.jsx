import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { Container, Title, Table, Th, Td, WriteButton, GridContainer, GridItem, ImageContainer, AuthorName, Pagination, PageButton, ContentContainer } from './BoardStyles';

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn, getToken } = useAuth();
  const { boardType } = useParams();
  const location = useLocation();

  const postsPerPage = boardType === 'boast' ? 6 : 10;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newPost = searchParams.get('newPost');
    const postId = searchParams.get('postId');
  
    if (newPost === 'true' && postId) {
      setCurrentPage(1);
      fetchPosts(1);
      navigate(`/boards/${boardType}`, { replace: true });
    } else {
      fetchPosts(currentPage);
    }
  }, [boardType, location.search]);

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/boards', {
        params: {
          type: boardType,
          page: page,
          size: postsPerPage,
        },
      });

      const formattedPosts = response.data.data.map((post) => ({
        ...post,
        author: post.author || '익명',
        viewCount: post.viewCount ?? 0,
        likesCount: post.likesCount ?? 0,
        boardStatus: post.boardStatus || '기본 상태',
        content: post.content || '',
        title: post.title || '(제목 없음)',
        boardType: post.boardType || '알 수 없음',
      }));

      setPosts(formattedPosts);
      setTotalPages(response.data.pageInfo?.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getBoardTitle = () => {
    switch(boardType) {
      case 'review': return '매칭 후기';
      case 'boast': return '자랑';
      case 'announcement': return '공지사항';
      case 'inquiry': return '신고/문의';
      default: return '게시판';
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/member', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 보냈지만 상태 코드가 2xx 범위가 아닌 경우
        console.error('서버 응답 오류:', error.response.status);
      } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못한 경우
        console.error('서버로부터 응답이 없습니다:', error.request);
      } else {
        // 요청 설정 중에 오류가 발생한 경우
        console.error('요청 설정 중 오류:', error.message);
      }
      return null;
    }
  };

  const { data: userInfo, isPending: userInfoLoading, isError: userInfoError } = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
  });

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate(`/boards/${boardType}/write`);
    } else {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login', { state: { from: `/boards/${boardType}` } });
    }
  };

  console.log(posts);

  const renderBoastBoard = () => (
    <GridContainer>
      {posts.map((post) => (
        <GridItem key={post.boardId} onClick={() => navigate(`/boards/${boardType}/${post.boardId}`)}>
          <ImageContainer>
            <img src={post.contentImg || '/placeholder-image.jpg'} alt={post.title || '이미지'} />
          </ImageContainer>
          <AuthorName>{post.author || '익명'}</AuthorName>
        </GridItem>
      ))}
    </GridContainer>
  );

  const renderOtherBoard = () => (
    <Table>
      <thead>
        <tr>
          <Th width="10%">번호</Th>
          <Th width="40%">제목</Th> 
          <Th width="15%">작성자</Th> 
          <Th width="10%">조회수</Th> 
          <Th width="10%">좋아요</Th> 
          {/* <Th width="15%">상태</Th>  */}
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={post.boardId} onClick={() => navigate(`/boards/${boardType}/${post.boardId}`)}>
            <Td width="10%">{index + 1}</Td>
            <Td width="40%">{post.title || '(제목 없음)'}</Td>
            <Td width="15%">{post.author || '익명'}</Td>
            <Td width="10%">{post.viewCount ?? 0}</Td>
            <Td width="10%">{post.likesCount ?? 0}</Td>
            {/* <Td width="15%">{post.boardStatus || '기본 상태'}</Td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderPagination = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 5);
    
    if (endPage - startPage < 5 && startPage > 1) {
      startPage = Math.max(1, endPage - 5);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination>
        <PageButton onClick={() => fetchPosts(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
          이전
        </PageButton>
        {pageNumbers.map(number => (
          <PageButton key={number} onClick={() => fetchPosts(number)} active={currentPage === number}>
            {number}
          </PageButton>
        ))}
        <PageButton onClick={() => fetchPosts(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
          다음
        </PageButton>
      </Pagination>
    );
  };

  return (
    <Container>
      <Title>{getBoardTitle()}</Title>
      <ContentContainer>
        {loading ? (
          <p>게시글을 불러오는 중입니다.</p>
        ) : posts.length > 0 ? (
          boardType === 'boast' ? renderBoastBoard() : renderOtherBoard()
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </ContentContainer>
      {posts.length > 0 && renderPagination()}
      {(boardType !== 'announcement' || (boardType === 'announcement')) && (
        <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
      )}
    </Container>
  );
};

export default BoardPage;