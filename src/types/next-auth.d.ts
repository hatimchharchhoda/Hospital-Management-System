import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      username?: string;
      hospitalName: string
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    username?: string;
    hospitalName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    username?: string;
    hospitalName: string
  }
}