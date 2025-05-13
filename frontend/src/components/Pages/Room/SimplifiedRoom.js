// "use client"
// import { Environment, Float, Html, Plane, RoundedBox } from "@react-three/drei"
// import { useFrame } from "@react-three/fiber"
// import { useEffect, useRef, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import * as THREE from "three"
// import GroceryPopUp from "../GroceryPage/GroceryPopUp"
// // --- Homey Color Palette (Revised) ---
// const COLOR_WALL_MUTED_TAN = "#bfa890" // Darker, muted tan for walls
// const COLOR_FLOOR_WOOD = "#deb887" // Burlywood (keeping for floor)
// const COLOR_FURNITURE_WOOD = "#cd853f" // Peru (main desk wood)
// const COLOR_WOOD_DARK = "#8b4513" // Saddle Brown (wood accents)
// const COLOR_ACCENT_RED = "#b22222" // Firebrick red accent
// const COLOR_ACCENT_GREEN = "#556b2f" // Dark olive green accent
// const COLOR_FRIDGE_STEEL = "#c4c8cf" // Lighter Steel color
// const COLOR_METAL_DARK_STEEL = "#6c757d" // Darker steel for handle/accents
// const COLOR_METAL_BRASS = "#b8860b" // Dark goldenrod/brass (for knobs/lamp)
// const COLOR_TRASHCAN_BLACK = "#212529" // Very dark grey/off-black
// const COLOR_RUG_BLUE = "#4682b4" // Steel Blue for rug
// const COLOR_CORK = "#c19a6b" // Cork color (checked)
// const COLOR_PAPER_WHITE = "#ffffff"
// const COLOR_PAPER_YELLOW = "#ffffe0"
// const COLOR_PAPER_BLUE = "#add8e6"

// export default function SimplifiedRoom(roomData) {
//   const roomRef = useRef(null)
//   const navigate = useNavigate()

//   // Defaults updated
//   const [baseColor, setBaseColor] = useState(COLOR_WALL_MUTED_TAN) // Darker wall default
//   const [darkColor, setDarkColor] = useState(COLOR_FLOOR_WOOD)
//   useEffect(() => {
//     alert("Room loaded" + roomData.roomData?.roomName)
//     const s = getComputedStyle(document.documentElement)
//     const bg = s.getPropertyValue("--background-color")?.trim() || COLOR_WALL_MUTED_TAN
//     const bgDark = s.getPropertyValue("--background-color-dark")?.trim() || COLOR_FLOOR_WOOD
//     setBaseColor(bg)
//     setDarkColor(bgDark)
//   }, [])

//   // Floating animation (kept exactly as original)
//   useFrame((st) => {
//     if (roomRef.current) {
//       roomRef.current.position.y = Math.sin(st.clock.getElapsedTime() * 0.2) * 0.1
//     }
//   })

//   // Popup states
//   const [showComputerPopup, setShowComputerPopup] = useState(false)
//   const [showFridgePopup, setShowFridgePopup] = useState(false)
//   const [showBulletinPopup, setShowBulletinPopup] = useState(false)

//   // Click handlers
//   const handleFridgeClick = () => setShowFridgePopup(true)
//   const handleComputerClick = () => setShowComputerPopup(true)
//   const handleBulletinClick = () => setShowBulletinPopup(true)
//   const handleTrashcanClick = () => {
//     navigate("/chores")
//   }

//   return (
//     <>
//       {/* Lighting adjusted slightly for darker walls */}
//       <ambientLight intensity={0.6} /> {/* Slightly less ambient */}
//       <directionalLight
//         position={[5, 10, 7]}
//         intensity={1.0} // Slightly brighter direct light
//         castShadow
//         color={"#fff3e0"} // Warm light color
//         shadow-mapSize-width={1024} // Improve shadow quality slightly
//         shadow-mapSize-height={1024}
//       />
//       <Environment preset="sunset" blur={0.8} background={false} />
//       <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
//         <group ref={roomRef}>
//           {/* Floor - Wood Material */}
//           <mesh position={[0, -2, 0]} receiveShadow castShadow>
//             <boxGeometry args={[20, 0.2, 20]} />
//             <meshStandardMaterial
//               color={darkColor} // COLOR_FLOOR_WOOD
//               roughness={0.7}
//               metalness={0.05}
//             />
//           </mesh>

