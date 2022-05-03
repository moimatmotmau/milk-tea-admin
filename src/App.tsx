import { useState, useEffect } from 'react';
import './App.css';
import { Login, Cms } from './components/index';

function App() {

  const [login, setLogin] = useState<boolean>(false);
  const data: any = (localStorage.getItem('account'));

  useEffect(() => {

    if (JSON.parse(data).username === 'admin') {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [])

  return (
    <div className="App">
      {
        login ? <Cms setLogin={setLogin} /> : <Login setLogin={setLogin} />
      }
    </div>
  )
}

export default App;
