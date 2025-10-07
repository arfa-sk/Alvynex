/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 30px monospace',
  color: string = 'black'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

function createPlaceholderCanvas(color: string = '#0a0a0a') {
  const c = document.createElement('canvas');
  c.width = 2;
  c.height = 2;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  return c;
}

function derivePosterUrl(videoUrl: string): string {
  try {
    const url = new URL(videoUrl, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
    if (url.hostname.includes('res.cloudinary.com')) {
      // Replace resource type from video to image and request jpg with q_auto
      url.pathname = url.pathname.replace('/video/upload/', '/image/upload/');
      if (!url.pathname.includes('/f_auto,q_auto/')) {
        url.pathname = url.pathname.replace('/upload/', '/upload/f_auto,q_auto/');
      }
      return url.toString().replace(/\.mp4($|\?)/, '.jpg$1');
    }
  } catch {}
  // Fallback to a tiny black image data URL
  return 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.15;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
  sizeMultiplier: number;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  sizeMultiplier: number;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  // Media type handling
  texture!: Texture;
  video?: HTMLVideoElement;
  isVideo: boolean = false;
  shouldPlay: boolean = false;
  lastTexUpdateMs: number = 0;
  posterTexture!: Texture;
  mix: number = 0; // 0 = poster, 1 = video
  fadeStart: number = 0;
  fading: boolean = false;
  hasRVFC: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    sizeMultiplier
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.sizeMultiplier = sizeMultiplier;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    this.texture = new Texture(this.gl, {
      generateMipmaps: false
    });
    // Prefer linear filtering for streaming video textures
    (this.texture as any).minFilter = this.gl.LINEAR;
    (this.texture as any).magFilter = this.gl.LINEAR;
    // Set a placeholder so planes never render pure black while waiting
    this.texture.image = createPlaceholderCanvas('#111111');
    // Poster texture defaults to same placeholder; replaced once image loads
    this.posterTexture = new Texture(this.gl, { generateMipmaps: false });
    (this.posterTexture as any).minFilter = this.gl.LINEAR;
    (this.posterTexture as any).magFilter = this.gl.LINEAR;
    this.posterTexture.image = createPlaceholderCanvas('#111111');
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          // Remove wavy movement - keep cards flat
          p.z = 0.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform sampler2D tPoster;
        uniform float uBorderRadius;
        uniform float uMix; // 0..1 poster->video
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 poster = texture2D(tPoster, uv);
          vec4 videoC = texture2D(tMap, uv);
          vec4 color = mix(poster, videoC, clamp(uMix, 0.0, 1.0));
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: this.texture },
        tPoster: { value: this.posterTexture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uMix: { value: 0 }
      },
      transparent: true
    });
    // Detect media type
    this.isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(this.image);
    if (this.isVideo) {
      const video = document.createElement('video');
      this.video = video;
      // Autoplay policies require muted + playsInline for auto-play
      // Use Cloudinary transformations for faster mobile delivery
      const url = new URL(this.image, window.location.href);
      try {
        if (url.hostname.includes('res.cloudinary.com') && !url.pathname.includes('/f_auto,q_auto/')) {
          const parts = url.pathname.split('/');
          // Inject f_auto,q_auto after /upload/
          const idx = parts.findIndex(p => p === 'upload');
          if (idx !== -1) {
            parts.splice(idx + 1, 0, 'f_auto,q_auto');
            url.pathname = parts.join('/');
          }
        }
      } catch {}
      video.src = url.toString();
      video.muted = true;
      video.setAttribute('muted', '');
      video.loop = true;
      (video as any).playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      (video as any).autoplay = true;
      video.crossOrigin = 'anonymous';
      video.preload = 'auto';
      const setSizes = () => {
        if (!this.program || !this.program.uniforms) return;
        this.program.uniforms.uImageSizes.value = [video.videoWidth || 1, video.videoHeight || 1];
      };
      video.addEventListener('loadedmetadata', () => {
        setSizes();
        // Preload video by seeking to a small offset to avoid black frames
        try {
          if (video.currentTime < 0.1) video.currentTime = 0.1;
        } catch {}
        this.texture.image = video;
        (this.texture as any).needsUpdate = true;
      });
      video.addEventListener('canplay', () => {
        this.texture.image = video;
        (this.texture as any).needsUpdate = true;
        // Start playback when ready
        video.play().catch(() => {
          // ignore autoplay rejection
        });
        // Use requestVideoFrameCallback when available for smooth updates
        const useRVFC = (video as any).requestVideoFrameCallback && typeof (video as any).requestVideoFrameCallback === 'function';
        if (useRVFC) {
          this.hasRVFC = true;
          const schedule = () => {
            (video as any).requestVideoFrameCallback(() => {
              (this.texture as any).needsUpdate = true;
              schedule();
            });
          };
          schedule();
        }
        // Begin fade from poster to video
        this.fading = true;
        this.fadeStart = performance.now();
      });
      // Kick off loading with aggressive preload
      video.load();
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.image;
      img.onload = () => {
        this.texture.image = img;
        this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
        // Ensure first upload
        (this.texture as any).needsUpdate = true;
      };
    }
    // Load poster image (Cloudinary: derive from video url if applicable)
    const posterImg = new Image();
    posterImg.crossOrigin = 'anonymous';
    posterImg.src = derivePosterUrl(this.image);
    posterImg.onload = () => {
      this.posterTexture.image = posterImg;
      (this.posterTexture as any).needsUpdate = true;
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    // Remove text labels - no titles needed
  }

  update(scroll: { current: number; last: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;
    // Update video texture per frame only when onscreen and selected to play
    if (this.isVideo && this.video) {
      const visible = !(this.isBefore || this.isAfter);
      if (visible && this.shouldPlay) {
        if (this.video.paused) {
          this.video.play().catch(() => {});
        }
        if (this.video.readyState >= 2 && !this.hasRVFC) {
          const now = performance.now();
          if (now - this.lastTexUpdateMs > 33) { // ~30fps texture uploads
            (this.texture as any).needsUpdate = true;
            this.lastTexUpdateMs = now;
          }
        }
      } else {
        if (!this.video.paused) this.video.pause();
      }
    }
    // Animate poster->video mix
    if (this.fading) {
      const now = performance.now();
      const t = Math.min(1, (now - this.fadeStart) / 250.0);
      this.mix = t;
      this.program.uniforms.uMix.value = this.mix;
      if (t >= 1) this.fading = false;
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    // Responsive scaling based on screen size
    const isMobile = this.screen.width < 640;
    const baseScale = this.screen.height / 1500;
    const responsiveMultiplier = isMobile ? 0.75 : Math.min(1.5, Math.max(0.8, this.screen.width / 1920));
    this.scale = baseScale * responsiveMultiplier;
    
    // Set plane to portrait 9:16 aspect ratio with responsive sizing
    const baseHeight = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    const responsiveHeight = baseHeight * (this.sizeMultiplier || 1);
    
    // Limit maximum size for very large screens
    const maxHeight = this.viewport.height * (isMobile ? 0.5 : 0.6);
    this.plane.scale.y = Math.min(responsiveHeight, maxHeight);
    this.plane.scale.x = this.plane.scale.y * (9 / 16);
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    
    // Responsive padding
    this.padding = isMobile ? 0.9 : Math.max(0.4, Math.min(1.2, 2 / (this.sizeMultiplier || 1)));
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;

    // Subtler bend on mobile for a straighter track
    if (isMobile) {
      this.bend = Math.min(this.bend, 0.5);
    }
  }

  destroy() {
    if (this.isVideo && this.video) {
      try {
        this.video.pause();
        this.video.src = '';
        this.video.load();
      } catch {}
      this.video = undefined;
    }
  }
}

interface AppConfig {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  sizeMultiplier?: number;
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  sizeMultiplier: number = 1;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  isDown: boolean = false;
  start: number = 0;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      sizeMultiplier = 1
    }: AppConfig
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    const isMobileEase = container.clientWidth < 768;
    this.scroll = { ease: isMobileEase ? 0.08 : scrollEase, current: 0, target: 0, last: 0 };
    this.sizeMultiplier = sizeMultiplier;
    // Adjust size multiplier for mobile to avoid oversized cards
    const initialWidth = container.clientWidth;
    if (initialWidth < 640) {
      this.sizeMultiplier = 0.9;
    }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    const isMobile = window.innerWidth < 768;
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    // Lower segments on mobile to reduce vertex processing cost
    const isMobile = window.innerWidth < 768;
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: isMobile ? 12 : 30,
      widthSegments: isMobile ? 24 : 60
    });
  }

  createMedias(
    items: { image: string; text: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems = [
      {
        image: `https://picsum.photos/seed/1/800/600?grayscale`,
        text: 'Bridge'
      },
      {
        image: `https://picsum.photos/seed/2/800/600?grayscale`,
        text: 'Desk Setup'
      },
      {
        image: `https://picsum.photos/seed/3/800/600?grayscale`,
        text: 'Waterfall'
      },
      {
        image: `https://picsum.photos/seed/4/800/600?grayscale`,
        text: 'Strawberries'
      },
      {
        image: `https://picsum.photos/seed/5/800/600?grayscale`,
        text: 'Deep Diving'
      },
      {
        image: `https://picsum.photos/seed/16/800/600?grayscale`,
        text: 'Train Track'
      },
      {
        image: `https://picsum.photos/seed/17/800/600?grayscale`,
        text: 'Santorini'
      },
      {
        image: `https://picsum.photos/seed/8/800/600?grayscale`,
        text: 'Blurry Lights'
      },
      {
        image: `https://picsum.photos/seed/9/800/600?grayscale`,
        text: 'New York'
      },
      {
        image: `https://picsum.photos/seed/10/800/600?grayscale`,
        text: 'Good Boy'
      },
      {
        image: `https://picsum.photos/seed/21/800/600?grayscale`,
        text: 'Coastline'
      },
      {
        image: `https://picsum.photos/seed/12/800/600?grayscale`,
        text: 'Palm Trees'
      }
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        sizeMultiplier: this.sizeMultiplier
      });
    });
    // allow only nearest 2 items to actively play to avoid decoding all videos
    this.updateActiveVideos();
    // Mobile prewarm: start loading all video sources right away
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.medias.forEach(m => {
        if (m.isVideo && m.video) {
          try { m.video.preload = 'auto'; m.video.load(); } catch {}
        }
      });
    }
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
    this.updateActiveVideos();
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
    this.updateActiveVideos();
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    const delta = wheelEvent.deltaY || (wheelEvent as any).wheelDelta || (wheelEvent as any).detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
    this.updateActiveVideos();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      // Responsively adjust sizeMultiplier on resize
      const responsiveMultiplier = this.screen.width < 640 ? 0.9 : 1.5;
      this.medias.forEach(media => {
        media.sizeMultiplier = responsiveMultiplier;
        media.onResize({ screen: this.screen, viewport: this.viewport });
      });
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    if (!((this as any)._frameCounter)) (this as any)._frameCounter = 0;
    (this as any)._frameCounter++;
    if ((this as any)._frameCounter % 12 === 0) {
      this.updateActiveVideos();
    }
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  updateActiveVideos() {
    if (!this.medias || this.medias.length === 0) return;
    // Performance-aware policy: desktops allow many, mobile/tablet cap at 2
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // choose 2 closest to center
      const center = 0;
      const byDistance = this.medias
        .map(m => ({ m, d: Math.abs((m as any).plane?.position.x ?? 0 - center) }))
        .sort((a, b) => a.d - b.d);
      const cap = (this as any)._mobilePlayCap ?? 3;
      const allowed = new Set(byDistance.slice(0, cap).map(v => v.m));
      this.medias.forEach(m => { m.shouldPlay = allowed.has(m); });
    } else {
      // desktop/laptop: allow up to 6 to balance smoothness and CPU
      const center = 0;
      const byDistance = this.medias
        .map(m => ({ m, d: Math.abs((m as any).plane?.position.x ?? 0 - center) }))
        .sort((a, b) => a.d - b.d);
      const allowed = new Set(byDistance.slice(0, 6).map(v => v.m));
      this.medias.forEach(m => { m.shouldPlay = allowed.has(m); });
    }
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('mousewheel', this.boundOnWheel);
    window.addEventListener('wheel', this.boundOnWheel);
    window.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchstart', this.boundOnTouchDown);
    window.addEventListener('touchmove', this.boundOnTouchMove);
    window.addEventListener('touchend', this.boundOnTouchUp);

    // Mobile autoplay fallback: resume videos on first user gesture
    const resume = () => {
      if (this.medias) {
        this.medias.forEach(m => {
          if (m.isVideo && m.video && m.shouldPlay && m.video.paused) {
            m.video.play().catch(() => {});
          }
        });
      }
      window.removeEventListener('touchend', resume);
      window.removeEventListener('click', resume);
    };
    window.addEventListener('touchend', resume, { passive: true } as any);
    window.addEventListener('click', resume);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mousewheel', this.boundOnWheel);
    window.removeEventListener('wheel', this.boundOnWheel);
    window.removeEventListener('mousedown', this.boundOnTouchDown);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchstart', this.boundOnTouchDown);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.medias) {
      this.medias.forEach(m => m.destroy());
    }
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  sizeMultiplier?: number;
  mobilePlayCap?: number; // how many concurrent videos on mobile
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.05,
  sizeMultiplier = 1.5,
  mobilePlayCap = 3
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    // Reduce curvature on small screens
    const isMobile = window.innerWidth < 640;
    const effectiveBend = isMobile ? Math.max(0.6, bend * 0.4) : bend;
    const app = new App(containerRef.current, {
      items,
      bend: effectiveBend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      sizeMultiplier
    });
    // Store policy in instance for mobile cap
    (app as any)._mobilePlayCap = mobilePlayCap;
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, sizeMultiplier]);
  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef} />;
}
