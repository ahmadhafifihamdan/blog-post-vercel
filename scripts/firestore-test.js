const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

async function main() {
  // Use a dedicated dev-only collection
  const col = collection(db, "__devtest");

  // C: Create
  const ref = await addDoc(col, { message: "hello", step: "create" });
  console.log("Created:", ref.id);

  // R: Read
  const createdSnap = await getDoc(ref);
  console.log("Read exists:", createdSnap.exists(), createdSnap.data());

  // U: Update
  const sameDocRef = doc(db, "__devtest", ref.id);
  await updateDoc(sameDocRef, { step: "update" });

  const updatedSnap = await getDoc(sameDocRef);
  console.log("Updated:", updatedSnap.data());

  // D: Delete
  await new Promise(r => setTimeout(r, 15000)); // 15 seconds
  await deleteDoc(sameDocRef);

  const deletedSnap = await getDoc(sameDocRef);
  console.log("Deleted exists:", deletedSnap.exists());

  console.log("Firestore CRUD: OK");
}

main().catch((err) => {
  console.error("Firestore CRUD: FAIL");
  console.error(err);
  process.exit(1);
});
