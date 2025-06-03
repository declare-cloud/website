import { render, screen } from '@testing-library/react';
import Home from '../app/page';

test('renders hello message', () => {
  render(<Home />);
  expect(screen.getByText(/hello from tailwind/i)).toBeInTheDocument();
});
