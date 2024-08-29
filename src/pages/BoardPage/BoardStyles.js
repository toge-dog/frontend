import styled from 'styled-components';
import { Button } from 'react-bootstrap';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const FilterSelect = styled.select`
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-right: 10px;
`;

export const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-right: 10px;
  width: 200px;
`;

export const SearchButton = styled(Button)`
  background-color: #007bff;
  border-color: #007bff;
  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

export const Th = styled.th`
  background-color: #f8f9fa;
  color: #495057;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

export const WriteButton = styled(Button)`
  float: right;
  background-color: #007bff;
  border-color: #007bff;
  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

export const TextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 200px;
`;

export const Meta = styled.div`
  margin-bottom: 20px;
  color: #6c757d;
  
  span {
    margin-right: 15px;
  }
`;

export const Content = styled.div`
  white-space: pre-wrap;
  margin-bottom: 30px;
  background-color: #f8f9fa;  // 본문 부분의 배경색을 추가
  padding: 20px;  // 본문을 감싸는 패딩을 추가
  border-radius: 10px;  // 모서리를 부드럽게 처리
  font-size: 18px;  // 본문 폰트 크기를 조금 더 크게 설정
  line-height: 1.6;  // 본문 줄 간격을 좀 더 넓게 설정
`;

export const BackButton = styled(Button)`
  background-color: #6c757d;
  border-color: #6c757d;
  border-radius: 10px; 
  &:hover {
    background-color: #5a6268;
    border-color: #545b62;
  }
`;

export const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

export const ImagePreview = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  
  img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

export const GridItem = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  background-color: #fff;  /* 배경색을 설정하여 그림자가 잘 보이도록 */
  border-radius: 8px;  /* 코너를 부드럽게 둥글게 처리 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); /* 그림자 효과 */
  transition: box-shadow 0.3s ease;  /* 마우스를 올렸을 때 부드럽게 그림자가 변하는 효과 */

  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* 마우스 호버 시 더 진한 그림자 효과 */
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  max-width: 150px; 
  max-height: 150px; 
  overflow: hidden;
  margin: 0 auto;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AuthorName = styled.p`
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const PageButton = styled(Button)`
  margin: 0 5px;
  ${props => props.active && `
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  `}
`;

export const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

export const ImageUploadButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #333;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const SubmitButton = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

export const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const ContentContainer = styled.div`
  margin-bottom: 20px;  
  min-height: 300px;  
`;

export const CommentSection = styled.div`
  margin-top: 20px;
`;

export const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
`;

export const CommentSubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 10px; /* 버튼을 둥글게 만듭니다 */
  &:hover {
    background-color: #45a049;
  }
`;

export const CommentItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 10px;
  font-size: 15px;  
`;

export const CommentAuthor = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

export const CommentDate = styled.span`
  color: #6c757d;
`;

export const NoComments = styled.p`
  color: #999;
  text-align: center;
`;

