import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import ChatMessage from './ChatMessage';
import { makeChatWrit } from '../../fixtures/chat';

describe('ChatMessage', () => {
  it('renders as expected', () => {
    const writ = makeChatWrit(1, '~finned-palmer', {
    block: [],
    inline: [{ bold: 'A bold test message' }, "with some more text"],
    },
    undefined,
    true,
    );
    const { asFragment } = render(<ChatMessage writ={writ} newAuthor />);
    expect(asFragment()).toMatchSnapshot();
  });
});
