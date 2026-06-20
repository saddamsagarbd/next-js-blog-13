import Link from "next/link";
import PostCard from "./../../../components/PostCard.jsx";

async function getPost(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

    if(!res.ok) return null;

    return res.json();
}
const BlogDetailsPage = async ( { params } ) => {
    const { id } = await params;
    const post = await getPost(id);
    if(!post) return (
        <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Post not found</p>
            <Link href="/" className="text-indigo-600 hover:underline mt-2 inline-block">
                Back to Home page
            </Link>
        </div>
    );
    return (
        <div>
            <PostCard post={post} />
            <Link href="/" className="text-indigo-600 hover:underline mt-2 inline-block">
                Back to All post
            </Link>
        </div>
    )
}

export default BlogDetailsPage;