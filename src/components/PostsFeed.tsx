'use client';

import { db } from "@/lib/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PostsFeed() {
  const [posts, setPosts] = useState([] as DocumentData[]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, 'accommodations'));
      const postsData = querySnapshot.docs.map(doc => doc.data());
      setPosts(postsData);
    })();
  }, []);

  return (
    <section className="grid grid-cols-3 gap-4">
      {posts.map((post, index) => {
        return (
          <div key={`post${index}`} className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <p className="text-lg">{post.description}</p>
            {post?.photos && post.photos.length > 0 ?
            post.photos.map((image: string, jndex: number) => {
              return <Image key={`${index}_img_${jndex}`} src={image} width={100} height={100} alt={`Image ${index + 1}`} className="inline-block" />
            })
            :
            <div className="w-[100px] h-[100px]">
              <Image src={"/no-image.png"} width={80} height={80} alt="No Images" />
            </div>
            }
            <p className="text-sm">Starting at: {post.price} RON per room</p>
          </div>
        )}
      )}
    </section>
  );
}