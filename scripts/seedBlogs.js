const { db } = require("../config/firebase");
const { collection, addDoc, serverTimestamp } = require("firebase/firestore");

async function seed() {
  const sampleBlogs = [
    {
      title: "Seed Post 1",
      content: "Seed content 1...",
      authorEmail: "seed@local.test",
      imageUrl: "",
      likeCount: 0,
      createdAt: serverTimestamp(),
    },
    {
      title: "Seed Post 2",
      content: "Seed content 2...",
      authorEmail: "seed@local.test",
      imageUrl: "",
      likeCount: 0,
      createdAt: serverTimestamp(),
    },{
      title: "Seed Post 3",
      content: "Seed content 3...",
      authorEmail: "seed@local.test",
      imageUrl: "",
      likeCount: 0,
      createdAt: serverTimestamp(),
    }
  ];

  const colRef = collection(db, "blogs");

  for (const blog of sampleBlogs) {
    const docRef = await addDoc(colRef, blog);
    console.log("Created blog:", docRef.id);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
