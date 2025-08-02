import { useRef } from "react";
import { create } from "zustand";
import Draggable from "react-draggable";

import "./Composer.css";

import { words } from "../words.json";
import type { FridgeWord } from "../types/FridgeWord";
import { Link, useNavigate } from "react-router";
import { createPost } from "../firebase/posts";
import { useAuth } from "../firebase/auth";

const USE_TOP_WORDS = 1000;
const WORDS_TO_DRAW = 70;

interface WordBankWord {
  id: number;
  word: string;
  rotation: number;
}

function WordBankMagnet({ id, word, rotation }: WordBankWord) {
  const placeWord = useComposer((fridge) => fridge.placeWord);
  return (
    <div
      className="word-tile"
      style={{ rotate: `${rotation}deg` }}
      onClick={placeWord.bind(null, { id, word, rotation })}
    >
      {word}
    </div>
  );
}

function FridgeMagnet({ id, word, rotation, posX, posY }: FridgeWord) {
  const ref = useRef(null);
  const takeBackWord = useComposer((fridge) => fridge.takeBackWord);
  const positionWord = useComposer((fridge) => fridge.positionWord);
  return (
    <Draggable
      nodeRef={ref}
      bounds="parent"
      defaultPosition={{ x: posX, y: posY }}
      onDrag={(_, data) => {
        positionWord({ id, word, rotation, posX: data.x, posY: data.y });
      }}
    >
      <div
        className="word-tile placed"
        ref={ref}
        style={{ rotate: `${rotation}deg` }}
        onDoubleClick={takeBackWord.bind(null, {
          id,
          word,
          rotation,
          posX,
          posY,
        })}
      >
        {word}
      </div>
    </Draggable>
  );
}

interface ComposerState {
  wordBank: WordBankWord[];
  fridge: FridgeWord[];
  placeWord: (word: WordBankWord) => void;
  takeBackWord: (word: FridgeWord) => void;
  positionWord: (word: FridgeWord) => void;
  clearFridge: () => void;
}

const useComposer = create<ComposerState>((set) => ({
  wordBank: drawInitialWords(),
  fridge: [],
  placeWord: ({ id, word }: WordBankWord) =>
    set((state) => ({
      wordBank: state.wordBank.filter((m) => m.id != id),
      fridge: [
        ...state.fridge,
        { id, word, posX: 0, posY: 0, rotation: randomRotation() },
      ],
    })),
  takeBackWord: ({ id, word }: FridgeWord) => {
    set((state) => ({
      wordBank: [{ id, word, rotation: randomRotation() }, ...state.wordBank],
      fridge: state.fridge.filter((m) => m.id != id),
    }));
  },
  positionWord: (word: FridgeWord) => {
    set((state) => ({
      fridge: state.fridge.map((m) => (m.id == word.id ? word : m)),
    }));
  },
  clearFridge: () => {
    set(() => ({ fridge: [] }));
  },
}));

function drawWord(): string {
  const n = Math.floor(Math.random() * USE_TOP_WORDS);
  return words[n];
}

function randomRotation(): number {
  return 5 - Math.random() * 10;
}

function drawInitialWords(): WordBankWord[] {
  let w: WordBankWord[] = [];
  for (let n = 0; n < WORDS_TO_DRAW; n++) {
    w.push({
      id: n,
      rotation: randomRotation(),
      word: drawWord(),
    });
  }
  return w;
}

function Composer() {
  const wordBank = useComposer((fridge) => fridge.wordBank);
  const fridge = useComposer((fridge) => fridge.fridge);
  const clearFridge = useComposer((fridge) => fridge.clearFridge);
  const user = useAuth();
  const navigate = useNavigate();

  async function sendPost() {
    if (!user) {
      alert("You must be signed in to make a post.");
      return;
    }

    await createPost({
      authorId: user.uid,
      timestamp: new Date(),
      words: fridge,
    });
    await navigate("/");
    clearFridge();
  }

  return (
    <>
      <h1>New post</h1>
      <div>
        <Link to="/">&larr; Back to timeline</Link>
      </div>
      <div>
        Click words from the word bank to place on the fridge. Drag to move
        around. Double-click to remove.{" "}
        <button onClick={clearFridge}>Clear</button>
        <button onClick={sendPost}>Post</button>
      </div>
      <div className="fridge">
        {fridge.map((word) => (
          <FridgeMagnet {...word} key={word.id} />
        ))}
      </div>
      <div className="word-bank">
        {wordBank.map((word) => (
          <WordBankMagnet {...word} key={word.id} />
        ))}
      </div>
      <div>
        <pre>
          <code>{JSON.stringify(fridge, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}

export default Composer;
