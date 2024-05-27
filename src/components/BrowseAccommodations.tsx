import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"

export default function BrowseAccommodations(props: {posts: any[]}) {
  const [searchQuery, setSearchQuery]= useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [filteredPosts, setFilteredPosts] = useState([] as any[]);

  const handleChange = (e: any) => setSearchQuery(e.target.value.toLowerCase())



  useEffect(() => {
    // console.log(debouncedQuery)
    setFilteredPosts(props.posts.filter((post) => {
      return post.location.toLowerCase().includes(searchQuery)
    }))
  }, [debouncedQuery])

  useEffect(() => {
    console.log("Filtered posts", filteredPosts)
  }, [filteredPosts]);

  return (
    <div className="mb-10">
      <label className="text-lg mr-2" htmlFor="search">Browse by location:</label>
      <input type="text" name="search" id="search" value={searchQuery} onChange={handleChange} className="p-2 border rounded-md" />
    </div>
  )
}