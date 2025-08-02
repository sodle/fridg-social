import { Link } from "react-router";
import { usePosts } from "../firebase/posts";
import type { Post } from "../types/Post";

import "./Composer.css";

function TimelinePost({ post: { author, words, timestamp } }: { post: Post }) {
  return (
    <div>
      <h2>{author}</h2>
      <div className="fridge">
        {words.map(({ id, word, posX, posY, rotation }) => (
          <div
            key={id}
            className="word-tile placed"
            style={{
              translate: `${posX}px ${posY}px`,
              rotate: `${rotation}deg`,
            }}
          >
            {word}
          </div>
        ))}
      </div>
      <p>{timestamp.toLocaleString()}</p>
    </div>
  );
}

function Timeline() {
  const posts = usePosts();
  return (
    <>
      <h1>Latest posts</h1>
      <div>
        <Link to="/post">+ Make a Post</Link>
      </div>
      <div>
        {posts.map((p) => (
          <TimelinePost key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}

export default Timeline;
