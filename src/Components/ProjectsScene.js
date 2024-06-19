import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import NavBar from '../Components/NavBar';
import Menu from '../Components/Menu';
import './ProjectsScene.css';  // Import the CSS file

const ProjectsScene = () => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const cubeGroupRef = useRef(null);
  const cubeRefs = useRef([]);
  const [showMenu, setShowMenu] = useState(false);

  // State for scene parameters
  const [fov, setFov] = useState(75);
  const [near, setNear] = useState(0.1);
  const [far, setFar] = useState(1000);
  const [mobileCameraZ, setMobileCameraZ] = useState(7);
  const [desktopCameraZ, setDesktopCameraZ] = useState(5);
  const [cubeSize, setCubeSize] = useState(1);
  const [cubeSpacing, setCubeSpacing] = useState(1.1);
  const [clearColor, setClearColor] = useState(0xffffff);
  const [colors, setColors] = useState([0xff0000, 0xff6600, 0xffff00, 0x00ff00, 0x0000ff, 0xff00ff]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
    const isMobile = window.innerWidth < 768;
    camera.position.z = isMobile ? mobileCameraZ : desktopCameraZ;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(clearColor, 1);
    rendererRef.current = renderer;
    sceneRef.current.appendChild(renderer.domElement);

    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeGroupRef.current = cubeGroup;

    const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));

    const cubes = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const cube = new THREE.Mesh(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), materials);
          cube.position.set((x - 1) * cubeSpacing, (y - 1) * cubeSpacing, (z - 1) * cubeSpacing);
          cubeGroup.add(cube);
          cubes.push(cube);
        }
      }
    }
    cubeRefs.current = cubes;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (width < 768) {
        camera.position.z = mobileCameraZ;
      } else {
        camera.position.z = desktopCameraZ;
      }
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        sceneRef.current.removeChild(renderer.domElement);
      }
    };
  }, [fov, near, far, mobileCameraZ, desktopCameraZ, cubeSize, cubeSpacing, clearColor, colors]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleColorChange = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const rotateFace = (faceCubes, axis, angle, duration = 0.5) => {
    const pivot = new THREE.Object3D();
    cubeGroupRef.current.add(pivot);

    faceCubes.forEach(cube => {
      pivot.attach(cube);
    });

    gsap.to(pivot.rotation, {
      [axis]: pivot.rotation[axis] + angle,
      duration,
      onComplete: () => {
        faceCubes.forEach(cube => {
          cube.applyMatrix4(pivot.matrix);
          cube.updateMatrixWorld();
          cubeGroupRef.current.attach(cube);
        });
        cubeGroupRef.current.remove(pivot);
      },
    });
  };

  const shuffleCube = () => {
    if (!cubeGroupRef.current) return;

    const axisVectors = {
      x: 'x',
      y: 'y',
      z: 'z',
    };

    const getFaceCubes = (axis, index) => {
      return cubeRefs.current.filter(cube => Math.round(cube.position[axis] / cubeSpacing) === index);
    };

    const shuffleSequence = [];
    for (let i = 0; i < 20; i++) {
      const axis = ['x', 'y', 'z'][Math.floor(Math.random() * 4)];
      const index = [-1, 0, 1][Math.floor(Math.random() * 4)];
      const angle = Math.PI / 2 * (Math.random() > 0.5 ? 1 : -1);
      shuffleSequence.push({ axis, index, angle });
    }

    shuffleSequence.reduce((promise, { axis, index, angle }) => {
      return promise.then(() => {
        return new Promise(resolve => {
          const faceCubes = getFaceCubes(axis, index);
          rotateFace(faceCubes, axisVectors[axis], angle);
          setTimeout(resolve, 500);
        });
      });
    }, Promise.resolve());
  };

  return (
    <div>
      <NavBar toggleMenu={toggleMenu} />
      <Menu showMenu={showMenu} toggleMenu={toggleMenu} />
      <div className="projects-scene-container">
        <div ref={sceneRef} className="projects-scene" />
        <div className="controls">
          <label>
            Cube Size:
            <input type="number" value={cubeSize} onChange={e => setCubeSize(parseFloat(e.target.value))} />
          </label>
          <label>
            Cube Spacing:
            <input type="number" value={cubeSpacing} onChange={e => setCubeSpacing(parseFloat(e.target.value))} />
          </label>
          <label>
            Clear Color:
            <input type="color" value={`#${clearColor.toString(16).padStart(6, '0')}`} onChange={e => setClearColor(parseInt(e.target.value.slice(1), 16))} />
          </label>
          <div className="color-inputs">
            {colors.map((color, index) => (
              <label key={index}>
                Color {index + 1}:
                <input type="color" value={`#${color.toString(16).padStart(6, '0')}`} onChange={e => handleColorChange(index, parseInt(e.target.value.slice(1), 16))} />
              </label>
            ))}
          </div>
          <button onClick={shuffleCube}>Shuffle Cube</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsScene;
