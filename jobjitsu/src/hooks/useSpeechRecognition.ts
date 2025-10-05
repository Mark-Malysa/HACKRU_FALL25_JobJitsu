// src/hooks/useSpeechRecognition.ts (Updated)
import { useState, useEffect, useRef } from 'react';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
}
interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

export const useSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.log("Your browser does not support speech recognition.");
        return;
      }
      
      const recognition = new SpeechRecognition() as SpeechRecognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setText(finalTranscriptRef.current + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', (event as any).error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      finalTranscriptRef.current = '';
      setText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const hasRecognitionSupport = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};