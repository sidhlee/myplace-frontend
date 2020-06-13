import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const [file, setFile] = useState(); // store binary file data
  const [previewUrl, setPreviewUrl] = useState(); // store url to parsed data
  const [isValid, setIsValid] = useState(false); // file validity

  const filePickerRef = useRef();

  // generates a preview
  useEffect(() => {
    if (!file) {
      return;
    }
    // Browser API
    const fileReader = new FileReader();
    // FileReader does not support Promise
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result); // parsed result is available at .result
    };
    // In order to render image, you need to pass the url to the data
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    // only handle when user picked one file
    if (e.target.files && e.target.files.length === 1) {
      // extract picked file available at e.target.files
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true); // will be set to true in the next render
      fileIsValid = true; // set manually
    } else {
      // if user picked no file or more than 1 file
      setIsValid(false); // will be set to false in the next render
      fileIsValid = true;
    }
    // send up the picked file and validity to consume in the parent & other components
    // send the manually-set validity to reflect the changes in this render (,not the state from next render)
    props.onInput(props.id, pickedFile, fileIsValid);
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
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
