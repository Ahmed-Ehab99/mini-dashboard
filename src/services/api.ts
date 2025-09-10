const BASE_URL = "https://jsonplaceholder.typicode.com";

// Helper function for making API requests
async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Helper function to ensure user has all required properties
function normalizeUser(user: UserResponse, originalUser?: UserApi): UserApi {
  return {
    id: user.id ?? originalUser?.id ?? 0,
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    website: user.website || "",
    address: user.address ||
      originalUser?.address || {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        geo: { lat: "", lng: "" },
      },
    company: user.company ||
      originalUser?.company || {
        name: "Unknown",
        catchPhrase: "",
        bs: "",
      },
  };
}

// Helper function to ensure post has all required properties
function normalizePost(post: PostResponse, originalPost?: Post): Post {
  return {
    userId: post.userId ?? originalPost?.userId ?? 0,
    id: post.id ?? originalPost?.id ?? 0,
    title: post.title || "",
    body: post.body || "",
  };
}

// Users functions
export async function getUsers(): Promise<UserApi[]> {
  return apiRequest<UserApi[]>("/users");
}

export async function getUser(id: number): Promise<UserApi> {
  return apiRequest<UserApi>(`/users/${id}`);
}

export async function createUser(userData: CreateUserData): Promise<UserApi> {
  // JSONPlaceholder doesn't actually create users, but returns a fake response
  const response = await apiRequest<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  // Normalize the response to ensure it has all required properties
  return normalizeUser(response);
}

export async function updateUser(userData: UpdateUserData): Promise<UserApi> {
  // Get the original user data first to preserve company and address info
  const originalUser = await getUser(userData.id);

  const response = await apiRequest<UserResponse>(`/users/${userData.id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

  // Normalize the response and preserve original data for missing fields
  return normalizeUser(response, originalUser);
}

export async function deleteUser(id: number): Promise<void> {
  await apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
  });
}

// Posts functions
export async function getPosts(): Promise<Post[]> {
  return apiRequest<Post[]>("/posts");
}

export async function getPost(id: number): Promise<Post> {
  return apiRequest<Post>(`/posts/${id}`);
}

export async function createPost(postData: CreatePostData): Promise<Post> {
  // JSONPlaceholder doesn't actually create posts, but returns a fake response
  const response = await apiRequest<PostResponse>("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });

  // Normalize the response to ensure it has all required properties
  return normalizePost(response);
}

export async function updatePost(postData: UpdatePostData): Promise<Post> {
  // Get the original post data first
  const originalPost = await getPost(postData.id);

  const response = await apiRequest<PostResponse>(`/posts/${postData.id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });

  // Normalize the response and preserve original data for missing fields
  return normalizePost(response, originalPost);
}

export async function deletePost(id: number): Promise<void> {
  await apiRequest<void>(`/posts/${id}`, {
    method: "DELETE",
  });
}

// Mock stats for dashboard
export async function getStats() {
  const users = await getUsers();

  return {
    totalUsers: users.length,
    activeUsers: Math.floor(users.length * 0.8),
    newUsersThisMonth: Math.floor(users.length * 0.2),
    userGrowth: "+12.5%",
  };
}

// Export all functions as an object for backward compatibility
export const apiService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getStats,
};
