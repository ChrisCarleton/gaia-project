import { PlanetType } from '@gaia-project/engine';
import { BasicMapModel } from '@gaia-project/engine/src/core/maps';
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  Light,
  Material,
  Matrix4,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';

import { createMapHex, createPlanet } from './map';
import { createMousePointer } from './mouse-cursor';
import { Sprite } from './sprite';

export type RenderCallback = (
  scene: Scene,
  addSprite: (sprite: Sprite) => void,
) => void;

const textureLoader = new TextureLoader();

const PlanetMaterials: Record<PlanetType, Material> = {
  [PlanetType.Desert]: new MeshPhysicalMaterial({
    color: 0xe4ed66,
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Gaia]: new MeshPhysicalMaterial({
    color: 0x57e031,
    reflectivity: 0.9,
    emissive: 0.8,
  }),
  [PlanetType.Ice]: new MeshPhysicalMaterial({
    color: 0xffffff,
    reflectivity: 0.9,
    emissive: 0.8,
  }),
  [PlanetType.Oxide]: new MeshPhysicalMaterial({
    color: 0xde0030,
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Swamp]: new MeshPhysicalMaterial({
    color: 0x6c6e44,
    reflectivity: 0.9,
    emissive: 0.2,
  }),
  [PlanetType.Terra]: new MeshPhongMaterial({
    map: textureLoader.load('/earth2.jpg'),
    reflectivity: 0.8,
    emissive: 0.8,
  }),
  // [PlanetType.Terra]: new MeshPhysicalMaterial({
  //   color: 0x1c54ed,
  //   reflectivity: 0.9,
  //   emissive: 0.5,
  // }),
  [PlanetType.Titanium]: new MeshPhysicalMaterial({
    color: 0x4a4949,
    reflectivity: 0.9,
    emissive: 0.7,
  }),
  [PlanetType.Transdim]: new MeshPhongMaterial({
    transparent: true,
    opacity: 0.5,
    color: 0x8414f5,
    reflectivity: 0.9,
    emissive: 1,
  }),
  [PlanetType.Volcanic]: new MeshPhysicalMaterial({
    color: 0xff6912,
    reflectivity: 0.9,
    emissive: 1,
  }),
};

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
  private readonly mouseCursor: Sprite;

  sprites: Sprite[] = [];

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly viewSize: { width: number; height: number },
  ) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      viewSize.width / viewSize.height,
      0.1,
      1000,
    );
    this.camera.position.set(28, -28, 90);
    this.camera.lookAt(28, 0, 0);
    this.mouseCursor = createMousePointer();
    this.sprites.push(this.mouseCursor);

    const directionalLight = new DirectionalLight(0xeeeeee, 0.9);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.position.set(0, 12, 50);
    this.environmentLights = [new AmbientLight(0x999999), directionalLight];

    const canvas = renderer.domElement;
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  beginRendering() {
    const mapModel = new BasicMapModel();
    const map = mapModel.createMap(3);

    this.scene.background = StarryBackground;
    this.scene.backgroundIntensity = 0.05;

    map.hexes().forEach((mapHex) => {
      const [q, r] = mapHex.location;
      const hex = createMapHex(5);

      const v = new Vector3(q, r, -q - r)
        .applyMatrix4(TranslationMatrix)
        .setZ(0);
      hex.position.set(v.x, v.y, v.z);
      this.scene.add(hex);

      if (mapHex.planet) {
        const planet = createPlanet(3.5, PlanetMaterials[mapHex.planet], v);
        this.sprites.push(planet);
        this.scene.add(planet.mesh);
      }
    });

    this.scene.add(this.mouseCursor.mesh);

    this.environmentLights.forEach((light) => {
      this.scene.add(light);
    });
    this.scene.add(this.camera);
    this.animate();
  }

  private onMouseMove(e: MouseEvent) {
    const x = (e.clientX / this.viewSize.width) * 2 - 1;
    const y = -(e.clientY / this.viewSize.height) * 2 + 1;

    const vector = new Vector3(x, y, 0);
    vector.unproject(this.camera);

    const dir = vector.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z - 12;
    const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    this.mouseCursor.mesh.position.copy(pos);
  }

  private animate() {
    this.sprites.forEach((sprite) => {
      sprite.animate();
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}
