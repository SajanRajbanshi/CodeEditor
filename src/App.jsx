import HomePage from "../pages/HomePage";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(()=>
  {
    let restoreTheme=localStorage.getItem("theme") || theme;
    setTheme(restoreTheme);
    localStorage.setItem("theme",restoreTheme);
  },[])

  return (
    <>
      <Stack width={"100vw"} height={"100vh"} overflow={"hidden"}>
        <HomePage themeProp={theme} onSetTheme={setTheme}></HomePage>
      </Stack>
    </>
  );
}

export default App;
