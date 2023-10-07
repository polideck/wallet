import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ImmortalStorage, CookieStore, LocalStorageStore } from 'immortal-db'
import './App.css'

// CookieStore -> keys and values are stored in document.cookie
// IndexedDbStore -> keys and values are stored in window.indexedDB
// LocalStorageStore -> keys and values are stored in window.localStorage
// SessionStorageStore -> keys and values are stored in window.sessionStorage

// use cookie storage and local storage
const stores = [await new CookieStore(), await new LocalStorageStore()];
const db = new ImmortalStorage(stores);

function App() {

  const [keyData, setKeyData] = useState('');

  // value can be json data
  // TODO: fetch JSON from cookies / localstorage and validate via JSON validation library
  // once user wallet is verified, user info stored as cookie
  // so they can proceed with application
  const wallet = {
    api: 'wallet',
    op: 'getPublicAddr',
    nonce: 3351783782,
    res: 'ETHWALLETADDR'
  }

  const authenticatedUser = {
    name: 'john smith',
    guid: '12345',
    wallet: wallet,
  }

  function setCookie(key) {
    db.set(key, JSON.stringify(authenticatedUser));
  }

  function clearAllCookies() {
    console.log(document.cookie);
    document.cookie.split(/; */).forEach(async (cookie) => {
      let keyToRemove = cookie;
      const immortalPrefix = cookie.indexOf('|');
      const IMMORTAL_PREFIX_OFFSET = 1;
      const equalsIndex = cookie.indexOf('=');
      keyToRemove = keyToRemove.slice(0,equalsIndex);
      keyToRemove = keyToRemove.slice(immortalPrefix + IMMORTAL_PREFIX_OFFSET);
      await db.remove(keyToRemove);
    })
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">

        <input placeholder='Enter User Id' onChange={(e) => {
          setKeyData(e.target.value);
        }}/>

        <button onClick={() => setCookie(keyData)}>
          Click me, then check cookies
        </button>

        <button onClick={() => clearAllCookies()}>
          Clear all cookies
        </button>

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
