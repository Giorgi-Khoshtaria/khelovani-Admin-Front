import { useCallback, useState } from "react";

interface CropperState {
  queue: File[];
  current: File | null;
}

const empty: CropperState = { queue: [], current: null };

export interface UseImageCropperResult {
  current: File | null;
  enqueue: (files: File[] | File) => void;
  cancelCurrent: () => void;
  cancelAll: () => void;
  confirmCurrent: (processed: File, onProcessed: (file: File) => void) => void;
}

export function useImageCropper(): UseImageCropperResult {
  const [state, setState] = useState<CropperState>(empty);

  const enqueue = useCallback((files: File[] | File) => {
    const arr = Array.isArray(files) ? files : [files];
    if (arr.length === 0) return;
    setState((prev) => {
      if (prev.current) {
        return { ...prev, queue: [...prev.queue, ...arr] };
      }
      const [head, ...rest] = arr;
      return { current: head, queue: rest };
    });
  }, []);

  const advance = useCallback(() => {
    setState((prev) => {
      const [head, ...rest] = prev.queue;
      return { current: head ?? null, queue: rest };
    });
  }, []);

  const cancelCurrent = useCallback(() => advance(), [advance]);

  const cancelAll = useCallback(() => setState(empty), []);

  const confirmCurrent = useCallback(
    (processed: File, onProcessed: (file: File) => void) => {
      onProcessed(processed);
      advance();
    },
    [advance],
  );

  return {
    current: state.current,
    enqueue,
    cancelCurrent,
    cancelAll,
    confirmCurrent,
  };
}
