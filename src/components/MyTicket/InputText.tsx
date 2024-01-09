import React, { useState, useRef, useEffect } from 'react';
import { FaSpinner, FaPaperPlane } from 'react-icons/fa';
import 'styles/ticket.scss'

interface InputTextProps {
  isSending: boolean,
  onSendMessage: (message: string) => void;
}

const InputText: React.FC<InputTextProps> = ({ isSending, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    adjustInputHeight(false);
  };

  const adjustInputHeight = (state: boolean) => {
    if (inputRef.current) {
      inputRef.current.style.height = '24px'; // Set the default height to 24px

      const initialScrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = initialScrollHeight + 'px';
      
      // alert(inputRef.current.style.height);
      // Calculate the line count
      let lineCount = Math.floor((initialScrollHeight - 24) / 24);
      if(state) {
        lineCount++;
      }
      // alert(lineCount);
  
      // Set the height based on line count
      inputRef.current.style.height = 24 + lineCount * 24 + 'px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setInputText(inputText + '\n');
        adjustInputHeight(true);
      } else if (!e.shiftKey) {
        e.preventDefault();
        if (inputText.trim() !== '') {
          onSendMessage(inputText);
          setInputText('');
          if (inputRef.current) {
            inputRef.current.style.height = '24px';
          }
        }
      }
    }
  };

  useEffect(() => {
    if(!isSending) {
      setInputText('');
      if (inputRef.current) {
        inputRef.current.style.height = '24px';
      }
    }
  }, [isSending]);

  const handleSendMessage = () => {
    onSendMessage(inputText);
  }

  return (
    <div className="px-7 pt-5 pr-44">
      <div className='flex rounded px-5 py-3 border-black/10 border'>
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="write your reply here..."
        className='ticket-reply h-14 p-0 w-full resize-none border-none bg-transparent '
        style={{ maxHeight: "200px", height: '24px' }}
      />
      </div>
      <div className="absolute pl-5 bottom-0 right-7">
        <ButtonWithSpinner isSending={isSending} isDisable={!inputText.trim()} onClick={handleSendMessage} ><FaPaperPlane className="h-5 w-5 mr-2"/>Send</ButtonWithSpinner>
      </div>
    </div>
  );
};

interface ButtonWithSpinnerProps {
  isSending: boolean;
  isDisable: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isSending,
  isDisable,
  onClick,
  children,
}) => {
  return (
    <button disabled={isSending || isDisable} className={`${isDisable? '' : '!bg-green '} w-32 h-11 justify-center py-2 rounded-full text-white flex items-center`} onClick={onClick}>
      {isSending ? <FaSpinner className="spinner m-auto text-xl" /> : children}
    </button>
  );
};

export default InputText;
