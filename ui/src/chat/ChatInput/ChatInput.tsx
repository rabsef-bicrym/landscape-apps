import { Editor } from '@tiptap/react';
import { debounce } from 'lodash';
import cn from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useChatState, useChatDraft, usePact } from '@/state/chat';
import { ChatBlock, ChatMemo } from '@/types/chat';
import MessageEditor, { useMessageEditor } from '@/components/MessageEditor';
import Avatar from '@/components/Avatar';
import ShipName from '@/components/ShipName';
import X16Icon from '@/components/icons/X16Icon';
import {
  fetchChatBlocks,
  useChatInfo,
  useChatStore,
} from '@/chat/useChatStore';
import ChatInputMenu from '@/chat/ChatInputMenu/ChatInputMenu';
import { useIsMobile } from '@/logic/useMedia';
import {
  normalizeInline,
  inlinesToJSON,
  JSONToInlines,
  tipTapToString,
} from '@/logic/tiptap';
import { Inline } from '@/types/content';

interface ChatInputProps {
  whom: string;
  replying?: string;
  autoFocus?: boolean;
  showReply?: boolean;
  className?: string;
  sendDisabled?: boolean;
  sendMessage: (whom: string, memo: ChatMemo) => void;
}

export default function ChatInput({
  whom,
  replying,
  autoFocus,
  className = '',
  showReply = false,
  sendDisabled = false,
  sendMessage,
}: ChatInputProps) {
  const draft = useChatDraft(whom);
  const pact = usePact(whom);
  const chatInfo = useChatInfo(whom);
  const reply = replying || chatInfo?.replying || null;
  const replyingWrit = reply && pact.writs.get(pact.index[reply]);
  const ship = replyingWrit && replyingWrit.memo.author;
  const isMobile = useIsMobile();

  const closeReply = useCallback(() => {
    useChatStore.getState().reply(whom, null);
  }, [whom]);

  const onUpdate = useMemo(
    () =>
      debounce(({ editor }) => {
        if (!whom) {
          return;
        }

        const data = normalizeInline(
          JSONToInlines(editor?.getJSON()) as Inline[]
        );
        useChatState.getState().draft(whom, {
          inline: Array.isArray(data) ? data : [data],
          block: [],
        });
      }, 1000),
    [whom]
  );

  useEffect(() => () => onUpdate.cancel(), [onUpdate]);

  const onSubmit = useCallback(
    async (editor: Editor) => {
      const blocks = fetchChatBlocks(whom);
      if (!editor.getText() && !blocks.length) {
        return;
      }

      const data = normalizeInline(
        JSONToInlines(editor?.getJSON()) as Inline[]
      );

      const memo: ChatMemo = {
        replying: reply,
        author: `~${window.ship || 'zod'}`,
        sent: Date.now(),
        content: {
          story: {
            inline: Array.isArray(data) ? data : [data],
            block: blocks,
          },
        },
      };

      sendMessage(whom, memo);
      useChatState.getState().draft(whom, { inline: [], block: [] });
      editor?.commands.setContent('');
      setTimeout(() => closeReply(), 0);
      useChatStore.getState().setBlocks(whom, []);
    },
    [reply, whom, sendMessage, closeReply]
  );

  const messageEditor = useMessageEditor({
    whom,
    content: '',
    placeholder: 'Message',
    onEnter: useCallback(
      ({ editor }) => {
        onSubmit(editor);
        return true;
      },
      [onSubmit]
    ),
    onUpdate,
  });

  useEffect(() => {
    if (whom && messageEditor && !messageEditor.isDestroyed) {
      messageEditor?.commands.setContent('');
      useChatState.getState().getDraft(whom);
    }
  }, [whom, messageEditor]);

  useEffect(() => {
    if ((autoFocus || reply) && messageEditor && !messageEditor.isDestroyed) {
      messageEditor.commands.focus();
    }
  }, [autoFocus, reply, messageEditor]);

  useEffect(() => {
    const draftEmpty = draft.inline.length === 0 && draft.block.length === 0;
    if (!draftEmpty && messageEditor) {
      const current = tipTapToString(messageEditor.getJSON());

      if (current === '' && !messageEditor.isDestroyed) {
        messageEditor.commands.setContent(inlinesToJSON(draft.inline), true);
      }
    }
  }, [draft, messageEditor]);

  const onClick = useCallback(
    () => messageEditor && onSubmit(messageEditor),
    [messageEditor, onSubmit]
  );

  if (!messageEditor) {
    return null;
  }

  return (
    <>
      <div className={cn('flex w-full items-end space-x-2', className)}>
        <div className="flex-1">
          {chatInfo.blocks.length > 0 ? (
            <div className="mb-4 flex items-center justify-start font-semibold">
              <span className="mr-2 text-gray-600">Attached: </span>
              {chatInfo.blocks.length} reference
              {chatInfo.blocks.length === 1 ? '' : 's'}
              <button
                className="icon-button ml-auto"
                onClick={() => useChatStore.getState().setBlocks(whom, [])}
              >
                <X16Icon className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {showReply && ship && reply ? (
            <div className="mb-4 flex items-center justify-start font-semibold">
              <span className="text-gray-600">Replying to</span>
              <Avatar size="xs" ship={ship} className="ml-2" />
              <ShipName name={ship} showAlias className="ml-2" />
              <button className="icon-button ml-auto" onClick={closeReply}>
                <X16Icon className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          <div className="flex items-center justify-end">
            <Avatar size="xs" ship={window.our} className="mr-2" />
            <MessageEditor editor={messageEditor} className="w-full" />
            {/* <button
              // this is not contained by relative because of a bug in radix popovers
              title={'Insert Test Image'}
              className="absolute mr-2 text-gray-600 hover:text-gray-800"
              aria-label="Add attachment"
              onClick={() => {
                sendMessage(whom, {
                  replying: null,
                  author: `~${window.ship || 'zod'}`,
                  sent: Date.now(),
                  content: {
                    story: {
                      inline: [],
                      block: [
                        {
                          image: randomElement<Image>(PLACEHOLDER_IMAGES),
                        },
                      ],
                    },
                  },
                });
              }}
            >
              <AddIcon className="h-6 w-4" />
            </button> */}
          </div>
        </div>
        <button
          className="button"
          disabled={
            sendDisabled ||
            (messageEditor.getText() === '' && chatInfo.blocks.length === 0)
          }
          onClick={onClick}
        >
          Send
        </button>
      </div>
      {isMobile && messageEditor.isFocused ? (
        <ChatInputMenu editor={messageEditor} />
      ) : null}
    </>
  );
}
