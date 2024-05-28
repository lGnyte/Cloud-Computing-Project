import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { SlLocationPin } from "react-icons/sl";
import { useDebounce } from "use-debounce"

export default function BrowseAccommodations(props: {posts: any[]}) {
  const [searchQuery, setSearchQuery]= useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [filteredPosts, setFilteredPosts] = useState([] as any[]);
  const router = useRouter();

  const handleChange = (e: any) => setSearchQuery(e.target.value.toLowerCase())

  const handleResultClick = (postId:string) => {
    router.push(`/display_accommodation/${postId}`);
  }

  useEffect(() => {
    setFilteredPosts(props.posts.filter((post) => {
      return post.location.toLowerCase().includes(debouncedQuery) ||
        post.title.toLowerCase().includes(debouncedQuery)
    }))
  }, [debouncedQuery, props.posts])

  useEffect(() => {
    console.log("Filtered posts", filteredPosts)
  }, [filteredPosts]);

  return (
    <div className="mb-10">
      <label className="text-lg mr-2" htmlFor="search">Browse by location or name:</label>
      <input type="text" name="search" placeholder="e.g. Iasi" id="search" value={searchQuery} onChange={handleChange} className="p-2 border rounded-md" />
      <ul className={`absolute border rounded-md ml-2 w-[300px] [&>li]:p-2 [&>li]:rounded-md [&>li]:bg-white  ${debouncedQuery !== "" ? "inline-block" : "hidden"}`}>
        {filteredPosts.length === 0 && <li className="">No results.</li>}
        {filteredPosts.map((post) => {
          return (
            <li key={post.id} className="cursor-pointer flex justify-between hover:bg-gray-100" onClick={() => handleResultClick(post.id)}>
              <span>{post.title}</span>
              <span className="text-sm text-gray-500"><SlLocationPin className="inline-block" /> {post.location}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}