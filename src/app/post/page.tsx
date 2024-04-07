import AuthCheck from "@/components/AuthCheck";
import NewPostForm from "./NewPostForm";

export default function Post() {

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-8">Create a New Post</h1>
      <AuthCheck>
        <NewPostForm/>
      </AuthCheck>
    </main>
  );
}
