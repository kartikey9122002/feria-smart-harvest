
import { useState, useCallback } from 'react';

interface UseVoiceSearchProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

export const useVoiceSearch = ({ onResult, onError, language = 'en-US' }: UseVoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      onError?.('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      onError?.(event.error);
    };

    recognition.start();
  }, [onResult, onError, language]);

  return {
    isListening,
    startListening
  };
};
