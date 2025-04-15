import axiosService from 'app/services/axios.service';

const FILE_BASE_URL = '/v1/files';
const USER_BASE_URL = '/v1/users';
const UPLOAD_BASE_URL = '/v1/upload';

const ApiUploadS3 = async payload => {
  const { file, path } = payload;
  const data = new FormData();
  data.append('file', file);
  data.append('path', path);
  const response = await axiosService.post(`${FILE_BASE_URL}/upload`, data);

  return response?.data;
};

const UploadAvatar = async payload => {
  const { file } = payload;
  const data = new FormData();
  data.append('file', file);
  const response = await axiosService.put(`${USER_BASE_URL}/avatar`, data);

  return response?.data;
};

const UploadCover = async payload => {
  const { file } = payload;
  const data = new FormData();
  data.append('file', file);
  const response = await axiosService.put(`${USER_BASE_URL}/cover`, data);

  return response?.data;
};

const uploadArrayFileToS3 = async payload => {
  const { files, path } = payload;
  const data = new FormData();
  files.map(file => data.append('files', file));
  data.append('path', path);
  const response = await axiosService.post(UPLOAD_BASE_URL, data);

  return response?.data;
};

export { ApiUploadS3, uploadArrayFileToS3, UploadAvatar, UploadCover };
