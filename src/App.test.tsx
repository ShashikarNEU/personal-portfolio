import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

class MockSpeechRecognition {
  lang = '';
  continuous = false;
  interimResults = false;
  onresult = null;
  onerror = null;
  onend = null;
  start = jest.fn();
  stop = jest.fn();
  abort = jest.fn();
}

beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(global, 'crypto', {
    writable: true,
    configurable: true,
    value: {
      randomUUID: jest.fn(() => 'test-thread-id'),
    },
  });

  Object.defineProperty(window, 'SpeechRecognition', {
    writable: true,
    configurable: true,
    value: MockSpeechRecognition,
  });

  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    writable: true,
    configurable: true,
    value: jest.fn(),
  });

  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    configurable: true,
    value: {
      cancel: jest.fn(),
      speak: jest.fn(),
    },
  });
});

const renderPortfolio = () =>
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );

test('renders the redesigned portfolio shell', () => {
  renderPortfolio();

  expect(screen.getByRole('heading', { name: /shashikar anthoniraj/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByText(/featured projects/i)).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { name: /^contact$/i })).toHaveLength(1);
});

test('opens the AI assistant from the floating launcher', () => {
  renderPortfolio();

  fireEvent.click(screen.getByRole('button', { name: /open ai chat assistant/i }));

  expect(screen.getByRole('dialog', { name: /ai chat assistant/i })).toBeInTheDocument();
  expect(screen.getByText(/shashikar assistant/i)).toBeInTheDocument();
  expect(screen.getByText(/try a recruiter-style prompt/i)).toBeInTheDocument();
});

test('enables voice conversation mode when browser speech APIs exist', () => {
  renderPortfolio();

  fireEvent.click(screen.getByRole('button', { name: /open ai chat assistant/i }));
  fireEvent.click(screen.getByRole('button', { name: /turn on voice conversation mode/i }));

  expect(screen.getByRole('button', { name: /turn off voice conversation mode/i })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(screen.getByText(/tap the mic, speak/i)).toBeInTheDocument();
});
