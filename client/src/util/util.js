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
