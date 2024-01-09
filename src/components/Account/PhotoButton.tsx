import React, { useState, useRef, useEffect } from 'react';
import camera from 'assets/Camera.svg';
import { useMobileContext } from 'context/MobileContext';

interface PhotoButtonProps {
  setFile: (image: File) => void,
  onSelect: () => void,
  defaultImage: string | null;
};

function PhotoButton({ setFile, onSelect, defaultImage } : PhotoButtonProps) {
  const isMobile = useMobileContext();
  const buttonSize = isMobile ? '124' : '157';
  const iconSize = isMobile ? 45 : 24;
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const imgInput = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // set to parent's file
      onSelect();
      setImage(URL.createObjectURL(e.target.files[0])); // preview
    }
  };

  const selectImage = () => {
    if (imgInput.current)
      imgInput.current.click();
  }

  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage);
    }
  }, [defaultImage]);

  if (isMobile) {
    return (
      <div className='w-full'>
        <input type="file" onChange={handleImageChange} ref={imgInput} className='hidden' />
        <button
          type="button"
          onClick={selectImage}
          className="relative bg-gray rounded-5 w-full cursor-pointer"
          style={{ paddingTop: '100%' }}
        >
          <label className="bg-white rounded-full absolute top-0 h-full w-full flex overflow-hidden">
            {image ? (
              <img src={image} alt="User's profile" className='mx-auto object-cover'/>
            ) : (<img
              src={camera}
              className=" m-auto"
              style={{ height: iconSize + 'px', width: iconSize + 'px' }}
            />
            )}
          </label>
        </button>
      </div>
    );
            }

  return (
    <div>
      <input type="file" onChange={handleImageChange} ref={imgInput} className='hidden' />
      <button
        type="button"
        onClick={selectImage}
        className="bg-gray rounded-5 float-left cursor-pointer btn-photo"
        style={{ height: buttonSize + 'px', width: buttonSize + 'px' }}
      >
        <label className="bg-white rounded-full h-full w-full flex overflow-hidden">
          {image ? (
            <img src={image} alt="User's profile" className='mx-auto object-cover'/>
          ) : (<img
            src={camera}
            className="m-auto"
            style={{ height: iconSize + 'px', width: iconSize + 'px' }}
          />
          )}
        </label>
      </button>
    </div>
  );
}

export default PhotoButton;