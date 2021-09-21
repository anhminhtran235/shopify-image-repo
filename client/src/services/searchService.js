import axios from 'axios';

export const getLabels = (labelName) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.get('search/labels?name=' + labelName, config);
};
