import { Map } from '@gaia-project/engine';
import { BasicMapModel } from '@gaia-project/engine/src/core/maps';
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  Light,
  LineSegments,
  Matrix4,
  PerspectiveCamera,
  Raycaster,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { createHighlightHex, createMapHex, createPlanet } from './map';
// import { createMousePointer } from './mouse-cursor';
import { Sprite } from './sprite';

export type RenderCallback = (
  scene: Scene,
  addSprite: (sprite: Sprite) => void,
) => void;

const HexRadius = 5;
const StarryBackground = new TextureLoader().load('/stars.jpg');
const HorizontalOffset = (3 / 2) * 2.5;
const VerticalOffset = Math.sqrt(3) * 2.5;
const UnitVectors = {
  Q: [HorizontalOffset, 0, 0],
  R: [-HorizontalOffset, -VerticalOffset, 0],
  S: [-HorizontalOffset, VerticalOffset, 0],
} as const;

const TranslationMatrix = new Matrix4(
  UnitVectors.Q[0],
  UnitVectors.R[0],
  UnitVectors.S[0],
  0,
  UnitVectors.Q[1],
  UnitVectors.R[1],
  UnitVectors.S[1],
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
);

export class SceneRenderer {
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly environmentLights: Light[];
  private readonly map: Map;
  private readonly mapHexes: Record<string, LineSegments>;
  private readonly hexHighlight: Sprite;
  private readonly cameraLookAt: Vector3;

  sprites: Sprite[] = [];

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly viewSize: { width: number; height: number },
  ) {
    this.scene = new Scene();
    this.cameraLookAt = new Vector3(28, 0, 0);
    this.camera = new PerspectiveCamera(
      75,
      viewSize.width / viewSize.height,
      0.1,
      1000,
    );
    this.camera.position.set(28, -28, 90);
    this.camera.lookAt(this.cameraLookAt);

    const directionalLight = new DirectionalLight(0xeeeeee, 0.9);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.position.set(0, 12, 50);
    this.environmentLights = [new AmbientLight(0x999999), directionalLight];

    this.map = new BasicMapModel().createMap(3);
    this.mapHexes = {};
    this.hexHighlight = createHighlightHex(HexRadius);

    const canvas = renderer.domElement;
    // canvas.style.cursor = 'none';
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
  }

  beginRendering() {
    this.scene.background = StarryBackground;
    this.scene.backgroundIntensity = 0.05;

    this.map.hexes().forEach((mapHex) => {
      const [q, r] = mapHex.location;
      const hex = createMapHex(HexRadius);
      this.mapHexes[hex.id] = hex;

      const v = new Vector3(q, r, -q - r)
        .applyMatrix4(TranslationMatrix)
        .setZ(0);
      hex.position.set(v.x, v.y, v.z);
      this.scene.add(hex);

      if (mapHex.planet) {
        const planet = createPlanet(3.5, mapHex.planet, v);
        this.sprites.push(planet);
        this.scene.add(planet.mesh);
      }
    });

    this.scene.add(this.hexHighlight.mesh);
    this.sprites.push(this.hexHighlight);

    this.environmentLights.forEach((light) => {
      this.scene.add(light);
    });
    this.scene.add(this.camera);
    this.animate();
  }

  private onMouseMove(e: MouseEvent) {
    const x = (e.offsetX / this.viewSize.width) * 2 - 1;
    const y = -(e.offsetY / this.viewSize.height) * 2 + 1;

    // const vector = new Vector3(x, y, -15);
    // vector.unproject(this.camera);

    // const dir = vector.sub(this.camera.position).normalize();
    // const distance = -this.camera.position.z / dir.z - 12;
    // const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    // this.mouseCursor.mesh.position.copy(pos);

    // Can we highlight a hex??
    const mousePosition = new Vector2(x, y);

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mousePosition, this.camera);
    const intersections = raycaster.intersectObjects(this.scene.children);
    for (const intersection of intersections) {
      const hex = this.mapHexes[intersection.object.id];
      if (hex) {
        this.setHighlightedHex(hex);
        break;
      }
    }
  }

  private onMouseWheel(e: WheelEvent) {
    // if (e.deltaY) {
    const zoomFactor = e.deltaY * 0.25;
    const cameraNormal = this.camera.getWorldDirection(new Vector3());

    const newCameraPosition = this.camera.position
      .clone()
      .addScaledVector(cameraNormal, zoomFactor);

    if (newCameraPosition.z >= 30 && newCameraPosition.z <= 160) {
      this.camera.position.set(
        newCameraPosition.x,
        newCameraPosition.y,
        newCameraPosition.z,
      );
    }

    // Stop the page from scrolling up/down in the browser.
    e.preventDefault();
  }

  private setHighlightedHex(hex: LineSegments) {
    this.hexHighlight.mesh.position.set(
      hex.position.x,
      hex.position.y,
      hex.position.z,
    );
  }

  private animate() {
    this.sprites.forEach((sprite) => {
      sprite.animate();
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}
