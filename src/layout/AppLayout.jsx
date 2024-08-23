import React from 'react'
import logo from '../assets/logo.png'
import { Container } from 'react-bootstrap'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import styled from 'styled-components'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const AppLayout = () => {

  const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
      queryKey: ['user'],
      queryFn: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      },
      staleTime: Infinity,
    });

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('pet');
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['pet'], null);
      navigate('/login');
    };
  
    return (
      <PageWrapper>
        <StyledNavbar>
          <NavbarContainer>
            <Link to="/">
              <Logo src={logo} alt="Logo" />
            </Link>
            <NavLinks>
              <StyledNavLink to="/boards/review">매칭 후기</StyledNavLink>
              <StyledNavLink to="/boards/boast">자랑</StyledNavLink>
              <StyledNavLink to="/boards/announcement">공지사항</StyledNavLink>
              <StyledNavLink to="/boards/inquiry">신고/문의</StyledNavLink>
            </NavLinks>
            {user ? (
              <UserActions>
                <UserName>{user.nickName} 님</UserName>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                {console.log("user", user)}
              </UserActions>
            ) : (
              <LoginButton to="/login">로그인</LoginButton>
            )}
          </NavbarContainer>
        </StyledNavbar>
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </PageWrapper>
    )
  }

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const StyledNavbar = styled.nav`
  background-color: white;
  padding: 10px 0;
`

const NavbarContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.img`
  height: 50px;
`

const NavLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`

const StyledNavLink = styled(NavLink)`
  color: black;
  text-decoration: none;
  margin: 0 30px;
  font-weight: bold;
`

const LoginButton = styled(NavLink)`
  background-color: #79c283dd;
  border-color: #79c283dd;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &.active {
    background-color: #79c283dd;
    border-color: #79c283dd;
  }
`

const MainContent = styled.main`
  flex: 1;
  padding: 40px 0;
`

const UserActions = styled.div`
  display: flex;
  align-items: center;
`

const UserName = styled.span`
  margin-right: 10px;
`

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`

export default AppLayout