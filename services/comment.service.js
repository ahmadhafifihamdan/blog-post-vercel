const { db } = require("../config/firebase");
const { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDoc } = require("firebase/firestore");

const createCommentAndAttachToBlog = async(blogId, commentText, userEmail) => {
    const colRef = collection(db, "comments");
    
    // Adding comment and identify comment from docRef.id
    const docRef = await addDoc(colRef, {
        blogId: blogId,
        commentText: commentText,
        userEmail: userEmail,
        createdAt: serverTimestamp()
    });

    // current blog to attach comment to
    const blogRef = doc(db, "blogs", blogId);
    await updateDoc(blogRef, {
        commentIds: arrayUnion(docRef.id)
    })
}

const getCommentsByIds = async (commentIds) => {
  if (!commentIds || commentIds.length === 0) return [];

  // fetch all in parallel
  const snapshots = await Promise.all(
    commentIds.map((id) => getDoc(doc(db, "comments", id)))
  );

  // skip missing
  const comments = snapshots
    .filter((snap) => snap.exists())
    .map((snap) => { 
        const data = snap.data();
        return {
            id: snap.id,
            ...data,
            createdAtText: data.createdAt ? data.createdAt.toDate().toLocaleString() : "",
        };
    });

  // sort by createdAt desc (Firestore Timestamp -> millis)
  comments.sort((a, b) => {
    const aMs = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const bMs = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return bMs - aMs;
  });

  return comments;
};

module.exports = {
    createCommentAndAttachToBlog,
    getCommentsByIds
}