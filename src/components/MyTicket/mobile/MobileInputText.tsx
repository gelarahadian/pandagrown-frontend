import React, { useState, useRef, useEffect } from 'react';
import { FaSpinner, FaPaperPlane } from 'react-icons/fa';
import 'styles/ticket.scss'

interface MobileInputTextProps {
  isSending: boolean,
  onSendMessage: (message: string) => void;
}

const MobileInputText: React.FC<MobileInputTextProps> = ({ isSending, onSendMessage }) => {
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
    // if (e.key === 'Enter') {
    //   if (e.ctrlKey || e.metaKey) {
    //     e.preventDefault();
    //     setInputText(inputText + '\n');
    //     adjustInputHeight(true);
    //   } else if (!e.shiftKey) {
    //     e.preventDefault();
    //     if (inputText.trim() !== '') {
    //       onSendMessage(inputText);
    //       setInputText('');
    //       if (inputRef.current) {
    //         inputRef.current.style.height = '24px';
    //       }
    //     }
    //   }
    // }
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
    <div className="px-5 pt-5">
      <div className='flex rounded px-5 py-3 border-black/10 border'>
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="write your reply here..."
        className='ticket-reply h-14 p-0 pr-9 w-full resize-none border-none bg-transparent '
        style={{ maxHeight: "200px", height: '24px' }}
      />
      </div>
      <div className="absolute pl-5 bottom-2 right-7">
        <button disabled={!inputText.trim() || isSending} onClick={handleSendMessage} className={`${(!inputText.trim() || isSending) ? '!bg-transparent text-black/10' : 'bg-green/90 text-white'} p-2 rounded`} ><FaPaperPlane className="h-5 w-5"/></button>
      </div>
    </div>
  );
};

export default MobileInputText;
