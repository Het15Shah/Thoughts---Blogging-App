import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import AppwriteService from "../appwrite/conf";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPosts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      AppwriteService.getPost(slug).then((post) => {
        if (post) {
          setPosts(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="min-h-screen bg-gray-50/50 pb-12 -mt-[72px]">
      {/* Curvy Header */}
      <div className="bg-brand-orange relative pt-[120px] pb-24 mb-10 overflow-hidden">
        <Container>
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-md">
              Edit Story
            </h1>
            <p className="text-orange-100 font-semibold text-lg max-w-lg">
              Make changes and update your post.
            </p>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,158.51,122.5,224.89,105.5Z" fill="#F9FAFB"></path>
          </svg>
        </div>
      </div>
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
