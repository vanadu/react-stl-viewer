import React from 'react';
import STLViewer from './STLViewer';
import Title from './components/Title';

const titles = [
  { id: 1, title: 'Mic Clip', stlfile: 'Model1'},
  { id: 2, title: 'Mixer Stand', stlfile: 'Model2'},
  { id: 3, title: 'Computer Riser', stlfile: 'Model3'}
];



class Container extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  state = {isMounted: true};




  render() {
      const {isMounted = true} = this.state;

      const renderedTitles = titles.map(({ id, title}) => {
        return <div><li key={id}>{title}</li>
              <div><STLViewer /></div> 
              </div>     
        ;
      });

      return (
          <>  
              <div className="ui segment"><Title title={renderedTitles}/></div>
              <button onClick={() => this.setState(state => ({isMounted: !state.isMounted}))}>
                  {isMounted ? "Unmount" : "Mount"}
              </button>
              {isMounted}
              {isMounted && <div>Scroll to zoom, drag to rotate</div>}
          </>
      )
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Container />, rootElement);

export default Container;