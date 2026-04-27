const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");

const uploadBlogImageToStorage = async (file) => {
  const storagePath = `blogs/${Date.now()}-${file.originalname}`;

  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file.buffer, {
    contentType: file.mimetype,
  });

  const imageUrl = await getDownloadURL(storageRef);

  return { imageUrl, storagePath } ;
};

module.exports = { uploadBlogImageToStorage };
