import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { registerUser, signIn, signInWithGoogle } from "@/lib/auth";
import { MdAccountCircle, MdEmail, MdLock } from "react-icons/md";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistering) {
      await signIn(formData.email, formData.password);
    } else {
      //validate
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await registerUser(formData.email, formData.password);
    }
  }

  return (
    <>
      <form className="px-8 py-4 mx-auto mt-10 bg-gray-200 shadow-md select-none rounded-xl mb-4 w-96" onSubmit={handleSubmit}>
          <MdAccountCircle className="mx-auto mb-6 w-28 h-28 text-gray-800" />
          <p className="text-lg mb-2">Enter your account credentials:</p>
          <label className="flex items-center w-full p-2 mb-2 border-gray-700 rounded-lg bg-white">
              <span>
                  <MdEmail className="w-8 h-8 pr-2 text-gray-500 border-r" />
              </span>
              <input type="email" name="email" id="email" className="flex-1 px-3 text-lg bg-transparent focus:outline-none" placeholder="Your E-mail" required value={formData.email} onChange={handleChange} />
          </label>
          <label className="flex items-center w-full p-2 mb-2 border-gray-700 rounded-lg bg-white">
          <span>
              <MdLock  className="w-8 h-8 pr-2 text-gray-500 border-r" />
          </span>
          <input type="password" name="password" id="password" className="flex-1 px-3 text-lg bg-transparent focus:outline-none" placeholder="Password" required value={formData.password} onChange={handleChange} />
          </label>

          {isRegistering && (
            <label className="flex items-center w-full p-2 mb-1 border-gray-700 rounded-lg bg-white">
              <span>
                  <MdLock  className="w-8 h-8 pr-2 text-gray-500 border-r" />
              </span>
              <input type="password" name="confirmPassword" id="confirmPassword" className="flex-1 px-3 text-lg bg-transparent focus:outline-none" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
            </label>
          )}

          <button className="w-full py-2 mt-4 text-xl font-bold text-white duration-200 rounded-lg bg-gray-800 hover:bg-gray-600">Submit</button>
          {isRegistering ? 
            <p className="text-sm font-semibold mt-4">Already have an account?&nbsp;  
              <button type="button" onClick={() => setIsRegistering(false)} className="text-blue-500">Log in</button>
            </p>
            :
            <p className="text-sm font-semibold mt-4">Don't have an account?&nbsp;
              <button type="button" onClick={() => setIsRegistering(true)} className="text-blue-500">Sign up</button>
            </p>
          }
      </form>
      <button onClick={signInWithGoogle} className="bg-gray-200 font-semibold px-4 py-1 text-lg rounded-md">
        <FcGoogle className="inline-block text-2xl mr-2" />
        Sign in with Google
      </button>
    </>
  )
}