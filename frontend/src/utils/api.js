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

export async function apiFetchJobs(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.search) query.append("search", filters.search);
    if (filters.type && filters.type !== "All") query.append("type", filters.type);
    if (filters.experience && filters.experience !== "All") query.append("experience", filters.experience);
    if (filters.remote) query.append("remote", "true");

    const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");
    return data.jobs || [];
  } catch (err) {
    console.warn("Backend fetch jobs error:", err.message);
    return [];
  }
}

export async function apiCreateJob(jobData) {
  try {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create job");
    return data.job;
  } catch (err) {
    console.error("Backend create job error:", err.message);
    throw err;
  }
}

export async function apiApplyToJob(jobId, applicationData) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to apply");
    return data;
  } catch (err) {
    console.error("Backend apply error:", err.message);
    throw err;
  }
}

export async function apiDeleteJob(jobId) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete job");
    return data;
  } catch (err) {
    console.error("Backend delete job error:", err.message);
    throw err;
  }
}

// ==========================================
// KITE USER NOTES API
// ==========================================

export async function apiFetchNotes(userId = "user-alex", filters = {}) {
  try {
    const query = new URLSearchParams();
    query.append("userId", userId);
    if (filters.category && filters.category !== "All") query.append("category", filters.category);
    if (filters.search) query.append("search", filters.search);
    if (filters.tag) query.append("tag", filters.tag);

    const res = await fetch(`${API_BASE}/notes?${query.toString()}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch notes");

    // Cache locally for offline/guest resilience
    if (typeof window !== "undefined" && data.notes) {
      localStorage.setItem("kite_notes_cache", JSON.stringify(data.notes));
    }

    return data.notes || [];
  } catch (err) {
    console.warn("Backend fetch notes error, falling back to cached/local storage:", err.message);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("kite_notes_cache");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (_) {}
      }
    }
    return [];
  }
}

