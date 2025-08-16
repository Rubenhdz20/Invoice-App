import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

test('renders app title', () => {
  render(<App />);
  expect(screen.getByText(/invoice/i)).toBeInTheDocument();
});