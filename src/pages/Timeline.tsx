import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePost, usePosts } from "../firebase/posts";
import type { Post } from "../types/Post";

import "./Composer.css";
import { lookupUsername } from "../firebase/users";

function TimelinePost({
  post: { id, authorId, words, timestamp },
}: {
  post: Post;
}) {
  const [resolvedUsername, setResolvedUsername] = useState("unknown user");
  const { likeCount, liked, like, unlike } = usePost(id ?? "fake post");

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
      <p>
        <button className="like-button" onClick={liked ? unlike : like}>
          {liked ? "Unlike" : "Like"}
        </button>{" "}
        {likeCount} likes &bull; {timestamp.toLocaleString()}
      </p>
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
