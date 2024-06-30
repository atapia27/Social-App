import Router from 'next/router';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return token !== null;
};

export const logout = () => {
  localStorage.removeItem('token');
  Router.push('/login');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
