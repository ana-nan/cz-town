import { asset } from '../data/town';

export function AmbientLife() {
  return <>
    <div className="paper-clouds" aria-hidden="true">{[0, 1, 2, 3].map(index => <div key={index} className={`paper-cloud cloud-${index}`}><img src={asset('ambient/paper-cloud.png')} alt="" draggable={false}/></div>)}</div>
    <div className="lake-ripples" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <div className="butterfly-flight butterfly-left" aria-hidden="true"><span className="butterfly"><i/><b/></span></div>
    <div className="butterfly-flight butterfly-right" aria-hidden="true"><span className="butterfly"><i/><b/></span></div>
    <div className="sky-life" aria-hidden="true">{[0, 1, 2].map(index => <div key={index} className={`flying-bird bird-${index}`}><svg viewBox="0 0 60 30"><path className="bird-wing wing-left" d="M30 22Q14 2 2 8Q17 10 30 22Z"/><path className="bird-wing wing-right" d="M30 22Q43 1 58 7Q44 10 30 22Z"/><path d="m28 20 4 0-1 5-4 0Z"/></svg></div>)}</div>
    <div className="napping-cat" role="img" aria-label="台阶边正在打盹的小橘猫"><img src={asset('ambient/sleeping-cat.png')} alt="" draggable={false}/><span className="sleep-marks" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span></div>
    <div className="garden-breeze" aria-hidden="true"><img className="branch branch-left" src={asset('ambient/leafy-branch.png')} alt="" draggable={false}/><img className="branch branch-right" src={asset('ambient/leafy-branch.png')} alt="" draggable={false}/><span className="drifting-leaf leaf-one"/><span className="drifting-leaf leaf-two"/></div>
  </>;
}
