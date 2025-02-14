/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createMockGroup } from '@/mocks/groups';
import { Group } from '@/types/groups';
import { describe, expect, it } from 'vitest';
import { render } from '../../../test/utils';
import Sidebar from './Sidebar';

const fakeFlag = '~zod/tlon';
const fakeGroup: Group = createMockGroup('Fake Group');

vi.mock('@/state/chat', () => ({
  useBriefs: () => ({}),
  usePinnedGroups: () => ({}),
  usePinned: () => [],
}));

vi.mock('@/state/groups', () => ({
  useGroup: () => fakeGroup,
  useRouteGroup: () => fakeFlag,
  useGroupsInitialized: () => true,
  useGroups: () => [fakeFlag, fakeGroup],
  usePendingInvites: () => [],
}));

vi.mock('@/logic/utils', () => ({
  createStorageKey: () => 'fake-key',
  randomIntInRange: () => 100,
  normalizeUrbitColor: () => '#ffffff',
  hasKeys: () => false,
  randomElement: (a: any[]) => a[0],
}));

describe('Sidebar', () => {
  it('renders as expected', () => {
    const { asFragment } = render(<Sidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
