import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three';

const RootThree = Math.sqrt(3);

// function createHex(radius: number, color: number): Mesh {
//   const geometry = new BufferGeometry();
//   const vertices = new Float32Array([
//     -radius, 0, 1, // Left
//     0.5 * radius, -RootThree * radius / 2, 1, // Bottom Right
//     0.5 * radius, RootThree * radius / 2, 1, // Top Right

//     -radius, 0, 1, // Left
//     -0.5 * radius, -RootThree * radius / 2, 1, // Bottom Left
//     0.5 * radius, -RootThree * radius / 2, 1, // Bottom Right

//     0.5 * radius, -RootThree * radius / 2, 1, // Bottom Right
//     radius, 0, 1, // Right
//     0.5 * radius, RootThree * radius / 2, 1, // Top Right

//     -radius, 0, 1, // Left
//     0.5 * radius, RootThree * radius / 2, 1, // Top Right
//     -0.5 * radius, RootThree * radius / 2, 1, // Top left
//   ]);
//   geometry.setAttribute('position', new BufferAttribute(vertices, 3));
//   geometry.computeVertexNormals();
//   const material = new MeshStandardMaterial({ color, opacity: 0.40 });
//   return new Mesh(geometry, material);
// }

export function createMapHex(radius: number): LineSegments {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array([
    -0.5 * radius, RootThree * radius / 2, 1, // Top left
    -radius, 0, 1,

    -radius, 0, 1, // Left
    -0.5 * radius, -RootThree * radius / 2, 1,

    -0.5 * radius, -RootThree * radius / 2, 1, // Bottom Left
    0.5 * radius, -RootThree * radius / 2, 1,

    0.5 * radius, -RootThree * radius / 2, 1, // Bottom Right
    radius, 0, 1,

    radius, 0, 1, // Right
    0.5 * radius, RootThree * radius / 2, 1,

    0.5 * radius, RootThree * radius / 2, 1, // Top Right
    -0.5 * radius, RootThree * radius / 2, 1,


    // -0.5 * radius, RootThree * radius / 2, 1,
    // -0.5 * radius, RootThree * radius / 2, -3,

    // -radius, 0, 1,
    // -radius, 0, -3,

    // -0.5 * radius, -RootThree * radius / 2, 1,
    // -0.5 * radius, -RootThree * radius / 2, -3,

    // 0.5 * radius, -RootThree * radius / 2, 1,
    // 0.5 * radius, -RootThree * radius / 2, -3,

    // radius, 0, 1,
    // radius, 0, -3,

    // 0.5 * radius, RootThree * radius / 2, 1,
    // 0.5 * radius, RootThree * radius / 2, -3,

    // -0.5 * radius, RootThree * radius / 2, -3, // Top left
    // -radius, 0, -3,

    // -radius, 0, -3, // Left
    // -0.5 * radius, -RootThree * radius / 2, -3,

    // -0.5 * radius, -RootThree * radius / 2, -3, // Bottom Left
    // 0.5 * radius, -RootThree * radius / 2, -3,

    // 0.5 * radius, -RootThree * radius / 2, -3, // Bottom Right
    // radius, 0, -3,

    // radius, 0, -3, // Right
    // 0.5 * radius, RootThree * radius / 2, -3,

    // 0.5 * radius, RootThree * radius / 2, -3, // Top Right
    // -0.5 * radius, RootThree * radius / 2, -3,
  ]);
  geometry.setAttribute('position', new BufferAttribute(vertices, 3));
  return new LineSegments(geometry, new LineBasicMaterial({ color: 0x555555, opacity: 0.9 }));
}
