import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../../comps/Navbar';
import { UserContext } from '../../App';
import { BrowserRouter } from 'react-router-dom';

// Mocking necessary modules and functions
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

}));

describe('Navbar', () => {
  it('should display the user email when the user is logged in', () => {
    const mockUser = { email: 'example@gmail.com', uid: '1' };
    const mockUserContextValue = { user: mockUser, setUser: jest.fn() };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContextValue}>
          <Navbar />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome, example@gmail.com')).toBeInTheDocument();
  });

  it('should display the login and register links when the user is not logged in', () => {
    const mockUserContextValue = { user: null, setUser: jest.fn() };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContextValue}>
          <Navbar />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
