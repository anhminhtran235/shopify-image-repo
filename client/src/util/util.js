import { useCallback, useRef } from 'react';
import { debounce } from 'lodash';

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const shortenFileName = (filename, maxNameLength = 25) => {
  const name = filename.substring(0, filename.lastIndexOf('.') + 1);
  const extension = filename.substring(
    filename.lastIndexOf('.') + 1,
    filename.length
  );

  if (name.length > maxNameLength) {
    return name.substring(0, maxNameLength) + '...' + extension;
  }

  return filename;
};

export const useDebouncedCallback = (callback, delay) => {
  const callbackRef = useRef();
  callbackRef.current = callback;
  return useCallback(
    debounce((...args) => callbackRef.current(...args), delay),
    []
  );
};

export const boldIfMatch = (text, strToMatch) => {
  const startIndex = text.toLowerCase().indexOf(strToMatch.toLowerCase());
  const endIndex = startIndex + strToMatch.length;
  if (startIndex === -1) {
    return text;
  }
  const boldText = <b>{text.substring(startIndex, endIndex)}</b>;
  return (
    <>
      {text.substring(0, startIndex)}
      {boldText}
      {text.substring(endIndex)}
    </>
  );
};
