import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import AppwriteService from '../../appwrite/conf';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TOPICS = [
  'Technology', 'Programming', 'Design', 'Productivity',
  'Writing', 'Machine Learning', 'Culture', 'Business', 'Science',
];

const STATUS_OPTIONS = ['active', 'inactive'];

function PostForm({ post }) {
  const navigate   = useNavigate();
  const userData   = useSelector((state) => state.auth.userData);
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(
    post?.featuredImage ? AppwriteService.getFilePreview(post.featuredImage) : null
  );

  const { register, handleSubmit, watch, setValue, control, formState: { isSubmitting, errors } } =
    useForm({
      defaultValues: {
        title:   post?.title   || '',
        content: post?.content || '',
        slug:    post?.slug    || '',
        status:  post?.status  || 'active',
        tag:     (post?.tags?.[0]) || post?.tag || 'Technology',
      },
    });

  // Auto-slug from title
  const slugTransform = useCallback((value = '') =>
    value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'), []);

  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (name === 'title') setValue('slug', slugTransform(values.title));
    });
    return () => sub.unsubscribe();
  }, [watch, setValue, slugTransform]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = async (data) => {
    try {
      let featuredImage = post?.featuredImage || null;

      if (data.image?.[0]) {
        setUploading(true);
        const uploaded = await AppwriteService.uploadFile(data.image[0]);
        setUploading(false);

        if (!uploaded) {
          alert('Image upload failed. Check server and file type.');
          return;
        }
        // Delete old image if editing
        if (post?.featuredImage) AppwriteService.deleteFile(post.featuredImage);
        featuredImage = uploaded.$id;
      }

      const payload = {
        title:         data.title,
        slug:          data.slug,
        content:       data.content,
        status:        data.status,
        tag:           data.tag,   // backend converts to tags array
        featuredImage,
      };

      if (post) {
        const updated = await AppwriteService.updatePost(post.$id, payload);
        if (updated) navigate(`/post/${updated.$id || post.$id}`);
        else alert('Failed to update post.');
      } else {
        const created = await AppwriteService.createPost({
          ...payload,
          userId:     userData?.$id    || 'unknown',
          authorName: userData?.name   || 'Contributor',
        });
        if (created) navigate(`/post/${created.$id}`);
        else alert('Failed to create post.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="w-full max-w-[1080px] mx-auto py-10 px-4 bg-white min-h-screen animate-fade-in-up">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
          {post ? 'Edit story' : 'Write a story'}
        </h1>
        <p className="text-gray-500 font-semibold mt-1 text-sm">
          {post ? 'Update your published story.' : 'Share your thoughts with the world.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-10">

        {/* ── Main Content Column ── */}
        <div className="flex-grow space-y-6">
          <Input
            label="Title"
            placeholder="Give your story a compelling title…"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <Input
            label="URL slug"
            placeholder="my-story-url-slug"
            {...register('slug', { required: 'Slug is required' })}
            onInput={(e) => setValue('slug', slugTransform(e.currentTarget.value))}
          />
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
              Content
            </label>
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => <RTE {...field} />}
            />
            {errors.content && (
              <p className="mt-1.5 text-xs font-bold text-red-500">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* ── Sidebar Panel ── */}
        <div className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-24 p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-6 shadow-sm">

            {/* Image upload */}
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Featured image
              </label>
              {preview && (
                <div className="mb-3 w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-gray-200
                                rounded-xl text-sm font-bold text-gray-500 cursor-pointer
                                hover:border-brand-purple hover:text-brand-purple transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? 'Uploading…' : 'Choose image'}
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  {...register('image', { required: !post })}
                  onChange={handleImageChange}
                />
              </label>
              {errors.image && (
                <p className="mt-1.5 text-xs font-bold text-red-500">Featured image is required</p>
              )}
            </div>

            <Select
              label="Topic / Tag"
              options={TOPICS}
              {...register('tag', { required: true })}
            />

            <Select
              label="Status"
              options={STATUS_OPTIONS}
              {...register('status', { required: true })}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting || uploading}
              className="w-full"
            >
              {isSubmitting ? 'Saving…' : post ? 'Update story' : 'Publish story'}
            </Button>

            {post && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                className="w-full text-gray-400 hover:text-red-500"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
