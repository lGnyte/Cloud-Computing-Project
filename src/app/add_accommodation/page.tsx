'use client';

import { ChangeEvent, FormEvent, useState, useContext } from "react";
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import toast from "react-hot-toast";
import { UserContext } from '@/lib/context';
import { createHash } from "crypto";
import ConfirmationModal from "@/components/AsyncConfirmationModal";
import AuthCheck from "@/components/AuthCheck";
import { useRouter } from "next/navigation";

export default function AddAccommodation() {
  const [location, setLocation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [numberOfRooms, setNumberOfRooms] = useState<number>(1);
  const [price, setPrice] = useState<number>(100);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { user } = useContext(UserContext);
  const router = useRouter();

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Generate a unique ID and add the location data to Firestore
    try {

      let images = [];

      for(let i = 0; i < photos.length; i++) {
        const buffer = await photos[i].arrayBuffer();
        const name = photos[i].name;
        const hashName = createHash('sha256')
                      .update(new Uint8Array(buffer))
                      .digest('hex');
        const extension = name.split('.').pop();
        const storageUri = `accommodations/${hashName}.${extension}`;
        const storageRef = ref(storage, storageUri);
        if (buffer !== undefined) {
          await uploadBytesResumable(storageRef, buffer);
          images.push(await getDownloadURL(storageRef));
        }
      }
      
      await addDoc(collection(db, 'accommodations'), {
        uid: user.uid,
        title,
        location,
        description,
        numberOfRooms,
        price,
        photos: images, // set the photos url
      });

      // Reset the form
      setTitle('');
      setLocation('');
      setDescription('');
      setPhotos([]);
      setNumberOfRooms(1);
      setPrice(100);
      setShowModal(false);

      toast.success("Successfully created accommodation!")
      router.push('/my_accommodations');
    } catch (e) {
      toast.error("Could not create accommodation, contact Admin! Error: "+e);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };


  return (
    <AuthCheck usertype="host">
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Add accommodation</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Location
                <span className="text-gray-500 text-sm ml-2">
                  (e.g., Brasov, Brasov, Romania)
                </span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                rows={4}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload Photos</label>
              <input
                type="file"
                onChange={handlePhotoUpload}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                multiple
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Number of Rooms</label>
              <input
                type="number"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(Number(e.target.value))}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price per Room</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Submit
            </button>
          </form>
        </div>
          <ConfirmationModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleSubmit}
          title="Confirm Submission"
          description="Are you sure you want to submit this accommodation?"
          />
      </div>
    </AuthCheck>
  );
}
