import React from 'react';
import Dialog, { DialogContent } from '@/components/Dialog';
import { GroupChannel } from '@/types/groups';

interface DeleteChannelModalProps {
  deleteChannelIsOpen: boolean;
  setDeleteChannelIsOpen: (open: boolean) => void;
  onDeleteChannelConfirm: () => void;
  channel?: GroupChannel;
}

export default function DeleteChannelModal({
  deleteChannelIsOpen,
  setDeleteChannelIsOpen,
  onDeleteChannelConfirm,
  channel,
}: DeleteChannelModalProps) {
  return (
    <Dialog open={deleteChannelIsOpen} onOpenChange={setDeleteChannelIsOpen}>
      <DialogContent showClose containerClass="max-w-lg">
        <div className="sm:w-96">
          <header className="mb-3 flex items-center">
            <h2 className="text-lg font-bold">Delete Channel</h2>
          </header>
        </div>
        <p className="text-prose">
          Are you sure you want to delete “{channel?.meta.title}”? Deleting will
          also delete channel for containing members.
        </p>
        <footer className="mt-4 flex items-center justify-between space-x-2">
          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => onDeleteChannelConfirm()}
              className="button bg-red text-white"
            >
              Delete
            </button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
