import "./desk.css"
import GavelPad from "./GavelPad"

function Desk({ children, gavelVisible, computer }) {
  return (
    <div className="desk-wrapper">
      <div className="desk-container">
        <div className="desk-surface">
          {computer && <div className="computer-wrapper">{computer}</div>}
          {children}
          {gavelVisible && <GavelPad />}
        </div>

        <div className="desk-structure">
          <div className="desk-drawer">
            <div className="drawer-handle"></div>
          </div>
          <div className="desk-legs">
            <div className="desk-leg left"></div>
            <div className="desk-leg right"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Desk
