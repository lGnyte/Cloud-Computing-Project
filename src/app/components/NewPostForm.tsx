'use client';

import { UserContext } from "@/lib/context";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useState } from "react";
import { Hash } from "crypto";
import toast from "react-hot-toast";

export default function NewPostForm() {
  const [formValuePostTitle, setFormValuePostTitle] = useState('');
  const [_isValid, setIsValidPostTitle] = useState(false);
  const [_loading, _setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const handleChangePostTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const regex = /^\w*$/;
    if (val.length < 5) {
      setIsValidPostTitle(false);
    }
    if (regex.test(val)) {
      setIsValidPostTitle(true);
    }
    setFormValuePostTitle(val);
  }
  
  const [formValuePostDescription, setFormValuePostDescription] = useState('');
  const [_isValidPostDescription, setIsValidPostDescription] = useState(false);

  const handleChangePostDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.toLowerCase();
    if (val.length < 20) {
      setIsValidPostDescription(false);
    }
    setFormValuePostDescription(val);
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
              uploadBytesResumable(storageRef, buffer);
              images.push(await getDownloadURL(storageRef));
            }
        }
    }

    const postRef = await addDoc(collection(db, 'posts'), 
        {uid: user.uid, post_title: formValuePostTitle, post_description: formValuePostDescription, images}
    );

    toast.success(`Succesfully created new post ID: ${postRef.id}!`);
  }

  const files = formValueImages ? [...formValueImages] : [];

  return (
    <form  onSubmit={handleSubmit}>
        <div className="flex flex-col p-20 m-10">
          <fieldset className="my-5">
            <label htmlFor="post-title" >Post Title:</label>
            <input type="text" name="post-title" id="post-title" className="px-2 py-1 bg-gray-300 mx-10 rounded-md" value={formValuePostTitle} onChange={handleChangePostTitle} />
          </fieldset>
          <fieldset className="my-5">
            <label htmlFor="post-description">Post Description:</label>
            <textarea name="post-description" id="post-description" className="px-2 py-1 mx-10 bg-gray-300 rounded-md" onChange={handleChangePostDescription} >
            {formValuePostDescription}
            </textarea>
          </fieldset>
          <fieldset>
            <label htmlFor="photos">Photos:</label>
            <input className="px-20" type="file" id="photos" multiple accept="image/*" onChange={handleChangeImages}/>
          </fieldset>
           <ul>
            {files.map((file, i) => (
              <li key={i}>
                {file.name} - {file.type}
              </li>
            ))}
          </ul>
          <div>
          <button type="submit" className="bg-gray-300 px-2 py-1 rounded-md">Submit</button>
          </div>
        </div>
    </form>
  )
}
