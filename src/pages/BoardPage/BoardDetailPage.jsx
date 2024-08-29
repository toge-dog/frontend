import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { ClipLoader } from 'react-spinners';
import { Container, Title, Meta, Content, BackButton, Image, LikeButton, CommentSection, CommentInput, CommentSubmitButton, CommentItem, CommentAuthor, CommentDate, NoComments } from './BoardStyles';

const BoardDetailPage = () => {
  const [commentContent, setCommentContent] = useState('');
  const { boardType, boardId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const fetchPost = async () => {
    if (!boardId) {
      throw new Error('잘못된 게시글 ID 입니다.');
    }
    try {
      const response = await axios.get(`http://localhost:8080/boards/${boardId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['post', boardId],
    queryFn: fetchPost,
    enabled: !!boardId,
    retry: 1
  });

  const likeMutation = useMutation({
    mutationFn: () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('token을 찾을 수 없습니다.');
      }
      return axios.post(`http://localhost:8080/likes`, {
        memberId: post.memberId,
        boardId: boardId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', boardId]);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        alert('로그인 후 사용하세요.');
      } else {
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    }
  });

  const commentMutation = useMutation({
    mutationFn: (newComment) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('token을 찾을 수 없습니다.');
      }
      return axios.post(`http://localhost:8080/boards/${boardId}/comments`, {
        comment: newComment.content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', boardId]);
      setCommentContent('');
    },
    onError: (error) => {
      alert('댓글 작성 중 오류가 발생했습니다.');
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = { content: commentContent };
    commentMutation.mutate(newComment);
  };

  if (isLoading) return (
    <Container>
      <ClipLoader color="#007bff" loading={isLoading} size={50} />
    </Container>
  );

  if (isError) {
    return <div>게시글을 불러오는데 오류가 발생했습니다: {error.message}</div>;
  }

  if (!post) {
    console.warn("Post not found");
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <Title>{post.title}</Title>
      <Meta>
        <span>작성자: {post.author}</span>
        <span>작성일: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '2024-08-29'}</span>
        <span>조회수: {post.viewCount || 0}</span>
        <span>
          좋아요: {post.likesCount || 0}
          <LikeButton onClick={handleLike}>
            <FontAwesomeIcon icon={post.isLiked ? solidHeart : regularHeart} color={post.isLiked ? 'red' : 'gray'} />
          </LikeButton>
        </span>
      </Meta>
      <Content>
        <p>{post.content}</p>
        {post.contentImg && <Image src={post.contentImg} alt="게시글 이미지" />}
      </Content>
      
      <CommentSection>
        <h3>댓글</h3>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <CommentItem key={comment.commentId}>
              <p>{comment.comment}</p>
              <CommentAuthor>{comment.name || '알 수 없음'}</CommentAuthor>
              <CommentDate>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : '2024-08-29'}</CommentDate>
            </CommentItem>
          ))
        ) : (
          <NoComments>아직 댓글이 없습니다.</NoComments>
        )}
        <form onSubmit={handleCommentSubmit}>
          <CommentInput 
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
        </form>
      </CommentSection>

      <BackButton onClick={() => navigate(`/boards/${boardType}`)}>목록으로</BackButton>
    </Container>
  );
};

export default BoardDetailPage;
