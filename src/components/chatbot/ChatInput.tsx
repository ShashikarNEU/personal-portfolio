import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  autoFocus?: boolean;
  voiceMode: boolean;
  onVoiceModeChange: (enabled: boolean) => void;
  speechOutputSupported: boolean;
}

const MAX_CHARS = 500;

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  autoFocus,
  voiceMode,
  onVoiceModeChange,
  speechOutputSupported,
}) => {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseValueRef = useRef("");
  const finalTranscriptRef = useRef("");
  const currentVoiceValueRef = useRef("");
  const suppressVoiceAutoSendRef = useRef(false);
  const voiceModeRef = useRef(voiceMode);
  const remaining = MAX_CHARS - value.length;

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const speechWindow = window as SpeechRecognitionWindow;
    setVoiceSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));

    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + "px";
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    suppressVoiceAutoSendRef.current = true;
    recognitionRef.current?.stop();
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setValue(val);
      // Auto-resize textarea
      const el = e.target;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 100) + "px";
    }
  };

  const handleVoiceToggle = () => {
    if (!voiceSupported || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognitionConstructor =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) return;

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    voiceBaseValueRef.current = value.trimEnd();
    finalTranscriptRef.current = "";
    currentVoiceValueRef.current = voiceBaseValueRef.current;
    suppressVoiceAutoSendRef.current = false;

    recognition.onresult = (event) => {
      let transcript = "";
      let finalTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const resultText = event.results[index][0]?.transcript || "";
        transcript += resultText;
        if (event.results[index].isFinal) {
          finalTranscript += resultText;
        }
      }

      const base = voiceBaseValueRef.current;
      const nextValue = `${base}${base && transcript ? " " : ""}${transcript}`.slice(0, MAX_CHARS);
      currentVoiceValueRef.current = nextValue.trim();
      if (finalTranscript.trim()) {
        finalTranscriptRef.current = `${base}${base && finalTranscript ? " " : ""}${finalTranscript}`.trim();
      }
      setValue(nextValue);
    };

    recognition.onerror = () => {
      suppressVoiceAutoSendRef.current = true;
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (suppressVoiceAutoSendRef.current) {
        suppressVoiceAutoSendRef.current = false;
        return;
      }

      const finalTranscript = (finalTranscriptRef.current || currentVoiceValueRef.current).trim();
      if (voiceModeRef.current && finalTranscript && !isLoading) {
        onSend(finalTranscript.slice(0, MAX_CHARS));
        setValue("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.voiceModeRow}>
        <button
          type="button"
          className={`${styles.voiceModeBtn} ${voiceMode ? styles.voiceModeBtnActive : ""}`}
          onClick={() => onVoiceModeChange(!voiceMode)}
          disabled={!voiceSupported || !speechOutputSupported}
          aria-pressed={voiceMode}
          aria-label={voiceMode ? "Turn off voice conversation mode" : "Turn on voice conversation mode"}
          title={
            voiceSupported && speechOutputSupported
              ? "Voice conversation mode"
              : "Voice mode needs browser speech input and speech output support"
          }
        >
          <span className={styles.voiceModeDot} />
          {voiceMode ? "Voice mode on" : "Voice mode"}
        </button>
        {voiceMode && (
          <span className={styles.voiceHint}>
            Tap the mic, speak, and I will answer aloud.
          </span>
        )}
      </div>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about projects, skills, GitHub, or contact..."
          rows={1}
          disabled={isLoading}
          aria-label="Chat message"
        />
        <button
          className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ""}`}
          onClick={handleVoiceToggle}
          disabled={!voiceSupported || isLoading}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          title={voiceSupported ? "Voice input" : "Voice input is not supported in this browser"}
          type="button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <path d="M12 19v3" />
          </svg>
        </button>
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      {remaining < 100 && (
        <div
          className={`${styles.charCount} ${remaining < 20 ? styles.warn : ""}`}
        >
          {remaining} characters remaining
        </div>
      )}
    </div>
  );
};

export default ChatInput;
