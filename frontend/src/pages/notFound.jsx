import { Link } from "react-router-dom";
export function NotFound() {
  return (
    <div className="p404-page">
      <div className="p404-content">
        <div className="p404-illustration" aria-hidden="true">
          <div className="p404-hair">
            <div className="p404-hairTuft p404-hairTuft--l" />
            <div className="p404-hairTuft p404-hairTuft--c" />
            <div className="p404-hairTuft p404-hairTuft--r" />
          </div>
          <div className="p404-head">
            <div className="p404-glasses">
              <div className="p404-glassLens p404-glassLens--l">
                <div className="p404-glassInner" />
              </div>
              <div className="p404-glassBridge" />
              <div className="p404-glassLens p404-glassLens--r">
                <div className="p404-glassInner" />
              </div>
            </div>
            <div className="p404-nose" />
            <div className="p404-moustache">
              <div className="p404-moustachePuff p404-moustachePuff--l" />
              <div className="p404-moustachePuff p404-moustachePuff--r" />
            </div>
          </div>
          <div className="p404-neck">
            <div className="p404-collar" />
            <div className="p404-tie" />
          </div>
          <div className="p404-torso">
            <div className="p404-armL">
              <div className="p404-handL" />
            </div>
            <div className="p404-signWrap">
              <div className="p404-sign">
                <div className="p404-signInner">
                  <span className="p404-signText">404</span>
                </div>
              </div>
            </div>
            <div className="p404-armR">
              <div className="p404-handR" />
            </div>
          </div>
        </div>
        <p className="p404-message">This page doesn't exist.</p>
      </div>
    </div>
  );
}
