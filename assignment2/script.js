import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

// Resizing
window.addEventListener('resize', () => 
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight

    // Update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


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
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 12, -20)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/***********
** LIGHTS **
************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)


/***********
** MESHES **
************/

const flickeringCubes = []

const drawCube = (height, params) => 
{
    let geometry;
    // Checks if we need to draw a cube, ring, or a torus knot
    if (params.term === 'lightning') {
        geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 8, 20, 1, 20); // Lightning remains a torus knot
    } else if (params.term === 'quest') {
        geometry = new THREE.TorusGeometry(0.4, 0.15, 16, 100); // Rings for Term 1
    } else {
        geometry = new THREE.SphereGeometry(0.25, 16, 16); // Replaced BoxGeometry with SphereGeometry
    }

    // Create cube material
    let material
    if(params.emmissive)
    {
        material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(params.color),
            emissive: new THREE.Color(params.color), //Apply emissive volor
            emissiveIntensity: 100, // Increase intensity for more glow
            transparent: true, // Makes the material partially transparent for ethereal look
            opacity: 0.8 // Slight opacity
        })
            
        flickeringCubes.push(material) // Store material for flickering effect
    } 

    else
    {
        material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(params.color)
        })
    }

    // Create mesh based on the geometry
    const mesh = new THREE.Mesh(geometry, material)

    // Position cube
    mesh.position.x = (Math.random() - 0.5) * params.diameter
    mesh.position.z = (Math.random() - 0.5) * params.diameter
    mesh.position.y = height - 10

    // Scale cube
    mesh.scale.x = params.scale
    mesh.scale.y = params.scale
    mesh.scale.z = params.scale

    // Dynamic scale
    if(params.dynamicScale)
    {
        mesh.scale.x = height * 0.05
        mesh.scale.y = height * 0.05
        mesh.scale.z = height * 0.05
    }

    // Randomize cube rotation
    if(params.randomized)
    {
        mesh.rotation.x = Math.random() * 2 * Math.PI
        mesh.rotation.z = Math.random() * 2 * Math.PI
        mesh.rotation.y = Math.random() * 2 * Math.PI
    }

    // Rotate the torus to make it horizontal (lying flat along the XZ plane)
    mesh.rotation.x = Math.PI / 2; // Rotate by 90 degrees on the X-axis to make it horizontal
    
    // Add cube to group
    params.group.add(mesh)
}


/*******
** UI **
********/
// UI
const ui = new dat.GUI()

let preset = {}

// Groups
const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)

const uiObj = {
    sourceText: "",
    saveSourceText() {
        saveSourceText()
    },
    term1:
    {
        term: 'quest',
        color: '#D72638',
        diameter: 5,
        dynamicScale: true,
        emmissive: false,
        group: group1,
        nCubes: 50,
        randomized: false,
        scale: 100
    },
    term2:
    {
        term: 'lightning',
        color: '#FFFF33',
        diameter: 10,
        dynamicScale: false,
        emmissive: true,
        group: group2,
        nCubes: 50,
        randomized: true,
        scale: 0.5,
        emissiveIntensity: 100,
    },
    term3:
    {
        term: 'hero',
        color: '#2B65EC',
        diameter: 10,
        dynamicScale: false,
        emmissive: false,
        group: group3,
        nCubes: 50,
        randomized: true,
        scale: 1
    },
    saveTerms() {
        saveTerms()
    },
    rotateCamera: false
}

// UI Functions
const saveSourceText = () =>
{
    // UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // Text Analysis
    tokenizedSourceText(uiObj.sourceText)
}

const saveTerms = () =>
{
    // UI
    preset = ui.save
    visualizeFolder.hide()
    cameraFolder.show()

    // Text Analysis
    findSearchTermInTokenizedText(uiObj.term1)
    findSearchTermInTokenizedText(uiObj.term2)
    findSearchTermInTokenizedText(uiObj.term3)
}

// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

// Terms, Visualize, and Camera Folders 
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")

termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .add(group1, 'visible')
    .name("Term 1 Visibility")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .add(group2, 'visible')
    .name("Term 2 Visibility")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .add(group3, 'visible')
    .name("Term 3 Visibility")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

cameraFolder
    .add(uiObj, 'rotateCamera')
    .name("Turntable")

// Terms, Visualize, and Camera folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()

/*******************
 ** TEXT ANALYSIS **
 *******************/
// Variables
let parsedText, tokenizedText

// Parse and Tokenizesd sourceText
const tokenizedSourceText = (sourceText) =>
{
    // Strip periods and downcase sourceText
    parsedText = sourceText.replaceAll(".", "").toLowerCase()
    
    // Tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// Find searchTerm in tokenizedText
const findSearchTermInTokenizedText = (params) =>
{
    // Use a for loop to go through the tokenizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        // If tokenizedtext[i] matches our searchTerm, then we draw a cube
        if(tokenizedText[i] === params.term){
            // convert i into height, which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2
            
            // call drawCube function 100 times using converted height value
            for (let a = 0; a < params.nCubes; a++)
            {
                drawCube(height, params)
            }
        }
    }
}

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Update OrbitControls
    controls.update()

    // Rotate Camera
    if(uiObj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 20
        camera.position.z = Math.cos(elapsedTime * 0.1) * 20
        camera.position.y = 10
        camera.lookAt(0, 0, 0)
    }

    // Flickering effect for lightning cubes
    flickeringCubes.forEach(material => {
        material.emissiveIntensity = 0.5 + Math.random() * 1  // Flickers between 0.5 and 1
    })

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()