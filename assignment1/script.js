import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth * 0.4,
    height: window.innerHeight,
    aspectRatio: window.innerWidth * 0.4 / window.innerHeight
}

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color("rgb(0, 0, 0)")

// Camera
const camera = new THREE.PerspectiveCamera(
    75, 
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(10, 2, 7.5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
************/
//Cave
const caveGeometry = new THREE.PlaneGeometry(15.5, 7.5)
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})
const cave = new THREE.Mesh(caveGeometry, caveMaterial)
cave.rotation.y = Math.PI * 0.5
cave.receiveShadow = true
scene.add(cave);

// Objects
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.05, 41, 20, 10, 7)
const torusKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
torusKnot.position.set(12, 2.5, 0)
torusKnot.castShadow = true
scene.add(torusKnot)

const sphereGeometry = new THREE.SphereGeometry(.5, 32, 16)
const sphereMaterial = new THREE.MeshNormalMaterial() 
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(12, 2.5, 0)
sphere.castShadow = true
scene.add(sphere)

/************
 ** LIGHTS **
 ************/
// Ambient Light
//const ambientLight = new THREE.AmbientLight(0x404040)
//const ambientLight = new THREE.AmbientLight(
//    new THREE.Color('grey')
//)
//scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 4.1, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

// Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)

/**********************
 ** DOM INTERACTIONS **
 **********************/
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

// part-one
document.querySelector('#part-one').onclick = function() {
    domObject.part = 1
}

// part-two
document.querySelector('#part-two').onclick = function() {
    domObject.part = 2
}

// first-change
document.querySelector('#first-change').onclick = function() {
    domObject.firstChange = true
}

// second-change
document.querySelector('#second-change').onclick = function() {
    domObject.secondChange = true
}

// third-change
document.querySelector('#third-change').onclick = function() {
    domObject.thirdChange = true
}

// fourth-change
document.querySelector('#fourth-change').onclick = function() {
    domObject.fourthChange = true
}

/*******
** UI **
********/
// UI
/*
const ui = new dat.GUI()

const lightPositionFolder = ui.addFolder('Light Position')

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Y position')

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Z position')
*/

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()
    
    // part-one
    if(domObject.part === 1)
    {
        camera.position.set(6, 0, 0)
        camera.lookAt(0, 0, 0)
    }

    // part-two
    if(domObject.part === 2)
    {
        camera.position.set(25, 1, 0)
        camera.lookAt(0, 0, 0)
    }

    // first-change
    if(domObject.firstChange)
    {
        torusKnot.rotation.z = elapsedTime
        sphere.position.z = Math.sin(elapsedTime) * .5
    }

    // second-change
    if(domObject.secondChange)
    {    
        torusKnot.position.y = Math.sin(elapsedTime) + 2.5
        sphere.position.y = Math.sin(elapsedTime) + 2.5
    }
    
    // third-change
    if(domObject.thirdChange)
    {
        torusKnot.rotation.x = elapsedTime
        torusKnot.rotation.y = elapsedTime
        sphere.rotation.x = elapsedTime
        sphere.rotation.y = elapsedTime
    }

    // fourth-change
    if(domObject.fourthChange)
    {
        torusKnot.position.z = Math.cos(elapsedTime) * 3
        sphere.position.z = Math.cos(elapsedTime) * 3
    }

    // Update directionalLightHelper
    directionalLightHelper.update()

    // Update OrbitControls
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()