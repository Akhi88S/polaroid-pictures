// App.js
import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import html2canvas from 'html2canvas';
import './App.css';

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [customText, setCustomText] = useState('');
  const [textOptions, setTextOptions] = useState({
    fontSize: '18px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    color: '#000000',
  });
  const [photoDimensions, setPhotoDimensions] = useState({ width: 300, height: 350 });
  const [optionsVisible, setOptionsVisible] = useState(false);

  const imageRef = useRef();

  useEffect(() => {
    if (imageRef.current) {
      const { width, height } = imageRef.current;
      setImageDimensions({ width, height });
      console.log(imageDimensions)
    }
  }, [uploadedImage,imageDimensions]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleUpload(acceptedFiles),
  });

  const handleUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setUploadedImage(reader.result);

      const image = new Image();
      image.src = reader.result;

      image.onload = () => {
        setImageDimensions({ width: image.width, height: image.height });
      };
    };

    reader.readAsDataURL(file);
    setOptionsVisible(true);
  };

  const handleTextChange = (event) => {
    setCustomText(event.target.value);
  };

  const handleTextOptionsChange = (option, value) => {
    setTextOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
  };

  const handleDimensionsChange = (dimension, value) => {
    setPhotoDimensions((prevDimensions) => ({
      ...prevDimensions,
      [dimension]: value,
    }));
  };

const handleDownload = () => {
  if (!uploadedImage) return;

  html2canvas(document.getElementById('polaroid')).then((canvas) => {
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'polaroid.png';

    // Trigger a click event on the link to initiate the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

  const polaroidStyle = {
    position: 'relative',
    border: '1px solid #dddddd',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '40px',
    backgroundColor: 'white',
    padding: '10px',
    maxWidth: `${photoDimensions.width}px`,
    margin: '0 auto',
    overflow: 'hidden',
    transition: 'max-width 0.3s ease', /* Add smooth transition effect */
  };

  return (
    <div>
      <h1>Polaroid Print Generator</h1>

      <div id="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop a photo here, or click to select one</p>
      </div>

      {uploadedImage && (
        <div id="polaroid" style={polaroidStyle}>
          <img
            id="photo"
            ref={imageRef}
            src={uploadedImage}
            alt="Uploaded"
            style={{ width: '100%', height: `${photoDimensions.height}px` }}
          />
          <div id="overlay"></div>
          <div
            id="customText"
            contentEditable
            style={{
              fontSize: textOptions.fontSize,
              fontFamily: textOptions.fontFamily,
              textAlign: textOptions.textAlign,
              color: textOptions.color,
            }}
            onInput={handleTextChange}
          >
            {customText}
          </div>
        </div>
      )}

      {uploadedImage && (
        <div id="options" className={optionsVisible ? 'visible' : ''}>
          <label>
            Custom Text:
            <input
              type="text"
              value={customText}
              onChange={handleTextChange}
            />
          </label>
          <label>
            Photo Width:
            <input
              type="number"
              value={photoDimensions.width}
              onChange={(e) => handleDimensionsChange('width', parseInt(e.target.value))}
            />
          </label>
          <label>
            Photo Height:
            <input
              type="number"
              value={photoDimensions.height}
              onChange={(e) => handleDimensionsChange('height', parseInt(e.target.value))}
            />
          </label>
          <label>
            Font Size:
            <input
              type="number"
              value={textOptions.fontSize.replace('px', '')}
              onChange={(e) => handleTextOptionsChange('fontSize', `${e.target.value}px`)}
            />
          </label>
          <label>
            Font Family:
            <select
              value={textOptions.fontFamily}
              onChange={(e) => handleTextOptionsChange('fontFamily', e.target.value)}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Impact, sans-serif">Impact</option>
            </select>
          </label>
          <label>
            Text Align:
            <select
              value={textOptions.textAlign}
              onChange={(e) => handleTextOptionsChange('textAlign', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label>
            Text Color:
            <input
              type="color"
              value={textOptions.color}
              onChange={(e) => handleTextOptionsChange('color', e.target.value)}
            />
          </label>
         
        </div>
      )}

       {uploadedImage && (
        <button
          id="downloadButton"
          className="downloadButton"
          onClick={handleDownload}
        >
          Download Polaroid
        </button>
      )}
    </div>
  );
};

export default App;
