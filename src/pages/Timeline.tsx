import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePosts } from "../firebase/posts";
import type { Post } from "../types/Post";

import "./Composer.css";
import { lookupUsername } from "../firebase/users";

function TimelinePost({
  post: { authorId, words, timestamp },
}: {
  post: Post;
}) {
  const [resolvedUsername, setResolvedUsername] = useState("unknown user");

  useEffect(() => {
    (async () => {
      const authorName = await lookupUsername(authorId);
      setResolvedUsername(authorName);
    })();
  }, []);

  return (
    <div>
      <h2>{resolvedUsername}</h2>
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
