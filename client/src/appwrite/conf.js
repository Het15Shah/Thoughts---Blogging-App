// This file replaces the Appwrite SDK with fetch calls to our new Node/Express API
const API_URL = 'http://localhost:5000/api';

export class Service {
  
  async createPost(data) {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) return false;
      return await response.json();
    } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
      return false;
    }
  }

  async updatePost(slug, data) {
    try {
      const response = await fetch(`${API_URL}/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) return false;
      return await response.json();
    } catch (error) {
      console.log("Appwrite serive :: updatePost :: error", error);
      return false;
    }
  }

  async deletePost(slug) {
    try {
      const response = await fetch(`${API_URL}/posts/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) return false;
      return true;
    } catch (error) {
      console.log("Appwrite serive :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      const response = await fetch(`${API_URL}/posts/${slug}`);
      if (!response.ok) return false;
      return await response.json();
    } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
      return false;
    }
  }

  async getallPosts(queries = []) {
    try {
      const response = await fetch(`${API_URL}/posts?status=active`);
      if (!response.ok) return false;
      return await response.json(); // returns { documents: [...] }
    } catch (error) {
      console.log("Appwrite serive :: getallPosts :: error", error);
      return false;
    }
  }

  // file upload service
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) return false;
      return await response.json(); // returns { $id: '/uploads/...jpg' }
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!fileId) return false;
      // fileId is like '/uploads/image-123.jpg' — extract only the filename
      const filename = fileId.split('/').pop();
      const response = await fetch(`${API_URL}/upload/${filename}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.log("Appwrite serive :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if (!fileId) return '';
    // fileId is already a relative path like '/uploads/image.jpg' from our API
    return `http://localhost:5000${fileId}`;
  }
}

const service = new Service();
export default service;
