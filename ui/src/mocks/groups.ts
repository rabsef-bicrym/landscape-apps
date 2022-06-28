import faker from '@faker-js/faker';
import { Group, Vessel, Gangs } from '../types/groups';

const emptyVessel = (): Vessel => ({
  sects: [],
  joined: Date.now(),
});

const adminVessel = (): Vessel => ({
  sects: ['admin'],
  joined: Date.now(),
});

function createMockGroup(title: string): Group {
  return {
    fleet: {
      '~hastuc-dibtux': emptyVessel(),
      '~finned-palmer': emptyVessel(),
      '~zod': emptyVessel(),
    },
    cabals: {},
    channels: {},
    cordon: {
      open: {
        ranks: ['czar'],
        ships: ['~bus'],
      },
    },
    meta: {
      title,
      description:
        'We build infrastructre that is technically excellent, architecturally sound, and aesthetically beautiful',
      image:
        'https://nyc3.digitaloceanspaces.com/hmillerdev/nocsyx-lassul/2022.6.14..18.37.11-Icon Box.png',
      color: '',
    },
  };
}
const mockGroupOne: Group = {
  fleet: {
    '~finned-palmer': adminVessel(),
  },
  cabals: {},
  channels: {
    '~dev/test': {
      meta: {
        title: 'Watercooler',
        description: 'watering hole',
        image: '',
        color: '',
      },
    },
  },
  cordon: {
    open: {
      ranks: ['czar'],
      ships: ['~bus'],
    },
  },
  meta: {
    title: 'tlon',
    description: 'the tlon corporation',
    image: '',
    color: '',
  },
};

const mockGroupTwo: Group = {
  fleet: {
    '~finned-palmer': adminVessel(),
  },
  cabals: {},
  channels: {
    '~zod/test': {
      meta: {
        title: 'Milady',
        description: 'Milady maker chatroom',
        image: '',
        color: '',
      },
    },
  },
  cordon: {
    open: {
      ranks: ['czar'],
      ships: ['~bus'],
    },
  },
  meta: {
    title: 'remco',
    description: 'The urbit group for remilia, a digital art collective',
    image: '',
    color: '',
  },
};

const mockGroups: { [flag: string]: Group } = {
  '~zod/remco': mockGroupTwo,
  '~dev/tlon': mockGroupOne,
};

function createChannel(title: string) {
  return {
    meta: {
      title,
      description: 'Do some chatting',
      image: '',
      color: '',
    },
  };
}

for (let i = 0; i < 20; i += 1) {
  const group = createMockGroup(faker.company.companyName());

  for (let j = 0; j < 20; j += 1) {
    group.channels[`~zod/tlon${i}${j}`] = createChannel(faker.company.bs());
  }

  mockGroups[`~zod/tlon${i}`] = group;
}

export const mockGangs: Gangs = {
  '~zod/structure': {
    invite: {
      text: 'Come join the group',
      ship: '~fabled-faster',
    },
    claim: {
      progress: 'adding',
      'join-all': true,
    },
    preview: {
      cordon: {
        afar: {
          app: '~zod/eth-verify',
          path: '/x/can-join/',
          desc: 'This group requires a',
        },
      },
      meta: {
        title: 'Structure',
        description:
          'Urbit Structural Design and Engineering Group. Always Thinking About Mechanics.',
        image:
          'https://fabled-faster.nyc3.digitaloceanspaces.com/fabled-faster/2022.1.27..17.59.43-image.png',
        color: '',
      },
    },
  },
};

export const pinnedGroups = ['~zod/remco', '~dev/tlon'];

export default mockGroups;
