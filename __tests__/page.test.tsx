import { render, screen } from '@testing-library/react';
import Home from '../app/page';

test('renders hello message', () => {
  render(<Home />);
  expect(screen.getByText(/Hello!!/i)).toBeInTheDocument();
});