//           {/* Back Wall - Muted Tan */}
//           <mesh position={[0, 3, -10]} receiveShadow castShadow>
//             <boxGeometry args={[20, 10, 0.2]} />
//             <meshStandardMaterial
//               color={baseColor} // COLOR_WALL_MUTED_TAN
//               roughness={0.85} // Slightly rougher wall
//               metalness={0.0}
//             />
//           </mesh>

//           {/* Left Wall - Muted Tan */}
//           <mesh position={[-10, 3, 0]} receiveShadow castShadow>
//             <boxGeometry args={[0.2, 10, 20]} />
//             <meshStandardMaterial color={baseColor} roughness={0.85} metalness={0.0} />
//           </mesh>

//           {/* Fridge - Stainless Steel (Kept original transforms) */}
//           <MetallicFridgeMesh // Renamed for clarity
//             position={[-7, 1.7, 5]} // Original position
//             rotation={[0, Math.PI / 2, 0]} // Original rotation
//             scale={[1.5, 1.5, 1.5]} // Original scale
//             onClick={handleFridgeClick}
//           />

//           {/* Trashcan - Black (Kept original transforms) */}
//           <BlackTrashcanMesh // Renamed for clarity
//             position={[-8.7, -1, -8]} // Original position
//             scale={[1, 1, 1]} // Original scale
//             onClick={handleTrashcanClick}
//           />

//           {/* Detailed Bulletin Board (Kept original transforms) */}
//           <DetailedBulletinBoard
//             position={[-9.6, 3.5, -3]} // Original position
//             rotation={[0, Math.PI / 2, 0]} // Original rotation
//             scale={[2, 1.5, 1]} // Original scale
//             onClick={handleBulletinClick}
//           />

//           {/* Desk + Computer - Homey Style, Checked Materials (Kept original transforms) */}
//           <HomeyDeskWithComputer
//             position={[0, -2, -8]} // Original position
//             rotation={[0, Math.PI, 0]} // Original rotation
//             scale={[2.5, 2.5, 2.5]} // Original scale
//             onComputerClick={handleComputerClick}
//           />

//           {/* Rug - Blue (Kept original transforms) */}
//           <BlueRugMesh // Renamed for clarity
//             position={[0, -1.85, 0]} // Original position
//             rotation={[Math.PI / 2, 0, 0]} // Original rotation
//             scale={[1, 1, 1]} // Original scale
//           />
//         </group>
//       </Float>
//       {/* Computer Popup */}
//       {showComputerPopup && (
//         <Html fullscreen>
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               background: "rgba(50, 30, 20, 0.6)",
//               backdropFilter: "blur(3px)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontFamily: "sans-serif",
//             }}
//           >
//             <div
//               style={{
//                 background: "#fffaf0",
//                 color: "#5d4037",
//                 padding: "1.5rem 2rem",
//                 borderRadius: "8px",
//                 textAlign: "center",
//                 boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                 maxWidth: "500px",
//               }}
//             >
//               <h2 style={{ marginTop: 0, color: COLOR_WOOD_DARK }}>Computer</h2>
//               <p>Access room settings, invites, and bills.</p>
//               <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
//                 <button
//                   onClick={() => alert("Settings clicked")}
//                   style={{
//                     padding: "0.5em 1.5em",
//                     border: "none",
//                     borderRadius: "4px",
//                     backgroundColor: COLOR_ACCENT_GREEN,
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "1em",
//                   }}
//                 >
//                   Settings
//                 </button>
//                 <button
//                   onClick={() => alert("Invites clicked")}
//                   style={{
//                     padding: "0.5em 1.5em",
//                     border: "none",
//                     borderRadius: "4px",
//                     backgroundColor: COLOR_ACCENT_GREEN,
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "1em",
//                   }}
//                 >
//                   Invites
//                 </button>
//                 <button
//                   onClick={() => alert("Bills clicked")}
//                   style={{
//                     padding: "0.5em 1.5em",
//                     border: "none",
//                     borderRadius: "4px",
//                     backgroundColor: COLOR_ACCENT_GREEN,
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "1em",
//                   }}
//                 >
//                   Bills
//                 </button>
//               </div>
//               <button
//                 onClick={() => setShowComputerPopup(false)}
//                 style={{
//                   padding: "0.5em 1.5em",
//                   border: "none",
//                   borderRadius: "4px",
//                   backgroundColor: COLOR_ACCENT_RED,
//                   color: "white",
//                   cursor: "pointer",
//                   fontSize: "1em",
//                   marginTop: "20px",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </Html>
//       )}
//       {/* Fridge Popup */}
//       {showFridgePopup && (
//         <Html fullscreen>
//           <GroceryPopUp
//             room={roomData}
//             isOpen={showFridgePopup}
//             onClose={() => setShowFridgePopup(false)}
//           />
//         </Html>
//       )}

