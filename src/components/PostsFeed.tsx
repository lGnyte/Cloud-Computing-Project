'use client';

import { db } from "@/lib/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PostsFeed() {
  const [posts, setPosts] = useState([] as DocumentData[]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => doc.data());
      setPosts(postsData);
    })();
  }, []);

  return (
    <section className="grid grid-cols-3 gap-4">
      {posts.map((post, index) => {
        if(!post.hasOwnProperty('post_title') || !post.hasOwnProperty('post_description')) {
          return null;
        }

        return (
          <div key={`post${index}`} className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-bold">{post.post_title}</h3>
            <p className="text-lg">{post.post_description}</p>
            {post?.images && post.images.length > 0 && post.images.map((image: string, jndex: number) => {
              return <Image key={`${index}_img_${jndex}`} src={image} width={100} height={100} alt={`Image ${index + 1}`} className="inline-block" />
            })}
          </div>
        )}
      )}
    </section>
  );
}