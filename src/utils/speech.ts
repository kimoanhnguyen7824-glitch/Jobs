export function speakEnglishWord(
  word: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onUnavailable?: (message: string) => void;
  },
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks?.onUnavailable?.(
      `Trình duyệt không hỗ trợ đọc tự động. Từ đang nghe là: "${word}".`,
    );
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.05;
    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = () => {
      callbacks?.onEnd?.();
    };
    window.speechSynthesis.speak(utterance);
  } catch {
    callbacks?.onEnd?.();
    callbacks?.onUnavailable?.(
      `Không thể phát âm thanh tự động trên thiết bị này.`,
    );
  }
}
