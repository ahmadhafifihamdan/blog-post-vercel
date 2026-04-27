const { db } = require("../config/firebase");
const { setDoc, serverTimestamp, doc, deleteDoc, updateDoc, increment, getDoc } = require("firebase/firestore");

const toggleLike = async(blogId, userEmail) => {
    const likeId = `${blogId}_${userEmail}`;
    const likeDocRef = doc(db, "likes", likeId);
    const blogDocRef = doc(db, "blogs", blogId);

    // check if user already like the blog
    const snapshot = await getDoc(likeDocRef);
    if (snapshot.exists()) {
        // if exist, delete the like and decrement the like count from blogs
        await deleteDoc(likeDocRef);
        await updateDoc(blogDocRef, { likeCount: increment(-1) })
        return { isLiked: false }
    } else {
        // if doesnt exist, add the like and increment the like count
        await setDoc(likeDocRef, { 
            blogId,
            userEmail: userEmail,
            createdAt: serverTimestamp()
        });
        await updateDoc(blogDocRef, { likeCount: increment(1) })
        return { isLiked: true}
    }
}

const hasUserLiked = async (blogId, userEmail) => {
    const likeId = `${blogId}_${userEmail}`;
    const snap = await getDoc(doc(db, "likes", likeId));
    return snap.exists();
};

module.exports = {
    toggleLike,
    hasUserLiked 
}