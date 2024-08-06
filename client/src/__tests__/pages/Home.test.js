import React from 'react';

import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'; // for the custom matchers like toBeInTheDocument
import '@testing-library/jest-dom'
import Home from '../../pages/Home';
import { SocketContext, UserContext } from '../../App';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
  }));
  

  describe('Home', () => {
    it('should display the default message when no current room is found', () => {
      const mockSocket = {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
      };
  
      const mockUser = { email: 'example@gmail.com', uid: '1' };
      const mockUserContextValue = { user: mockUser };
  
      render(
        <BrowserRouter>
          <SocketContext.Provider value={mockSocket}>
            <UserContext.Provider value={mockUserContextValue}>
              <Home />
            </UserContext.Provider>
          </SocketContext.Provider>
        </BrowserRouter>
      );
  
      expect(screen.getByText('Current waiting room will display here if you are in a waiting room for a quiz')).toBeInTheDocument();
    });

    it('should display the current room when found with status waiting', async () => {
        const mockSocket = {
          emit: jest.fn(),
          on: jest.fn((event, callback) => {
            if (event === 'current_room_found') {
              callback({
                quiz: { quizid: '123', tname: 'Test Quiz', created: new Date(), uid: '1' },
                status: 'waiting',
              });
            }
          }),
          off: jest.fn(),
        };
    
        const mockUser = { email: 'example@gmail.com', uid: '1' };
        const mockUserContextValue = { user: mockUser };
    
        render(
          <BrowserRouter>
            <SocketContext.Provider value={mockSocket}>
              <UserContext.Provider value={mockUserContextValue}>
                <Home />
              </UserContext.Provider>
            </SocketContext.Provider>
          </BrowserRouter>
        );
    
        await waitFor(() => {
          expect(screen.getByText('id: 123')).toBeInTheDocument();
        });
      });
  });