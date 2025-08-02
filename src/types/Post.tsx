import type { FridgeWord } from "./FridgeWord";

export interface Post {
  id: string;
  timestamp: Date;
  author: string;
  words: FridgeWord[];
}
