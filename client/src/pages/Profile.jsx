import React, { useState, useEffect } from 'react';
import { Container, Button, Input, PostCard } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import AppwriteService from '../appwrite/conf';
import { login } from '../store/authSlice';

function Profile() {
  const dispatch  = useDispatch();
  const userData  = useSelector((state) => state.auth.userData);
  const [posts,      setPosts]      = useState([]);
  const [name,       setName]       = useState('');
  const [bio,        setBio]        = useState('');
  const [interests,  setInterests]  = useState('');
  const [saving,     setSaving]     = useState(false);
  const [message,    setMessage]    = useState({ text: '', type: '' });

  useEffect(() => {
    if (!userData) return;
    setName(userData.name || '');

    // Fetch user posts
    AppwriteService.getallPosts().then((res) => {
      if (res?.documents) {
        const mine = res.documents.filter((p) => (p.userId || p.authorId) === userData.$id);
        setPosts(mine);
      }
    });

    // Fetch profile prefs (bio / interests come from /actions/preferences)
    authService.getPrefs().then((prefs) => {
      setBio(prefs?.bio || '');
      setInterests(Array.isArray(prefs?.interests) ? prefs.interests.join(', ') : (prefs?.interests || ''));
    });
  }, [userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const updated = await authService.updateProfile(name, bio, interests);
      if (updated) {
        dispatch(login({ userData: { ...userData, name: updated.name, bio: updated.bio } }));
        setMessage({ text: 'Profile saved successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update profile.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Something went wrong.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-xl font-black text-gray-300">Please log in to view your profile.</p>
      </div>
    );
  }

  const initial = userData.name?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="w-full min-h-screen bg-gray-50/50 -mt-[72px]">
      {/* Curvy Header */}
      <div className="bg-brand-pink relative pt-[120px] pb-24 mb-10 overflow-hidden">
        <Container>
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-md">
              Your Dashboard
            </h1>
            <p className="text-pink-100 font-semibold text-lg max-w-lg">
              Manage your personal profile and stories.
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
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-14 animate-fade-in-up">

          {/* ── Settings Column ───────────────────── */}
          <div className="w-full md:w-[45%]">
            <h1 className="text-3xl font-black text-brand-dark tracking-tight mb-8 border-b border-gray-100 pb-4">
              Profile Settings
            </h1>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-brand-orange text-white flex items-center justify-center text-3xl font-black shadow-brand-sm shrink-0">
                {initial}
              </div>
              <div>
                <p className="text-lg font-black text-brand-dark">{userData.name}</p>
                <p className="text-sm text-gray-400 font-semibold">{userData.email}</p>
              </div>
            </div>

            {/* Message banner */}
            {message.text && (
              <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2
                ${message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'}`}
              >
                {message.type === 'success' ? '✅' : '⚠️'} {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <Input
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
              />
              <Input
                label="Email address (read only)"
                value={userData.email}
                disabled
                className="text-gray-400 cursor-not-allowed"
              />
              <div className="w-full">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short bio about yourself…"
                  rows={3}
                  className="w-full px-0 py-3 bg-transparent text-brand-dark text-base outline-none
                             border-0 border-b-2 border-black/15 focus:border-brand-purple
                             transition-colors placeholder-gray-300 resize-none font-sans"
                />
              </div>
              <Input
                label="Interests (comma-separated)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Technology, Design, Writing…"
              />
              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" loading={saving} className="w-full">
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* ── Posts Column ──────────────────────── */}
          <div className="flex-grow border-t md:border-t-0 md:border-l border-gray-100 pt-10 md:pt-0 md:pl-12">
            <h2 className="text-2xl font-black text-brand-dark mb-6 border-b border-gray-100 pb-4">
              Your Stories
              <span className="ml-2 text-base font-bold text-gray-300">({posts.length})</span>
            </h2>
            {posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-4xl mb-3">✍️</p>
                <p className="text-gray-300 font-bold">No stories published yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post) => <PostCard key={post.$id} {...post} />)}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
