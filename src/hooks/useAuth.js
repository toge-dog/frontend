import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post('http://localhost:8080/login', credentials);
      const userData = await axios.get('http://localhost:8080/member', { headers: {"Authorization":response.headers['authorization']}});
      return {
        token: response.headers['authorization'],
        user: userData.data.data
      };
    },
    onSuccess: (data) => {
        const { token, user } = data;
        localStorage.setItem('token', token);    
        setUser(user);
        setIsLoggedIn(true);
        queryClient.setQueryData(['user'], user);
        navigate('/'); // 로그인 성공 후 홈으로 리다이렉트
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  });

  const login = useCallback(async (credentials) => {
    await loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  const logout = useCallback(async () => {
    try {
      await axios.post('http://localhost:8080/logout');
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      queryClient.setQueryData(['user'], null);
      navigate('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
    }
  }, [navigate, queryClient]);

  return {
    user,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    isLoggedIn,
    login,
    logout,
  };
};