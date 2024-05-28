'use client';
import { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { DocumentData, collection, deleteDoc, doc, getDocs} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserContext } from '@/lib/context';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/AsyncConfirmationModal';
import AuthCheck from "@/components/AuthCheck";

const MyAccommodations: React.FC = () => {
  const { user } = useContext(UserContext);
  const [accommodations, setAccommodations] = useState([] as (string | DocumentData)[]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState("");

  const handleGetAccommodations = useCallback(async () => {
      const querySnapshot = await getDocs(collection(db, 'accommodations'));
      const accommodations = querySnapshot.docs.filter(doc => (doc.get("uid") == user.uid)).map(doc => [doc.id, doc.data()]);
      setAccommodations(accommodations);
  }, [user.uid])
  
  useEffect(() => {

    handleGetAccommodations();
  }, [user, handleGetAccommodations]); // add the user context as dependency

  const handleDeleteAccommodation = async (key: string) => {
    try {
      const accommodationRef = doc(db, 'accommodations', key);
      await deleteDoc(accommodationRef);
      await handleGetAccommodations();
    } catch (e) {
      toast.error("Could not delete accommodation! Error: "+e);
    }
    setShowModal(false);
  };

  return (
    <AuthCheck usertype="host">
      <div className="mx-10 pt-6">
        <h1 className='text-4xl font-bold'>My Accommodations</h1>
        <div className="mt-8 mb-4">
          <Link href={"/add_accommodation"} className="bg-gray-800 hover:bg-gray-500 duration-200 text-white font-semibold py-2 px-4 rounded-md">
            New Accommodation
          </Link>
        </div>
        <hr className='my-4' />
        <div className='flex gap-6'>
          {!accommodations.length &&
            <div>
              You don&apos;t have any experiences posted yet.
            </div>
          }
          {accommodations.map((value) => (
            <div key={value.at(0)} className="flex w-[400px] gap-10 items-center justify-between border border-gray-200 p-4 rounded-md shadow-md">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{value.at(1).title}</h2>
                <p className="text-gray-600">{value.at(1).price} lei</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href={`/edit_accommodation/${value.at(0)}`} title='Edit Accommodation' className="text-blue-500 hover:text-blue-700">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <button className="text-red-500 hover:text-red-700" onClick={() => {setSelectedAccommodationId(value.at(0)); setShowModal(true)}} title='Delete Accommodation'>
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                      <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      </path> 
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <ConfirmationModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={async (_e) => await handleDeleteAccommodation(selectedAccommodationId)}
          title="Confirm Submission"
          description="Are you sure you want to delete this accommodation? Operation cannot be undone!"
        />
      </div>
    </AuthCheck> 
  );
};

export default MyAccommodations;

