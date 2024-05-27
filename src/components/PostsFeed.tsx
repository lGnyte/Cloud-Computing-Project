'use client';

import { db } from "@/lib/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PostsFeed(props: {usertype?: string}) {
  const [posts, setPosts] = useState([] as DocumentData[]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, 'accommodations'));
      const postsData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
      setPosts(postsData);
    })();
  }, []);

  return (
    <section className="grid grid-cols-3 gap-4">
      {posts.map((post, index) => {
        return (
          <div key={`post${index}`} className="bg-gray-100 p-4 rounded-md border border-gray-300 shadow-md">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <p className="text-lg">{post.description}</p>
            <div>
              {post?.photos && post.photos.length > 0 ?
              post.photos.map((image: string, jndex: number) => {
                return <Image key={`${index}_img_${jndex}`} src={image} width={100} height={100} alt={`Image ${index + 1}`} className="w-[100px] h-[100px] inline-block" />
              })
              :
                <Image src={"/no-image.png"} width={100} height={100} alt="No Images" className="w-[100px] h-[100px]" />
              }
            </div>
            <p className="text-sm mb-2">Starting at: {post.price} RON per room</p>
            {props.usertype === "guest" ?
              <Link href={`display_accommodation/${post.id}`} className="bg-gray-800 hover:bg-gray-500 rounded-md duration-200 px-4 py-2 text-white font-semibold mt-2">View Experience</Link>
              : props.usertype !== "host" &&
              <button disabled className="px-2 py-1 bg-gray-300 cursor-not-allowed rounded-md">Sign In to view</button>
            }
          </div>
        )}
      )}
    </section>
  );
}