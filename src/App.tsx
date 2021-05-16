import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from './components/Button/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button/>
      </header>
    </div>
  );
}

export default App;

// import * as React from "react";
// import { Button } from "./components/Button/Button";

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <img src={logo} className="App-logo" alt="logo" /> */}
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//         {/* <Button /> */}
//       </header>
//     </div>
//   );
// };

// export default App;