//       {/* Bulletin Board Popup */}
//       {showBulletinPopup && (
//         <Html fullscreen>
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               background: "rgba(50, 30, 20, 0.6)",
//               backdropFilter: "blur(3px)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontFamily: "sans-serif",
//             }}
//           >
//             <div
//               style={{
//                 background: "#fffaf0",
//                 color: "#5d4037",
//                 padding: "1.5rem 2rem",
//                 borderRadius: "8px",
//                 boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                 maxWidth: "600px",
//                 maxHeight: "80vh",
//                 overflow: "auto",
//               }}
//             >
//               <h2 style={{ marginTop: 0, color: COLOR_WOOD_DARK }}>Bulletin Board</h2>

//               <div style={{ marginBottom: "20px" }}>
//                 <h3 style={{ color: COLOR_ACCENT_GREEN }}>Quiet Hours</h3>
//                 <p>Monday - Friday: 10:00 PM - 7:00 AM</p>
//                 <p>Weekends: 12:00 AM - 9:00 AM</p>
//               </div>

//               <div style={{ marginBottom: "20px" }}>
//                 <h3 style={{ color: COLOR_ACCENT_GREEN }}>Room Notes</h3>
//                 <div
//                   style={{
//                     backgroundColor: COLOR_PAPER_YELLOW,
//                     padding: "15px",
//                     borderRadius: "4px",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <p style={{ margin: 0 }}>WiFi password: RoomEase2023!</p>
//                 </div>
//                 <div
//                   style={{
//                     backgroundColor: COLOR_PAPER_BLUE,
//                     padding: "15px",
//                     borderRadius: "4px",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <p style={{ margin: 0 }}>Maintenance coming on Thursday at 2pm</p>
//                 </div>
//               </div>

//               <div style={{ marginBottom: "20px" }}>
//                 <h3 style={{ color: COLOR_ACCENT_GREEN }}>Room Clauses</h3>
//                 <ul>
//                   <li>No loud music after quiet hours</li>
//                   <li>Clean dishes within 24 hours</li>
//                   <li>Take turns buying common supplies</li>
//                 </ul>
//               </div>

//               <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//                 <button
//                   onClick={() => alert("Edit notes clicked")}
//                   style={{
//                     padding: "0.5em 1.5em",
//                     border: "none",
//                     borderRadius: "4px",
//                     backgroundColor: COLOR_ACCENT_GREEN,
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "1em",
//                   }}
//                 >
//                   Edit Notes
//                 </button>
//                 <button
//                   onClick={() => setShowBulletinPopup(false)}
//                   style={{
//                     padding: "0.5em 1.5em",
//                     border: "none",
//                     borderRadius: "4px",
//                     backgroundColor: COLOR_ACCENT_RED,
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "1em",
//                   }}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Html>
//       )}
//     </>
//   )
// }

