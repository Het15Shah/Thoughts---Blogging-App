import React, { useEffect, useState } from "react";
import AppwriteService from "../appwrite/conf";
import { Container, PostCard, Logo } from "../components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import authService from "../appwrite/auth";

function Home() {
  const [posts, setPosts] = useState([]);
  const [prefs, setPrefs] = useState({ following: [], bookmarks: [], hidden: [] });
  const [activeTab, setActiveTab] = useState("For you");
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    AppwriteService.getallPosts().then((posts) => {
      if (posts) setPosts(posts.documents);
    });
    if (authStatus) {
      authService.getPrefs().then((p) => {
        setPrefs({
          following: p.following || [],
          bookmarks: p.bookmarks || [],
          hidden: p.hidden || []
        });
      });
    }
  }, [authStatus]);

  const handleTabClick = (tab) => setActiveTab(tab);

  const toggleBookmark = async (postId) => {
    const newBookmarks = prefs.bookmarks.includes(postId) 
      ? prefs.bookmarks.filter(id => id !== postId) 
      : [...prefs.bookmarks, postId];
    const newPrefs = { ...prefs, bookmarks: newBookmarks };
    setPrefs(newPrefs);
    await authService.toggleBookmark(postId);
  };

  const hidePost = async (postId) => {
    const newHidden = [...prefs.hidden, postId];
    const newPrefs = { ...prefs, hidden: newHidden };
    setPrefs(newPrefs);
    await authService.hidePost(postId);
  };

  const visiblePosts = posts.filter(p => !prefs.hidden.includes(p.$id));
  let feedPosts = visiblePosts;
  if (activeTab === "Following") {
    feedPosts = visiblePosts.filter(p => prefs.following && prefs.following.includes(p.authorName || 'Contributor'));
  } else if (activeTab !== "For you") {
    feedPosts = visiblePosts.filter(p => ((p.tags && p.tags[0]) || p.tag || 'Technology') === activeTab);
  }

  return (
    <>
      {!authStatus && (
        <div className="w-full pb-12 -mt-[72px]">
          <div className="bg-brand-yellow relative pt-[120px] pb-32 transition-colors duration-500">
            <Container>
              <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="w-full md:w-3/5 space-y-8">
                  <h1 className="text-6xl md:text-8xl font-black text-brand-dark leading-[0.95] tracking-tighter">
                    Stay curious.
                  </h1>
                  <p className="text-2xl text-brand-dark font-medium max-w-lg">
                    Discover stories, thinking, and expertise from writers on any topic.
                  </p>
                  <div className="pt-4">
                    <Link to="/signup" className="px-8 py-3 bg-brand-purple text-white text-xl font-bold rounded-full hover:bg-purple-700 shadow-md hover:shadow-lg transition-all">
                      Start reading
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex w-full md:w-2/5 justify-end items-center">
                  <Logo className="w-64 h-64 drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out" />
                </div>
              </div>
            </Container>
            
            {/* Melting Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] md:h-[90px]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,158.51,122.5,224.89,105.5Z" fill="#ffffff"></path>
              </svg>
            </div>
          </div>
          
          <Container>
            <div className="pt-10 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-10 uppercase tracking-widest text-black">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Trending on Thoughts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 6).map((post, i) => (
                  <Link to={`/post/${post.$id}`} key={post.$id} className="flex gap-4 items-start group cursor-pointer">
                    <span className="text-4xl font-black text-gray-200 group-hover:text-black/20 transition-colors font-sans">0{i + 1}</span>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <div className="w-6 h-6 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px]">
                          {(post.authorName || "C")[0].toUpperCase()}
                        </div>
                        <span className="text-gray-600">{post.authorName || 'Contributor'}</span>
                      </div>
                      <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-purple transition-colors leading-tight mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-500 font-sans">Aug {10+i} &middot; 5 min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}

      {authStatus && (
        <div className="w-full pb-8 -mt-[72px]">
          <div className="bg-brand-yellow relative pt-[120px] pb-20 transition-colors duration-500 overflow-hidden">
            <Container>
              <div className="relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-2">
                  Welcome back.
                </h1>
                <p className="text-brand-dark/80 font-bold text-lg max-w-lg">
                  Here's what we found for you today.
                </p>
              </div>
            </Container>
            
            {/* Melting Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[50px]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,158.51,122.5,224.89,105.5Z" fill="#F9FAFB"></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen bg-gray-50/50">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 py-12">
          {/* Main Feed Column */}
          <div className="w-full lg:w-[65%]">
            <div className="flex items-center gap-6 border-b border-gray-200 pb-4 mb-10 overflow-x-auto relative">
              {["For you", "Following"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`text-sm whitespace-nowrap pb-4 -mb-[17px] transition-colors ${activeTab === tab ? 'font-black text-brand-dark border-b-2 border-brand-dark' : 'font-bold text-gray-400 hover:text-brand-purple'}`}
                >
                  {tab}
                </button>
              ))}
              {activeTab !== "For you" && activeTab !== "Following" && (
                <div className="ml-auto text-sm font-bold text-brand-purple flex items-center gap-2">
                  Showing: {activeTab}
                  <button onClick={() => handleTabClick("For you")} className="text-gray-400 hover:text-red-500 rounded-full p-1">
                    &times;
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-6">
              {feedPosts.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-xl text-gray-400 italic mb-6">No stories found for this feed.</p>
                  <Link to="/add-post" className="inline-block px-6 py-3 bg-brand-purple text-white font-bold rounded-full hover:bg-purple-700 shadow-md transition-colors">
                    Write a story
                  </Link>
                </div>
              ) : (
                feedPosts.map((post) => (
                  <div key={post.$id} className="w-full">
                    <PostCard 
                      {...post} 
                      isBookmarked={prefs.bookmarks.includes(post.$id)}
                      onBookmark={() => toggleBookmark(post.$id)}
                      onHide={() => hidePost(post.$id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="hidden lg:block w-full lg:w-[35%] lg:pl-12 border-l border-gray-100">
            <div className="sticky top-24">
              <h3 className="text-base font-black text-brand-dark mb-6">Staff Picks</h3>
              <div className="flex flex-col gap-5 mb-10">
                {posts.slice(0, 3).map((post) => (
                  <Link to={`/post/${post.$id}`} key={post.$id} className="group block cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">
                        {(post.authorName || "E")[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-gray-600">{post.authorName || 'Contributor'}</span>
                    </div>
                    <h4 className="text-[16px] font-black text-brand-dark leading-tight group-hover:text-brand-purple transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>

              <h3 className="text-base font-black text-brand-dark mb-4">Recommended Topics</h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {['Technology', 'Programming', 'Design', 'Productivity', 'Writing', 'Machine Learning', 'Culture'].map((topic) => (
                  <span 
                    key={topic} 
                    onClick={() => handleTabClick(topic)}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 hover:border-brand-purple hover:text-brand-purple transition-colors rounded-full text-[13px] font-bold text-gray-600 cursor-pointer"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <h3 className="text-base font-black text-brand-dark mb-6">Who to follow</h3>
              <div className="flex flex-col gap-5">
                {Array.from(new Set(posts.filter(p => p.authorName).map(p => p.authorName))).slice(0, 3).map((authorName, i) => (
                  <Link to={`/user/${authorName}`} key={authorName} className="flex items-center justify-between group cursor-pointer block hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {authorName[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-brand-dark line-clamp-1 max-w-[120px] group-hover:text-brand-purple transition-colors">{authorName}</span>
                        <span className="text-xs text-gray-500 font-medium line-clamp-1 max-w-[150px]">Writer & enthusiast.</span>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 border-2 border-brand-purple text-brand-purple rounded-full text-xs font-black hover:bg-brand-purple hover:text-white transition-all">
                      View
                    </button>
                  </Link>
                ))}
                {Array.from(new Set(posts.filter(p => p.authorName).map(p => p.authorName))).length === 0 && (
                  <p className="text-sm text-gray-500 font-sans italic">No writers to suggest yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
    </>
  );
}

export default Home;
