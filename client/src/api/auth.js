// This file replaces API Auth with standard fetch calls to our Node backend
import config from '../config/config';
const API_URL = config.backendUrl;

export class AuthService {

    async createAccount({email, password, name}) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            
            // Automatically log them in by setting token
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            console.error("AuthService :: createAccount :: error", error);
            throw error;
        }
    }

    async login({email, password}) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            console.error("AuthService :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.log("API service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            localStorage.removeItem('token');
            return true;
        } catch (error) {
            console.log("API service :: logout :: error", error);
        }
    }

    async getPrefs() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return { following: [], bookmarks: [], hidden: [] };

            // Mock preferences for now, this could point to /api/actions/preferences
            const response = await fetch(`${API_URL}/actions/preferences`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return { following: [], bookmarks: [], hidden: [] };
            return await response.json();
        } catch (error) {
            console.log("API service :: getPrefs :: error", error);
            return { following: [], bookmarks: [], hidden: [] };
        }
    }

    async toggleFollow(authorName) {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await fetch(`${API_URL}/actions/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ authorName })
            });
        } catch (error) {
            console.log("API service :: toggleFollow :: error", error);
        }
    }

    async toggleBookmark(postId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await fetch(`${API_URL}/actions/bookmark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ postId })
            });
        } catch (error) {
            console.log("API service :: toggleBookmark :: error", error);
        }
    }

    async hidePost(postId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await fetch(`${API_URL}/actions/hide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ postId })
            });
        } catch (error) {
            console.log("API service :: hidePost :: error", error);
        }
    }
    async updateProfile(name, bio, interests) {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, bio, interests })
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.log("API service :: updateProfile :: error", error);
            return null;
        }
    }
}

const authService = new AuthService();
export default authService;
