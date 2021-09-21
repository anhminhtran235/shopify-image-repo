import axios from 'axios';

export const fetchImages = (offset, limit, searchText, label) => {
  return axios.get(
    `search?offset=${offset}&limit=${limit}&searchText=${searchText}&label=${label}`
  );
};

export const uploadImage = (imageBase64, filename, tempUUID) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token'),
    },
  };
  const body = JSON.stringify({
    imageBase64,
    filename,
    tempUUID,
    runAWSRecoknition: true, // During most TEST cases this boolean will be false
  });
  return axios.post('images/upload', body, config);
};

export const deleteImages = (imageUUIDs) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token'),
    },
    data: JSON.stringify({ imageUUIDs }),
  };
  return axios.delete('images', config);
};

export const deleteAllImages = (userUUID) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token'),
    },
    data: JSON.stringify({ userUUID }),
  };
  return axios.delete('images/all', config);
};
