'use client';
import { UserContext } from '@/lib/context';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, DocumentData, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { NextPage } from 'next';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import ConfirmationModal from '@/components/AsyncConfirmationModal';
import { createHash } from 'crypto';
import toast from 'react-hot-toast';

interface EditAccommodationProps {
  params: {
    accommodationId: string;
  };
}

const EditAccommodation: NextPage<EditAccommodationProps> = ({ params }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([] as File[]);
  const [photosUrls, setPhotosUrls] = useState([] as string[]);
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [price, setPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [accommodation, setAccommodation] = useState({} as DocumentData);
  const [receivedData, setData] = useState(false);


  const { user } = useContext(UserContext);

  useEffect(() => {
    (async () => { 
      const accommodationRef = await getDoc(doc(db, "accommodations", params.accommodationId));
      if (accommodationRef.exists()) {
        setAccommodation(accommodationRef.data());
        setData(true);
      }
    })();
    if (accommodation) {
      setTitle(accommodation.title);
      setLocation(accommodation.location);
      setDescription(accommodation.description);
      setNumberOfRooms(accommodation.numberOfRooms);
      if (accommodation.photos) {
        setPhotosUrls(accommodation.photos);
      }
      setPrice(accommodation.price);
    }
  }, [receivedData]);


  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target != null && e.target.files != null) {
      const files = [];
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files[i]);
      }
      setPhotos(files);
    }
  };

  // Will only remove the link from the object at the time
  const handleRemovePhoto = async (photoUrl: string) => {
    const photosWithRemoved = photosUrls.filter(url => url != photoUrl);
    try {
      const documentReference = doc(db, "accommodations", params.accommodationId)
      const document = await getDoc(documentReference)
      if (document.exists()) {
        const documentData = document.data()
        documentData.photos = photosWithRemoved;
        await setDoc(documentReference, documentData); 
        setPhotosUrls(photosWithRemoved);
        toast.success("Successfully removed photo!");
      } else {
        toast.error("The document requested to modify does not exists!");
      }
    } catch(e) {
        toast.error("Could not remove photo! Error: "+e);
    }
  }

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

      await setDoc(doc(db, "accommodations", params.accommodationId), {
        uid: user.uid,
        title,
        location,
        description,
        numberOfRooms,
        price,
        photos: images, // set the photos url
      });

      // Reset the form
      setPhotosUrls(photosUrls.concat(images));
      setPhotos([]);
      setShowModal(false);

      toast.success("Successfully modified accommodation!")
    } catch (e) {
      toast.error("Could not create accommodation, contact Admin! Error: "+e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Accommodation</h2>
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
          { photosUrls.length > 0 ?
          <div className="mb-4">
            <label className="block text-gray-700">Existing Photos</label>
            <div className="flex flex-wrap gap-2">
              {photosUrls.map((photo, index) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`photo-${index}`} className="w-24 h-24 object-cover rounded" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => handleRemovePhoto(photo)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          : null}
          <div className="mb-4">
            <label className="block text-gray-700">Upload Photos</label>
            <input
              type="file"
              onChange={handlePhotoUpload}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              multiple
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
            Update
          </button>
        </form>
      </div>
      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirm Update"
        description="Are you sure you want to update this accommodation?"
      />
    </div>
  );
};

export default EditAccommodation;
