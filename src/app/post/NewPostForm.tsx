'use client';

import { UserContext } from "@/lib/context";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function NewPostForm() {
  const router = useRouter();
  const [formValuePostTitle, setFormValuePostTitle] = useState('');
  const [formValuePostDescription, setFormValuePostDescription] = useState('');
  const [_loading, _setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const handleChangePostTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValuePostTitle(e.target.value);
  }

  const handleChangePostDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValuePostDescription(e.target.value);
  }
 
  const [formValueImages, setFormValueImages] = useState<FileList | null>(null);

  const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.files;
    setFormValueImages(val);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let images = [];
    
    if (formValueImages !== null) {
        for(let i = 0; i < formValueImages.length; i++) {
            const buffer = await formValueImages.item(i)?.arrayBuffer();
            const name = formValueImages.item(i)?.name;
            const storageUri = `images/${name}`;
            const storageRef = ref(storage, storageUri);
            if (buffer !== undefined) {
              await uploadBytesResumable(storageRef, buffer);
              images.push(await getDownloadURL(storageRef));
            }
        }
    }

    const postRef = await addDoc(collection(db, 'posts'), 
        {uid: user.uid, post_title: formValuePostTitle, post_description: formValuePostDescription, images}
    );

    toast.success(`Succesfully created new post ID: ${postRef.id}!`);
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-[400px] [&>label]:font-semibold">
      <label htmlFor="post-title">Post Title:</label>
      <input type="text" name="post-title" id="post-title" className="px-2 py-1 bg-gray-300 rounded-md" value={formValuePostTitle} onChange={handleChangePostTitle} />
      <br />
      <label htmlFor="post-description">Post Description:</label>
      <textarea name="post-description" id="post-description" className="px-2 py-1 bg-gray-300 rounded-md" onChange={handleChangePostDescription} value={formValuePostDescription} />
      <br />
      <label htmlFor="photos">Photos:</label>
      <input className="mb-4" type="file" id="photos" multiple accept="image/*" onChange={handleChangeImages}/>
      <button type="submit" className="bg-gray-300 w-28 py-1 font-bold text-lg rounded-md">Submit</button>
    </form>
  )
}
