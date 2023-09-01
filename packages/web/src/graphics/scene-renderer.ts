import { AmbientLight, Camera, DirectionalLight, Light, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export type RenderCallback = (scene: Scene) => void;

export class SceneRenderer {
  private readonly camera: Camera;
  private readonly environmentLights: Light[];
  private stopRendering = false;

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly cb: RenderCallback,
  ) {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, -12, 50);
    this.camera.lookAt(0, 0, 0);

    const directionalLight = new DirectionalLight(0xeeeeee, 1);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.position.set(0, 12, 50);
    this.environmentLights = [
      new AmbientLight(0x999999),
      directionalLight,
    ];
  }

  beginRendering() {
    this.animate();
  }

  private animate() {
    // if (this.stopRendering) {
    //   this.stopRendering = false;
    //   return;
    // }

    // requestAnimationFrame(this.animate);

    const scene = new Scene();

    this.cb(scene);

    this.environmentLights.forEach((light) => {
      scene.add(light);
    });
    scene.add(this.camera);

    this.renderer.render(scene, this.camera);
  }
}
