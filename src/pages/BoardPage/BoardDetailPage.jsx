import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { ClipLoader } from 'react-spinners';
import { Container, Title, Meta, Content, BackButton, Image, LikeButton } from './BoardStyles';

const BoardDetailPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { boardType, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/boards/${id}`);
      setPost(response.data);
      // 좋아요 상태 가져오기
      setLiked(response.data.isLiked);
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      // 좋아요 API 호출
      const response = await axios.post(`http://localhost:8080/boards/${id}/like`);
      setLiked(!liked);
      setPost(prev => ({
        ...prev,
        comment_like_cnt: liked ? prev.comment_like_cnt - 1 : prev.comment_like_cnt + 1
      }));
    } catch (error) {
      console.error('좋아요 처리에 실패했습니다:', error);
    }
  };

  if (loading) return (
    <Container>
      <ClipLoader color="#e57373" loading={loading} size={50} />
    </Container>
  );

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const renderExtraInfo = () => {
    if (boardType === 'review' || boardType === 'boast') {
      return (
        <>
          <span>조회수: {post.comment_view_cnt}</span>
          <span>
            좋아요: {post.comment_like_cnt}
            <LikeButton onClick={handleLike}>
              <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? 'red' : 'gray'} />
            </LikeButton>
          </span>
        </>
      );
    } else if (boardType === 'inquiry') {
      return <span>상태: {post.inquiry_status}</span>;
    }
    return null;
  };

  return (
    <Container>
      <Title>{post.title}</Title>
      <Meta>
        <span>작성자: {post.member_id}</span>
        <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
        {renderExtraInfo()}
      </Meta>
      <Content>{post.content}</Content>
      {post.content_img && <Image src={post.content_img} alt="게시글 이미지" />}
      <BackButton onClick={() => navigate(`/boards/${boardType}`)}>목록으로</BackButton>
    </Container>
  );
};

export default BoardDetailPage;