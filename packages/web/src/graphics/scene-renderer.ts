import { Game, MapHex } from '@gaia-project/engine';
import { EventEmitter } from 'events';
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  Light,
  LineSegments,
  PerspectiveCamera,
  Raycaster,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import {
  HexHighlightMaterial,
  HexHighlightStatus,
  MapTileTranslationMatrix,
  createHighlightHex,
  createMapHex,
  createPlanet,
} from './map';
import { Sprite } from './sprite';

// TODO: Calculate this based on Map Hexes.
const CameraBounds = {
  top: 40,
  left: -30,
  bottom: -80,
  right: 100,
};

const HexRadius = 5;
const StarryBackground = new TextureLoader().load('/stars.jpg');
type MapHexInfo = {
  mesh: LineSegments;
  hex: MapHex;
};

export class SceneRenderer {
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly environmentLights: Light[];
  private readonly mapHexes: Record<string, MapHexInfo>;
  private readonly hexHighlight: Sprite;
  private readonly cameraLookAt: Vector3;
  private readonly sprites: Sprite[] = [];
  private readonly events: EventEmitter;

  private currentMapHex: MapHexInfo | undefined;

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly viewSize: { width: number; height: number },
    private readonly game: Game,
  ) {
    this.events = new EventEmitter();
    renderer.setSize(viewSize.width, viewSize.height);
    this.scene = new Scene();
    this.cameraLookAt = new Vector3(28, 0, 0);
    this.camera = new PerspectiveCamera(
      75,
      viewSize.width / viewSize.height,
      0.1,
      1000,
    );
    this.camera.position.set(28, -45, 90);
    this.camera.lookAt(this.cameraLookAt);
    this.mapHexes = {};

    const directionalLight = new DirectionalLight(0xeeeeee, 0.9);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.position.set(0, 12, 50);
    this.environmentLights = [new AmbientLight(0x999999), directionalLight];

    this.hexHighlight = createHighlightHex(HexRadius);

    const canvas = renderer.domElement;
    // canvas.style.cursor = 'none';
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
    canvas.addEventListener('click', this.onMouseClick.bind(this));
  }

  beginRendering() {
    this.scene.background = StarryBackground;
    this.scene.backgroundIntensity = 0.05;

    this.initMap();
    this.scene.add(this.hexHighlight.mesh);
    this.sprites.push(this.hexHighlight);

    this.environmentLights.forEach((light) => {
      this.scene.add(light);
    });
    this.scene.add(this.camera);
    this.animate();
  }

  setHighlightStatus(status: HexHighlightStatus) {
    this.hexHighlight.mesh.material = HexHighlightMaterial[status];
  }

  on(e: 'hexhighlight' | 'hexclick', handler: (hex: MapHex) => void) {
    this.events.addListener(e, handler);
  }

  private initMap() {
    this.game.context.map.hexes().forEach((mapHex) => {
      const [q, r] = mapHex.location;
      const hexMesh = createMapHex(HexRadius);
      this.mapHexes[hexMesh.id] = {
        hex: mapHex,
        mesh: hexMesh,
      };

      const v = new Vector3(q, r, -q - r)
        .applyMatrix4(MapTileTranslationMatrix)
        .setZ(0);
      hexMesh.position.set(v.x, v.y, v.z);
      this.scene.add(hexMesh);

      if (mapHex.planet) {
        const planet = createPlanet(3.5, mapHex.planet, v);
        this.sprites.push(planet);
        this.scene.add(planet.mesh);
      }
    });
  }

  private onMouseMove(e: MouseEvent) {
    const mousePosition = new Vector2(
      (e.offsetX / this.viewSize.width) * 2 - 1,
      -(e.offsetY / this.viewSize.height) * 2 + 1,
    );

    if (e.buttons === 1) {
      // User is holding down the left mouse button. Move the camera!
      const scalingFactor = -0.25;
      const movement = new Vector3(e.movementX, -e.movementY, 0);
      const newCameraPosition = this.camera.position
        .clone()
        .addScaledVector(movement, scalingFactor);

      if (newCameraPosition.x < CameraBounds.left) {
        newCameraPosition.setX(CameraBounds.left);
      }

      if (newCameraPosition.x > CameraBounds.right) {
        newCameraPosition.setX(CameraBounds.right);
      }

      if (newCameraPosition.y > CameraBounds.top) {
        newCameraPosition.setY(CameraBounds.top);
      }

      if (newCameraPosition.y < CameraBounds.bottom) {
        newCameraPosition.setY(CameraBounds.bottom);
      }

      this.camera.position.set(
        newCameraPosition.x,
        newCameraPosition.y,
        newCameraPosition.z,
      );
    }

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
    if (e.deltaY) {
      // Vertical scroll controls zoom.
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
    }

    /*
    TODO: Figure this out later.... how do I rotate the camera around the Y-axis at thelook-at point?
      1. Find the look at point... Project camera onto Z plane? Just track it in memory?
      2. Calculate camera rotation around that point.
      3. Maintain camera orentiation so that it stays looking at the same point.
    */

    // if (e.deltaX) {
    //   // Horizontal scroll controls rotation about the Y-axis.
    //   const rotateFactor = e.deltaX * 0.01;
    //   const quat = new Quaternion();
    //   quat.setFromAxisAngle(new Vector3(0, 1, 0), rotateFactor);
    //   this.camera.position.applyQuaternion(quat);
    // }

    // Stop the page from scrolling up/down in the browser.
    e.preventDefault();
  }

  private onMouseClick(e: MouseEvent) {
    // TODO: Refactor... there is a lot of code duplicated from mouse move.
    const mousePosition = new Vector2(
      (e.offsetX / this.viewSize.width) * 2 - 1,
      -(e.offsetY / this.viewSize.height) * 2 + 1,
    );

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mousePosition, this.camera);
    const intersections = raycaster.intersectObjects(this.scene.children);
    for (const intersection of intersections) {
      const hex = this.mapHexes[intersection.object.id];
      if (hex) {
        this.events.emit('hexclick', hex.hex);
        break;
      }
    }
  }

  private setHighlightedHex(hex: MapHexInfo) {
    if (this.currentMapHex?.mesh.id !== hex.mesh.id) {
      const { x, y, z } = hex.mesh.position;
      this.hexHighlight.mesh.position.set(x, y, z);
      this.currentMapHex = hex;
      this.events.emit('hexhighlight', hex.hex);
    }
  }

  private animate() {
    this.sprites.forEach((sprite) => {
      sprite.animate();
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}
