import * as THREE from "three"

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("rgb(72, 60, 89)")

// Camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, 5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)


/***********
** MESHES **
************/
// Sphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const Sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(Sphere)

// Tetrahedron
const tetrahedronGeometry = new THREE.TetrahedronGeometry(1)
const tetrahedronMaterial = new THREE.MeshNormalMaterial()
const Tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial)
scene.add(Tetrahedron)

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate Sphere
    Sphere.position.y = Math.sin(elapsedTime)
    Sphere.position.x = Math.cos(elapsedTime)

    // Animate Tetrahedron
    Tetrahedron.position.y = Math.sin(elapsedTime)
    Tetrahedron.position.x = -Math.cos(elapsedTime)

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()