// // --- Updated Components with Click Handlers ---

// function BlueRugMesh({ position, rotation, scale }) {
//   // Rug with blue color
//   return (
//     <group position={position} rotation={rotation} scale={scale}>
//       <mesh position={[0, 0, -0.01]}>
//         <Plane args={[10.2, 10.2]}>
//           <meshStandardMaterial color={COLOR_RUG_BLUE} roughness={0.9} metalness={0.05} side={THREE.BackSide} />
//         </Plane>
//       </mesh>
//     </group>
//   )
// }

// function MetallicFridgeMesh({ position, rotation, scale, onClick }) {
//   // Fridge with stainless steel look
//   const [hovered, setHovered] = useState(false)
//   return (
//     <group position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
//       {/* Main Body - Steel */}
//       <mesh castShadow receiveShadow>
//         <boxGeometry args={[2.4, 4.8, 2]} />
//         <meshStandardMaterial
//           color={COLOR_FRIDGE_STEEL}
//           roughness={0.2} // Shinier for steel
//           metalness={0.9} // High metalness
//         />
//       </mesh>
//       {/* Door - Steel */}
//       <mesh
//         position={[0, 0, 1.01]}
//         onClick={onClick}
//         onPointerOver={() => setHovered(true)}
//         onPointerOut={() => setHovered(false)}
//       >
//         <boxGeometry args={[2.3, 4.6, 0.1]} />
//         <meshStandardMaterial
//           color={hovered ? "#d1d5db" : COLOR_FRIDGE_STEEL} // Subtle hover on steel
//           roughness={0.25} // Slightly different roughness for door
//           metalness={0.85}
//         />
//       </mesh>
//       {/* Handle - Darker Steel */}
//       <mesh position={[0.9, 0, 1.12]} castShadow>
//         <boxGeometry args={[0.06, 1.2, 0.06]} />
//         <meshStandardMaterial
//           color={COLOR_METAL_DARK_STEEL} // Darker steel handle
//           roughness={0.3}
//           metalness={0.9}
//         />
//       </mesh>
//     </group>
//   )
// }

// function BlackTrashcanMesh({ position, scale, onClick }) {
//   // Trashcan changed to black with click handler
//   const [hovered, setHovered] = useState(false)
//   return (
//     <group position={position} scale={scale} castShadow>
//       <mesh
//         castShadow
//         receiveShadow
//         onClick={onClick}
//         onPointerOver={() => setHovered(true)}
//         onPointerOut={() => setHovered(false)}
//       >
//         <cylinderGeometry args={[0.9, 0.9, 2.4, 32, 1, false]} />
//         <meshStandardMaterial
//           color={hovered ? "#3a3a3a" : COLOR_TRASHCAN_BLACK} // Subtle hover effect
//           roughness={0.5} // Semi-matte finish
//           metalness={0.2} // Slightly metallic plastic/metal
//         />
//       </mesh>
//       <mesh position={[0, 1.2, 0]} castShadow>
//         <cylinderGeometry args={[0.91, 0.91, 0.1, 32]} />
//         <meshStandardMaterial color={COLOR_TRASHCAN_BLACK} roughness={0.5} metalness={0.2} />
//       </mesh>
//     </group>
//   )
// }

// function DetailedBulletinBoard({ position, rotation, scale, onClick }) {
//   // Bulletin board with click handler
//   const [hovered, setHovered] = useState(false)
//   return (
//     <group
//       position={position}
//       rotation={rotation}
//       scale={scale}
//       onClick={onClick}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//     >
//       {/* Board frame - Wood */}
//       <mesh castShadow receiveShadow>
//         <boxGeometry args={[3, 2, 0.1]} />
//         <meshStandardMaterial
//           color={hovered ? "#9c6b4a" : COLOR_WOOD_DARK} // Subtle hover effect
//           roughness={0.75} // Slightly rougher wood
//           metalness={0.1} // Low metalness
//         />
//       </mesh>
//       {/* Corkboard surface */}
//       <mesh position={[0, 0, 0.051]} receiveShadow>
//         {" "}
//         {/* Base Z offset */}
//         <planeGeometry args={[2.8, 1.8]} />
//         <meshStandardMaterial
//           color={COLOR_CORK} // #c19a6b
//           roughness={0.9} // High roughness
//           metalness={0.0} // No metalness
//         />
//       </mesh>

