import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, PostCard } from "../components";
import apiService from "../api/conf";
import authService from "../api/auth";
import { useSelector } from "react-redux";

function PublicProfile() {
  const { authorName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState(null);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    apiService.getallPosts().then((postsResponse) => {
      if (postsResponse) {
        const userPosts = postsResponse.documents.filter(
          (post) => (post.authorName || 'Contributor') === authorName
        );
        setPosts(userPosts);
      }
      setLoading(false);
    });

    if (authStatus) {
      authService.getPrefs().then((p) => {
        setPrefs(p);
      });
    }
  }, [authorName, authStatus]);

  const toggleFollow = async () => {
    if (!prefs) return;
    const currentFollowing = prefs.following || [];
    const newFollowing = currentFollowing.includes(authorName)
      ? currentFollowing.filter(name => name !== authorName)
      : [...currentFollowing, authorName];
    
    const newPrefs = { ...prefs, following: newFollowing };
    setPrefs(newPrefs);
    await authService.toggleFollow(authorName);
  };

  const isFollowing = prefs?.following?.includes(authorName);

  if (loading) {
    return (
      <div className="w-full py-20 text-center min-h-screen bg-white">
        <h1 className="text-3xl font-serif font-black animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full py-16 bg-white min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-brand-orange text-white flex items-center justify-center text-4xl font-bold shadow-md">
                {authorName ? authorName[0].toUpperCase() : "U"}
              </div>
              <div>
                <h1 className="text-4xl font-black text-brand-dark">{authorName}</h1>
                <p className="text-gray-500 font-bold mt-2">Writer & Contributor on Thoughts.</p>
              </div>
            </div>
            {authStatus && (
              <button 
                onClick={toggleFollow}
                className={`px-6 py-2 rounded-full font-black text-sm transition-all shadow-sm hover:-translate-y-0.5 ${isFollowing ? 'bg-brand-purple text-white shadow-md' : 'border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white'}`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Posts Feed */}
          <h2 className="text-2xl font-black text-brand-dark mb-8">
            Stories by {authorName} ({posts.length})
          </h2>
          <div className="flex flex-col gap-6 border-t border-gray-100 pt-8">
            {posts.length === 0 ? (
              <p className="text-gray-500 italic py-8">This author hasn't published any stories yet.</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.$id} {...post} />
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PublicProfile;
