const rawUrl = String(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api");
const formattedUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const config = {
    backendUrl: formattedUrl.endsWith('/api') ? formattedUrl : `${formattedUrl}/api`,
}

export default config;