//       {/* Pinned Items - Ensure Z > 0.051 */}
//       {/* Item 1: White Note */}
//       <mesh position={[-0.8, 0.5, 0.06]} rotation={[0, 0, -0.1]}>
//         {" "}
//         {/* Z=0.06 */}
//         <planeGeometry args={[0.8, 0.6]} />
//         <meshStandardMaterial color={COLOR_PAPER_WHITE} roughness={0.8} metalness={0} side={THREE.DoubleSide} />
//       </mesh>
//       <mesh position={[-0.9, 0.85, 0.07]}>
//         {" "}
//         {/* Pin Z=0.07 */}
//         <sphereGeometry args={[0.03, 8, 8]} />
//         <meshStandardMaterial color={COLOR_ACCENT_RED} roughness={0.5} metalness={0.2} />
//       </mesh>

//       {/* Item 2: Blue Note */}
//       <mesh position={[0.7, -0.2, 0.06]} rotation={[0, 0, 0.2]}>
//         {" "}
//         {/* Z=0.06 */}
//         <planeGeometry args={[0.6, 0.4]} />
//         <meshStandardMaterial color={COLOR_PAPER_BLUE} roughness={0.8} metalness={0} side={THREE.DoubleSide} />
//       </mesh>
//       <mesh position={[0.6, 0.1, 0.07]}>
//         {" "}
//         {/* Pin Z=0.07 */}
//         <sphereGeometry args={[0.03, 8, 8]} />
//         <meshStandardMaterial color={COLOR_ACCENT_RED} roughness={0.5} metalness={0.2} />
//       </mesh>

//       {/* Item 3: Yellow Sticky Note */}
//       <mesh position={[0.1, 0.6, 0.06]} rotation={[0, 0, 0.05]}>
//         {" "}
//         {/* Z=0.06 */}
//         <planeGeometry args={[0.5, 0.5]} />
//         <meshStandardMaterial color={COLOR_PAPER_YELLOW} roughness={0.8} metalness={0} side={THREE.DoubleSide} />
//       </mesh>
//       <mesh position={[0.05, 0.8, 0.07]}>
//         {" "}
//         {/* Pin Z=0.07 */}
//         <sphereGeometry args={[0.03, 8, 8]} />
//         <meshStandardMaterial color={"#0000ff"} roughness={0.5} metalness={0.2} />
//       </mesh>

//       {/* Item 4: Small Photo Placeholder */}
//       <mesh position={[-0.5, -0.5, 0.06]} rotation={[0, 0, -0.02]}>
//         {" "}
//         {/* Z=0.06 */}
//         <planeGeometry args={[0.7, 0.5]} />
//         <meshStandardMaterial color={"#aaaaaa"} roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
//       </mesh>
//       <mesh position={[-0.7, -0.2, 0.07]}>
//         {" "}
//         {/* Pin Z=0.07 */}
//         <sphereGeometry args={[0.03, 8, 8]} />
//         <meshStandardMaterial color={"#008000"} roughness={0.5} metalness={0.2} />
//       </mesh>

//       {/* Item 5: Another White Note */}
//       <mesh position={[0.9, 0.7, 0.06]} rotation={[0, 0, -0.15]}>
//         {" "}
//         {/* Z=0.06 */}
//         <planeGeometry args={[0.4, 0.6]} />
//         <meshStandardMaterial color={COLOR_PAPER_WHITE} roughness={0.8} metalness={0} side={THREE.DoubleSide} />
//       </mesh>
//       <mesh position={[0.8, 0.95, 0.07]}>
//         {" "}
//         {/* Pin Z=0.07 */}
//         <sphereGeometry args={[0.03, 8, 8]} />
//         <meshStandardMaterial color={COLOR_ACCENT_RED} roughness={0.5} metalness={0.2} />
//       </mesh>
//     </group>
//   )
// }

