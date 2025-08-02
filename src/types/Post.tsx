import type { FridgeWord } from "./FridgeWord";

export interface Post {
  id?: string;
  timestamp: Date;
  authorId: string;
  words: FridgeWord[];
}
