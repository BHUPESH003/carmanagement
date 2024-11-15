import { atom } from 'jotai';

interface User {
  id: string;
  username: string;
  email: string;
}

export const userAtom = atom<User | null>(null);

console.log(userAtom,"userAtom")