// function HomeyDeskWithComputer({ position, rotation, scale, onComputerClick }) {
//   const [hovered, setHovered] = useState(false)

//   // Original dimensions kept
//   const legH = 1.2
//   const topTh = 0.1
//   const deskTopY = legH + topTh / 2
//   const monH = 1
//   const monY = deskTopY + topTh / 2 + monH / 2

//   // Define wood materials here for consistency
//   const mainWoodMaterial = new THREE.MeshStandardMaterial({
//     color: COLOR_FURNITURE_WOOD, // Peru #cd853f
//     roughness: 0.7,
//     metalness: 0.1,
//   })
//   const darkWoodMaterial = new THREE.MeshStandardMaterial({
//     color: COLOR_WOOD_DARK, // Saddle Brown #8b4513
//     roughness: 0.75,
//     metalness: 0.1,
//   })

//   return (
//     <group position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
//       {/* Legs - Wood Material */}
//       {[
//         [1.4, legH / 2, 0.7],
//         [-1.4, legH / 2, 0.7],
//         [1.4, legH / 2, -0.7],
//         [-1.4, legH / 2, -0.7],
//       ].map((p, i) => (
//         <group key={i}>
//           <mesh position={p} castShadow material={mainWoodMaterial}>
//             <boxGeometry args={[0.1, legH, 0.1]} />
//           </mesh>
//           {/* Foot caps - Darker Wood */}
//           <mesh position={[p[0], 0.05, p[2]]} castShadow material={darkWoodMaterial}>
//             <sphereGeometry args={[0.06, 16, 16]} />
//           </mesh>
//         </group>
//       ))}

//       {/* Tabletop - Wood Material */}
//       <group>
//         <mesh position={[0, deskTopY, 0]} castShadow receiveShadow material={mainWoodMaterial}>
//           <boxGeometry args={[3, topTh, 1.5]} />
//         </mesh>
//         {/* Edge Frame - Darker Wood */}
//         <mesh position={[0, deskTopY + topTh / 2 - 0.02, 0]} material={darkWoodMaterial}>
//           <boxGeometry args={[3.04, 0.04, 1.54]} />
//         </mesh>
//       </group>

//       {/* Keyboard - Beige/Grey Plastic Look */}
//       <group position={[0, deskTopY - topTh + 0.2, -0.3]}>
//         <mesh castShadow>
//           <boxGeometry args={[1.2, 0.05, 0.6]} />
//           <meshStandardMaterial color={"#d1d5db"} roughness={0.6} metalness={0.1} />
//         </mesh>
//         {Array.from({ length: 3 }).map((_, row) =>
//           Array.from({ length: 8 }).map((__, col) => (
//             <mesh key={`key-${row}-${col}`} position={[-0.56 + col * 0.16, 0.06, (row - 1) * 0.18]}>
//               <boxGeometry args={[0.12, 0.02, 0.12]} />
//               <meshStandardMaterial color={"#f3f4f6"} roughness={0.7} metalness={0.1} />
//             </mesh>
//           )),
//         )}
//       </group>

//       {/* Pedestal - Wood Material */}
//       <group>
//         <mesh position={[0.85, legH / 2, 0]} castShadow receiveShadow material={mainWoodMaterial}>
//           <boxGeometry args={[0.6, legH, 1.2]} />
//         </mesh>
//         {[legH - 0.3, 0.5].map((y, idx) => (
//           <group key={idx} position={[1.4, y, 0]}>
//             {/* Drawer Front - Darker Wood */}
//             <mesh castShadow material={darkWoodMaterial}>
//               <boxGeometry args={[0.5, 0.4, 1.1]} />
//             </mesh>
//             {/* Handle - Brass Knob */}
//             <mesh position={[0, 0, 0.55]}>
//               <sphereGeometry args={[0.04, 16, 8]} />
//               <meshStandardMaterial color={COLOR_METAL_BRASS} roughness={0.4} metalness={0.7} />
//             </mesh>
//           </group>
//         ))}
//       </group>

