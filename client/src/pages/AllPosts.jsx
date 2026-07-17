import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import AppwriteService from '../appwrite/conf';

function AllPosts() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    AppwriteService.getallPosts().then((res) => {
      if (res) setPosts(res.documents);
      setLoading(false);
    });
  }, []);

  const filtered = posts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    (p.tags?.[0] || p.tag || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 -mt-[72px]">
      {/* Curvy Header */}
      <div className="bg-brand-purple relative pt-[120px] pb-24 mb-10 overflow-hidden">
        <Container>
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-3 drop-shadow-md">
              Explore
            </h1>
            <p className="text-purple-100 font-semibold text-lg max-w-lg">
              Discover stories, ideas, and perspectives from writers on any topic.
            </p>
          </div>
        </Container>
        {/* Melting Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,158.51,122.5,224.89,105.5Z" fill="#F9FAFB"></path>
          </svg>
        </div>
      </div>
      <Container>

        {/* The header is now the curvy section above */}

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search stories or topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-full text-sm font-semibold
                         placeholder-gray-400 outline-none focus:border-brand-purple focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-5 py-7 border-b border-gray-100">
                <div className="flex-grow space-y-3">
                  <div className="skeleton h-3 w-28 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
                <div className="skeleton w-[120px] h-[85px] rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-black text-gray-300">
              {search ? `No results for "${search}"` : 'No stories yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
