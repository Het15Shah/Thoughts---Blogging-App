import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiService from '../api/conf';
import authService from '../api/auth';
import { Button, Container } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

export default function Post() {
  const [post,           setPost]           = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copyToast,      setCopyToast]      = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData  = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const isAuthor  = post && userData ? (post.userId || post.authorId) === userData.$id : false;

  useEffect(() => {
    if (slug) {
      apiService.getPost(slug).then((p) => {
        if (p) setPost(p);
        else navigate('/');
      });
    } else navigate('/');
  }, [slug, navigate]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrolled  = document.documentElement.scrollTop;
      const total     = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDelete = () => {
    if (!window.confirm('Delete this story permanently?')) return;
    apiService.deletePost(post.$id).then((ok) => {
      if (ok) {
        if (post.featuredImage) apiService.deleteFile(post.featuredImage);
        navigate('/');
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2200);
    }
  };

  const displayTag = post?.tags?.[0] || post?.tag || null;
  const authorLabel = post?.authorName || 'Contributor';
  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-bold text-sm">Loading story…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen relative">

      {/* Reading progress */}
      <div
        className="reading-progress fixed top-0 left-0 h-[3px] z-[100] transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Copy toast */}
      {copyToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-brand-dark text-white text-sm font-bold rounded-full shadow-lg animate-fade-in-up">
          🔗 Link copied to clipboard!
        </div>
      )}

      <Container>
        <article className="max-w-[680px] mx-auto pt-14 pb-24 animate-fade-in-up">

          {/* Author actions (edit/delete) */}
          {isAuthor && (
            <div className="mb-8 flex gap-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
            </div>
          )}

          {/* Tag pill */}
          {displayTag && (
            <span className="tag-pill mb-4 inline-flex">{displayTag}</span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-brand-dark mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Author + meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
                {authorLabel[0]?.toUpperCase()}
              </div>
              <div>
                <Link
                  to={`/user/${authorLabel}`}
                  className="text-sm font-black text-brand-dark hover:text-brand-purple transition-colors block"
                >
                  {isAuthor ? `${userData?.name || 'You'} (Author)` : authorLabel}
                </Link>
                <span className="text-xs text-gray-400 font-semibold">
                  {formattedDate}{formattedDate && ' · '}5 min read
                </span>
              </div>
            </div>

            {/* Share + bookmark */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                title="Share story"
                className="p-2 rounded-lg text-gray-300 hover:text-brand-purple hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Featured image */}
          {post.featuredImage && (
            <figure className="mb-10">
              <img
                src={apiService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-full h-auto max-h-[520px] object-cover rounded-xl shadow-sm"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </figure>
          )}

          {/* Content */}
          <div className="browser-css">
            {parse(post.content || '')}
          </div>

          {/* Author bio footer */}
          <div className="mt-14 pt-8 border-t border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0">
              {authorLabel[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Written by</p>
              <Link
                to={`/user/${authorLabel}`}
                className="text-base font-black text-brand-dark hover:text-brand-purple transition-colors"
              >
                {authorLabel}
              </Link>
              {authStatus && !isAuthor && (
                <Link
                  to={`/user/${authorLabel}`}
                  className="ml-3 text-xs font-bold text-brand-purple underline underline-offset-2 hover:text-purple-700"
                >
                  View profile →
                </Link>
              )}
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
