import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock axios
jest.mock('axios');
const axios = require('axios');

beforeEach(() => {
  axios.get.mockResolvedValue({ data: [] });
});

test('renders navigation bar', () => {
  render(<App />);
  const brandElement = screen.getByText(/DevOps Todo/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const dashboardLink = screen.getByText(/Dashboard/i);
  const todosLink = screen.getByText(/Todos/i);
  const analyticsLink = screen.getByText(/Analytics/i);
  const aboutLink = screen.getByText(/About/i);
  
  expect(dashboardLink).toBeInTheDocument();
  expect(todosLink).toBeInTheDocument();
  expect(analyticsLink).toBeInTheDocument();
  expect(aboutLink).toBeInTheDocument();
});

test('shows loading state initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});

test('can navigate between pages', async () => {
  axios.get.mockResolvedValue({ data: [] });
  render(<App />);
  
  // Wait for loading to complete
  await screen.findByText(/Dashboard Overview/i);
  
  // Navigate to Todos page
  const todosLink = screen.getByText(/Todos/i);
  fireEvent.click(todosLink);
  
  const todosTitle = await screen.findByText(/My Tasks/i);
  expect(todosTitle).toBeInTheDocument();
  
  // Navigate to Analytics page
  const analyticsLink = screen.getByText(/Analytics/i);
  fireEvent.click(analyticsLink);
  
  const analyticsTitle = await screen.findByText(/Analytics & Insights/i);
  expect(analyticsTitle).toBeInTheDocument();
  
  // Navigate to About page
  const aboutLink = screen.getByText(/About/i);
  fireEvent.click(aboutLink);
  
  const aboutTitle = await screen.findByText(/About This Project/i);
  expect(aboutTitle).toBeInTheDocument();
});
