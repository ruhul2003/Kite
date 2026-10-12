const API_BASE = "http://localhost:5000/api";

export async function apiRegister(userData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }
    return data.user;
  } catch (err) {
    console.error("Backend register error:", err.message);
    throw err;
  }
}

export async function apiLogin(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
    return data.user;
  } catch (err) {
    console.error("Backend login error:", err.message);
    throw err;
  }
}

export async function apiGoogleAuth(googleUser) {
  try {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Google auth failed");
    }
    return data.user;
  } catch (err) {
    console.warn("Backend Google auth error, using local session fallback:", err.message);
    return googleUser;
  }
}

export async function apiGuestAuth() {
  try {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Guest auth failed");
    }
    return data.user;
  } catch (err) {
    console.warn("Backend guest auth error:", err.message);
    return null;
  }
}

export async function apiCreatePost(postData) {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    return data.post || postData;
  } catch (err) {
    console.warn("Backend create post error:", err.message);
    return postData;
  }
}
