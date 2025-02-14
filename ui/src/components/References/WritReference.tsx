import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWrit, useChatState, useWritByFlagAndWritId } from '@/state/chat';
import { useChannelPreview } from '@/state/groups';
// eslint-disable-next-line import/no-cycle
import ChatContent from '@/chat/ChatContent/ChatContent';
import { udToDec } from '@urbit/api';
import bigInt from 'big-integer';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ReferenceBar from './ReferenceBar';

function UnSubbedWritReference({
  chFlag,
  nest,
  idWrit,
  preview,
}: {
  chFlag: string;
  nest: string;
  idWrit: string;
  preview: any;
}) {
  const unSubbedWrit = useWritByFlagAndWritId(chFlag, idWrit);

  // TODO: handle failure for useWritByFlagAndWritId call.
  if (!unSubbedWrit) {
    return <LoadingSpinner />;
  }

  const { writ } = unSubbedWrit;
  const time = bigInt(udToDec(writ.seal.id.split('/')[1]));

  if (!('story' in writ.memo.content)) {
    return null;
  }

  return (
    <div className="writ-inline-block group">
      <Link
        to={
          preview?.group
            ? `/groups/${preview.group.flag}/channels/${nest}?msg=${writ.seal.id}`
            : ''
        }
        className="cursor-pointer p-2 group-hover:bg-gray-50"
      >
        <ChatContent story={writ.memo.content.story} />
      </Link>
      <ReferenceBar
        nest={nest}
        time={time}
        author={writ.memo.author}
        unSubbed
        groupFlag={preview?.group.flag}
        groupTitle={preview?.group.meta.title}
        channelTitle={preview?.meta?.title}
      />
    </div>
  );
}

export default function WritReference({
  chFlag,
  nest,
  idWrit,
}: {
  chFlag: string;
  nest: string;
  idWrit: string;
}) {
  const writObject = useWrit(chFlag, idWrit);
  const preview = useChannelPreview(nest);
  const [scryError, setScryError] = useState<string>();

  useEffect(() => {
    useChatState
      .getState()
      .initialize(chFlag)
      .catch((reason) => {
        setScryError(reason);
      });
  }, [chFlag]);

  if (scryError !== undefined) {
    return (
      <UnSubbedWritReference
        chFlag={chFlag}
        nest={nest}
        idWrit={idWrit}
        preview={preview}
      />
    );
  }

  if (!writObject) {
    return <LoadingSpinner />;
  }

  const [time, writ] = writObject;
  const {
    memo: { author, content },
  } = writ;

  if (!('story' in content)) {
    return null;
  }

  return (
    <div className="writ-inline-block group">
      <Link
        to={
          preview?.group
            ? `/groups/${preview.group.flag}/channels/${nest}?msg=${time}`
            : ''
        }
        className="cursor-pointer p-2 group-hover:bg-gray-50"
      >
        <ChatContent story={content.story} />
      </Link>
      <ReferenceBar
        nest={nest}
        time={time}
        author={author}
        groupFlag={preview?.group.flag}
        groupTitle={preview?.group.meta.title}
        channelTitle={preview?.meta?.title}
      />
    </div>
  );
}
