import * as THREE from "three";

type Listener = () => void;

const listeners = new Set<Listener>();

export const textureState = { loaded: 0, total: 0, done: false };

export const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (_url, loaded, total) => {
  textureState.loaded = loaded;
  textureState.total = total;
  notify();
};

loadingManager.onProgress = (_url, loaded, total) => {
  textureState.loaded = loaded;
  textureState.total = total;
  notify();
};

loadingManager.onLoad = () => {
  textureState.done = true;
  notify();
};

loadingManager.onError = () => {
  // битая картинка не должна держать завесу
  textureState.loaded += 1;
  notify();
};

function notify() {
  listeners.forEach((l) => l());
}

export function onTextureProgress(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Доля загруженных текстур, 0..1. */
export function textureProgress() {
  if (textureState.done) return 1;
  if (!textureState.total) return 0;
  return Math.min(textureState.loaded / textureState.total, 1);
}

export const textureLoader = new THREE.TextureLoader(loadingManager);

let paper: THREE.Texture | null = null;

/** Одна фотография бумаги на все карточки — поле, на которое наклеен кадр. */
export function paperTexture() {
  if (!paper) {
    paper = textureLoader.load("/paper.jpg");
    paper.wrapS = THREE.RepeatWrapping;
    paper.wrapT = THREE.RepeatWrapping;
    paper.colorSpace = THREE.SRGBColorSpace;
  }
  return paper;
}
