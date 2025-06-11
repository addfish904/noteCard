// import { useEffect, useState } from "react";
// import { Tag } from "@/types/tag";
// import { db } from "@/lib/firebase";
// import { collection, onSnapshot, query, where } from "firebase/firestore";


// export const useFetchTags = (userId: string | undefined) => {
//     const [tags, setTags] = useState<Tag[]>([]);
  
//     useEffect(() => {
//       if (!userId) return;
//       const q = query(collection(db, "tags"), where("userId", "==", userId));
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const fetchedTags = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Tag[];
//         setTags(fetchedTags);
//       });
  
//       return () => unsubscribe();
//     }, [userId]);
  
//     return tags;
//   };
  