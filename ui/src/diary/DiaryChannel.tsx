import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import Layout from '@/components/Layout/Layout';
import { useRouteGroup, useVessel } from '@/state/groups/groups';
import {
  useNotesForDiary,
  useDiaryState,
  useDiaryDisplayMode,
  useDiaryPerms,
} from '@/state/diary';
import {
  DiarySetting,
  setSetting,
  useDiarySettings,
  useDiarySortMode,
  useSettingsState,
} from '@/state/settings';
import ChannelHeader from '@/channels/ChannelHeader';
import useDismissChannelNotifications from '@/logic/useDismissChannelNotifications';
import { DiaryDisplayMode } from '@/types/diary';
import DiaryGridView from '@/diary/DiaryList/DiaryGridView';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import * as Toast from '@radix-ui/react-toast';
import { createStorageKey } from '@/logic/utils';
import DiaryListItem from './DiaryList/DiaryListItem';
import useDiaryActions from './useDiaryActions';

function DiaryChannel() {
  const { chShip, chName } = useParams();
  const chFlag = `${chShip}/${chName}`;
  const nest = `diary/${chFlag}`;
  const flag = useRouteGroup();
  const vessel = useVessel(flag, window.our);
  const letters = useNotesForDiary(chFlag);
  const location = useLocation();
  const navigate = useNavigate();
  const [, setRecent] = useLocalStorage(
    createStorageKey(`recent-chan:${flag}`),
    ''
  );
  const newNote = new URLSearchParams(location.search).get('new');
  const [showToast, setShowToast] = useState(false);
  const { didCopy, onCopy } = useDiaryActions({
    flag: chFlag,
    time: newNote || '',
  });

  const settings = useDiarySettings();
  // for now sortMode is not actually doing anything.
  // need input from design/product on what we want it to actually do, it's not spelled out in figma.
  const displayMode = useDiaryDisplayMode(chFlag);
  const sortMode = useDiarySortMode(chFlag);

  const setDisplayMode = (view: DiaryDisplayMode) => {
    useDiaryState.getState().viewDiary(chFlag, view);
  };

  const setSortMode = (
    setting: 'time-dsc' | 'quip-dsc' | 'time-asc' | 'quip-asc'
  ) => {
    const newSettings = setSetting<DiarySetting>(
      settings,
      { sortMode: setting },
      chFlag
    );
    useSettingsState
      .getState()
      .putEntry('diary', 'settings', JSON.stringify(newSettings));
  };

  const perms = useDiaryPerms(chFlag);

  const canWrite =
    perms.writers.length === 0 ||
    _.intersection(perms.writers, vessel.sects).length !== 0;

  useEffect(() => {
    useDiaryState.getState().initialize(chFlag);
    setRecent(nest);
  }, [chFlag, nest, setRecent]);

  useEffect(() => {
    let timeout: any;

    if (newNote) {
      setShowToast(true);
      timeout = setTimeout(() => {
        setShowToast(false);
        navigate(location.pathname, { replace: true });
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [newNote, location, navigate]);

  useDismissChannelNotifications({
    markRead: useDiaryState.getState().markRead,
  });

  const sortedNotes = Array.from(letters).sort(([a], [b]) => {
    if (sortMode === 'time-dsc') {
      return b.compare(a);
    }
    if (sortMode === 'time-asc') {
      return a.compare(b);
    }
    // TODO: get the time of most recent quip from each diary note, and compare that way
    if (sortMode === 'quip-asc') {
      return b.compare(a);
    }
    if (sortMode === 'quip-dsc') {
      return b.compare(a);
    }
    return b.compare(a);
  });

  return (
    <Layout
      stickyHeader
      className="flex-1 overflow-y-scroll bg-gray-50"
      aside={<Outlet />}
      header={
        <ChannelHeader
          isDiary
          flag={flag}
          nest={nest}
          showControls
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          sortMode={sortMode}
          setSortMode={setSortMode}
        >
          {canWrite ? (
            <Link
              to="edit"
              className="button bg-blue text-white dark:text-black"
            >
              Add Note
            </Link>
          ) : null}
        </ChannelHeader>
      }
    >
      <Toast.Provider>
        <div className="relative flex flex-col items-center">
          <Toast.Root duration={3000} defaultOpen={false} open={showToast}>
            <Toast.Description asChild>
              <div className="absolute z-10 flex w-[415px] -translate-x-2/4 items-center justify-between space-x-2 rounded-lg bg-white font-semibold text-black drop-shadow-lg dark:bg-gray-200">
                <span className="py-2 px-4">Note successfully published</span>
                <button
                  onClick={onCopy}
                  className="-mx-4 -my-2 w-[135px] rounded-r-lg bg-blue py-2 px-4 text-white dark:text-black"
                >
                  {didCopy ? 'Copied' : 'Copy Note Link'}
                </button>
              </div>
            </Toast.Description>
          </Toast.Root>
          <Toast.Viewport label="Note successfully published" />
        </div>
      </Toast.Provider>
      <div className="p-4">
        {displayMode === 'grid' ? (
          <DiaryGridView notes={sortedNotes} />
        ) : (
          <div className="h-full p-6">
            <div className="mx-auto flex h-full max-w-[600px] flex-col space-y-4">
              {sortedNotes.map(([time, letter]) => (
                <DiaryListItem
                  key={time.toString()}
                  time={time}
                  letter={letter}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DiaryChannel;
