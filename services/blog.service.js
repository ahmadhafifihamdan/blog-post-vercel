const { db } = require("../config/firebase");
const { collection, query, orderBy, limit, getDocs, doc, getDoc, startAfter, addDoc, serverTimestamp } = require("firebase/firestore");

// Helper function to normalize blog
function normalizeBlog(DocumentSnapshot) {
    const data = DocumentSnapshot.data();

    return {
        id: DocumentSnapshot.id,
        ...data,
        likeCount: typeof data.likeCount === "number" ? data.likeCount : 0,
        commentIds: Array.isArray(data.commentIds) ? data.commentIds : [],
        imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    };
}

const getLatestBlog = async () => {
    const docRef = collection(db, "blogs");
    const q = query(docRef, orderBy("createdAt", "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if(snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    
    return normalizeBlog(docSnap);    
};

const getBlogById = async (blogId) => {
    const docRef = doc(db, "blogs", blogId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;
    
    return normalizeBlog(snapshot);
};
    
const getNextBlog = async (blogId) =>{
    const currentBlog = await getBlogById(blogId);
    if (!currentBlog || !currentBlog.createdAt) return null;
    const docRef = collection(db, "blogs");
    const q = query(docRef, orderBy("createdAt", "desc"), startAfter(currentBlog.createdAt), limit(1));
    const snapshot = await getDocs(q);
    
    if(snapshot.empty) return null;

    const docSnap = snapshot.docs[0];

    return normalizeBlog(docSnap);
}

const createNewBlog = async(blogContent, imageUrl) => {
    const col = collection(db, "blogs");
    const ref = await addDoc(col, { 
        ...blogContent,
        imageUrl,
        createdAt: serverTimestamp()
    });

    return ref.id;
}

module.exports = {
    getLatestBlog,
    getBlogById,
    getNextBlog,
    createNewBlog
}