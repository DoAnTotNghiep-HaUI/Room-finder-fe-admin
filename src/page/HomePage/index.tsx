import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import viteLogo from "../../../public/vite.svg";
// import "./App.css";

function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="font-inter">
        <a
          href="https://vite.dev"
          target="_blank"
        >
          <img
            src={viteLogo}
            className="logo"
            alt="Vite logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
        >
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-2xl font-inter italic">Vite + React</h1>
      <div className="card ">
        <button
          className="rounded"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="font-title bold text-2xl">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs ">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default HomePage;
