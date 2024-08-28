import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import {
  Container,
  Title,
  Table,
  Th,
  Td,
  WriteButton,
  Pagination,
  PageButton,
  ContentContainer,
  SearchContainer,
  SearchInput,
  SearchButton,
  FilterSelect
} from './BoardStyles';

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn, getToken } = useAuth();
  const { boardType } = useParams();
  const location = useLocation();

  const postsPerPage = 10;

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
    switch (boardType) {
      case 'review': return '매칭 후기';
      case 'boast': return '자랑';
      case 'announcement': return '공지사항';
      case 'inquiry': return '신고/문의';
      default: return '게시판';
    }
  };

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate(`/boards/${boardType}/write`);
    } else {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login', { state: { from: `/boards/${boardType}` } });
    }
  };

  const renderOtherBoard = () => (
    <>
      <SearchContainer>
        <FilterSelect>
          <option value="title">제목</option>
          <option value="author">작성자</option>
        </FilterSelect>
        <SearchInput placeholder="검색어를 입력하세요" />
        <SearchButton>검색</SearchButton>
      </SearchContainer>
      <Table>
        <thead>
          <tr>
            <Th>번호</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>작성일</Th>
            <Th>조회수</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.boardId} onClick={() => navigate(`/boards/${boardType}/${post.boardId}`)}>
              <Td>{index + 1}</Td>
              <Td>{post.title || '(제목 없음)'}</Td>
              <Td>{post.author || '익명'}</Td>
              <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
              <Td>{post.viewCount ?? 0}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
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
          renderOtherBoard()
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
