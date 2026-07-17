import React from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/conf';

const AVATAR_COLORS = [
  'bg-brand-orange', 'bg-brand-purple', 'bg-brand-pink',
  'bg-teal-500', 'bg-blue-500', 'bg-emerald-500',
];

function avatarColor(name = '') {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function PostCard({
  $id,
  title,
  featuredImage,
  authorName,
  tags,
  tag,
  createdAt,
  isBookmarked,
  onBookmark,
  onHide,
}) {
  const displayTag  = (tags && tags.length > 0) ? tags[0] : (tag || 'Technology');
  const authorLabel = authorName || 'Contributor';
  const initial     = authorLabel[0]?.toUpperCase() ?? 'C';
  const bgColor     = avatarColor(authorLabel);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="group relative flex flex-col-reverse sm:flex-row sm:items-start gap-5 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up">
      {/* Content */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Author row */}
        <Link
          to={`/user/${authorLabel}`}
          className="flex items-center gap-2 mb-2.5 w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`w-6 h-6 rounded-full ${bgColor} text-white flex items-center justify-center text-[10px] font-black shadow-sm shrink-0`}>
            {initial}
          </div>
          <span className="text-xs font-bold text-gray-500 hover:text-brand-purple transition-colors">
            {authorLabel}
          </span>
        </Link>

        {/* Title */}
        <Link to={`/post/${$id}`} className="block mb-2">
          <h2 className="text-xl md:text-[22px] font-black text-brand-dark leading-snug
                          group-hover:text-brand-purple transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            {formattedDate && (
              <span className="text-xs text-gray-400 font-semibold">{formattedDate}</span>
            )}
            {formattedDate && <span className="text-gray-200">·</span>}
            <span className="text-xs text-gray-400 font-semibold">5 min read</span>
            <span className="text-gray-200">·</span>
            <span className="tag-pill text-[11px]">{displayTag}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {onBookmark && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookmark(); }}
                title={isBookmarked ? 'Remove bookmark' : 'Save story'}
                className={`p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100
                  ${isBookmarked ? 'text-brand-purple' : 'text-gray-300 hover:text-brand-purple'}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill={isBookmarked ? 'currentColor' : 'none'} strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            )}
            {onHide && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onHide(); }}
                title="Show less like this"
                className="p-1.5 rounded-lg text-gray-200 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="9" y1="15" x2="15" y2="9" strokeLinecap="round" />
                  <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <Link to={`/post/${$id}`} className="shrink-0 w-full sm:w-auto">
        <div className="w-full h-[180px] sm:w-[150px] sm:h-[110px] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={
              featuredImage
                ? apiService.getFilePreview(featuredImage)
                : `https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=60`
            }
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=60';
            }}
          />
        </div>
      </Link>
    </div>
  );
}

export default PostCard;
