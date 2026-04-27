const { storage } = require("../config/firebase");
const { ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");

async function main() {
  const filename = `__devtest/${Date.now()}-hello.txt`;
  const fileRef = ref(storage, filename);

  // Upload a tiny file
  const data = Buffer.from("hello storage");
  await uploadBytes(fileRef, data, { contentType: "text/plain" });
  console.log("Uploaded:", filename);

  // Get a URL
  const url = await getDownloadURL(fileRef);
  console.log("Download URL:", url);

  // Optional cleanup: comment this out if you want to see the file in console
  await deleteObject(fileRef);
  console.log("Deleted:", filename);

  console.log("Storage upload + URL: OK");
}

main().catch((err) => {
  console.error("Storage test failed:");
  console.error(err);
  process.exit(1);
});
