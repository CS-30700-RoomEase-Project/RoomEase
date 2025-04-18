import "./desk.css"
import GavelPad from "./GavelPad"

function Desk({ children, gavelVisible, computer }) {
  return (
    <div className="desk-wrapper">
      <div className="desk-container">
        <div className="desk-surface">
          <div className="desk-items">
            {computer && <div className="computer-wrapper">{computer}</div>}
            
            {gavelVisible && (
              <div className="gavel-wrapper">
                {children}
                <GavelPad />
              </div>
            )}
          </div>
        </div>

        <div className="desk-structure">
        <div className="desk-drawer">
          {[...Array(1)].map((_, idx) => (
            <div key={idx} className="desk-drawer-segment">
              <div className="drawer-segment-handle"></div>
            </div>
          ))}
        </div>

          <div className="desk-legs">
            <div className="desk-leg left">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="desk-drawer-segment">
                  <div className="drawer-segment-handle"></div>
                </div>
              ))}
            </div>
            <div className="desk-leg right">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="desk-drawer-segment">
                  <div className="drawer-segment-handle"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Desk