//       {/* Monitor - Standard Look */}
//       <group position={[0, monY - monH / 2, 0.5]} rotation={[0, -Math.PI, 0]}>
//         {/* Stand and Base */}
//         <mesh castShadow position={[0, 0.1, 0]}>
//           <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
//           <meshStandardMaterial color={"#4b5563"} roughness={0.5} metalness={0.2} />
//         </mesh>
//         <mesh position={[0, -0.15, 0]} castShadow>
//           <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
//           <meshStandardMaterial color={"#4b5563"} roughness={0.5} metalness={0.2} />
//         </mesh>
//         {/* Bezel */}
//         <mesh position={[0, monH / 2 + 0.3, 0]}>
//           <boxGeometry args={[1.55, monH + 0.05, 0.08]} />
//           <meshStandardMaterial color={"#4b5563"} roughness={0.6} metalness={0.1} />
//         </mesh>
//         {/* Screen */}
//         <mesh
//           position={[0, monH / 2 + 0.3, 0.041]}
//           onClick={onComputerClick}
//           onPointerOver={() => setHovered(true)}
//           onPointerOut={() => setHovered(false)}
//         >
//           <planeGeometry args={[1.5, monH]} />
//           <meshStandardMaterial
//             color={"#000000"}
//             emissive={"#d1d5db"}
//             emissiveIntensity={hovered ? 0.6 : 0.4}
//             roughness={0.4}
//             metalness={0.1}
//             toneMapped={false}
//           />
//         </mesh>
//       </group>

//       {/* Desk Lamp - Brass/Classic Look */}
//       <group>
//         {/* Base & Stem */}
//         <mesh position={[-1, deskTopY + 0.01, 0.6]} castShadow>
//           <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
//           <meshStandardMaterial color={COLOR_METAL_BRASS} roughness={0.4} metalness={0.8} />
//         </mesh>
//         <mesh position={[-1, deskTopY + 0.3, 0.6]} castShadow>
//           <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
//           <meshStandardMaterial color={COLOR_METAL_BRASS} roughness={0.4} metalness={0.8} />
//         </mesh>
//         {/* Bulb/Head */}
//         <mesh position={[-0.97, deskTopY + 0.58, 0.6]} castShadow>
//           <sphereGeometry args={[0.1, 16, 16]} />
//           <meshStandardMaterial
//             color={"#ffffff"}
//             emissive={"#fff3e0"}
//             emissiveIntensity={1.2}
//             roughness={0.7}
//             metalness={0.1}
//             toneMapped={false}
//           />
//         </mesh>
//       </group>

//       {/* Stack of Books */}
//       <group position={[-0.8, deskTopY + 0.05, 0.2]}>
//         <mesh castShadow receiveShadow>
//           <boxGeometry args={[0.4, 0.1, 0.3]} />
//           <meshStandardMaterial color={COLOR_ACCENT_GREEN} roughness={0.7} metalness={0.1} />
//         </mesh>
//         <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
//           <boxGeometry args={[0.4, 0.1, 0.3]} />
//           <meshStandardMaterial color={COLOR_ACCENT_RED} roughness={0.7} metalness={0.1} />
//         </mesh>
//       </group>

//       {/* Mouse and Pad */}
//       <group position={[0.6, deskTopY + 0.01, -0.2]}>
//         <mesh castShadow>
//           <RoundedBox args={[0.16, 0.06, 0.24]} radius={0.02} smoothness={4}>
//             <meshStandardMaterial color={"#d1d5db"} roughness={0.6} metalness={0.1} />
//           </RoundedBox>
//         </mesh>
//         <mesh position={[0, -0.02, 0]}>
//           <planeGeometry args={[0.4, 0.3]} />
//           <meshStandardMaterial color={COLOR_WOOD_DARK} roughness={0.8} metalness={0.1} />
//         </mesh>
//       </group>
//     </group>
//   )
// }
