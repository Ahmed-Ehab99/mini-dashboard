// Auth types
type UserAuth = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: UserAuth | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};
/////////////////////////////////////////////////
// API types
type UserApi = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

type CreateUserData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

interface UpdateUserData extends Partial<CreateUserData> {
  id: number;
}

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type CreatePostData = {
  userId: number;
  title: string;
  body: string;
};

interface UpdatePostData extends Partial<CreatePostData> {
  id: number;
}

type UserResponse = Partial<UserApi>;
type PostResponse = Partial<Post>;
/////////////////////////////////////////////////
// Dashboard types
type Stats = {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowth: string;
};
/////////////////////////////////////////////////
// Table type
type DataTableColumn<T> = {
  key: string;
  header: string;
  width?: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
};
