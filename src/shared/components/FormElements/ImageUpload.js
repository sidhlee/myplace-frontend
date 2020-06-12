import React, { useRef } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const filePickerRef = useRef();

  const pickedHandler = (e) => {
    console.log(e.target);
  };

  const pickImageHandler = () => {
    // click on the hidden file input to open up the file picker
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      {/* Hide default file picker by default */}
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpb,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          <img src="" alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
