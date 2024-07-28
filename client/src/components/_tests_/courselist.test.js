import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../redux/store'; // Adjust the import according to your project structure
import CourseListSearch from '../Courselist';
import * as api from '../../api/auth';

// Mock the API call
jest.mock('../../api/auth');

const initialState = {
  ui: { isDarkMode: false },
  // Add other initial state values if needed
};

const renderWithRedux = (
  component,
  { initialState, store = configureStore({ reducer: rootReducer, preloadedState: initialState }) } = {}
) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('CourseListSearch', () => {
  it('renders loading state initially', () => {
    renderWithRedux(<CourseListSearch />, { initialState });

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    api.getMatchedPartner.mockRejectedValueOnce({
      response: { data: { error: 'Failed to fetch data' } },
    });

    renderWithRedux(<CourseListSearch />, { initialState });

    expect(await screen.findByText(/error: failed to fetch data/i)).toBeInTheDocument();
  });

  it('renders matched courses', async () => {
    const matchedUsers = [
      {
        course_code: 'CS101',
        partner1: { full_name: 'Alice' },
        partner2: { full_name: 'Bob' },
      },
      {
        course_code: 'CS102',
        partner1: { full_name: 'Charlie' },
        partner2: { full_name: 'Dave' },
      },
    ];

    api.getMatchedPartner.mockResolvedValueOnce({
      data: { success: true, matchedUsers },
    });

    renderWithRedux(<CourseListSearch />, { initialState });

    expect(await screen.findByText(/course: cs101/i)).toBeInTheDocument();
    expect(screen.getByText(/partner 1: alice/i)).toBeInTheDocument();
    expect(screen.getByText(/partner 2: bob/i)).toBeInTheDocument();

    expect(screen.getByText(/course: cs102/i)).toBeInTheDocument();
    expect(screen.getByText(/partner 1: charlie/i)).toBeInTheDocument();
    expect(screen.getByText(/partner 2: dave/i)).toBeInTheDocument();
  });

  it('filters courses based on search term', async () => {
    const matchedUsers = [
      {
        course_code: 'CS101',
        partner1: { full_name: 'Alice' },
        partner2: { full_name: 'Bob' },
      },
      {
        course_code: 'CS102',
        partner1: { full_name: 'Charlie' },
        partner2: { full_name: 'Dave' },
      },
    ];

    api.getMatchedPartner.mockResolvedValueOnce({
      data: { success: true, matchedUsers },
    });

    renderWithRedux(<CourseListSearch />, { initialState });

    expect(await screen.findByText(/course: cs101/i)).toBeInTheDocument();
    expect(screen.getByText(/course: cs102/i)).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/search courses/i);
    fireEvent.change(searchInput, { target: { value: 'CS101' } });

    expect(screen.getByText(/course: cs101/i)).toBeInTheDocument();
    expect(screen.queryByText(/course: cs102/i)).toBeNull();
  });
});
