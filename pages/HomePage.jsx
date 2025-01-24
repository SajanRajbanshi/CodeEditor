import { Button, Stack, useThemeProps } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRef, useState, useEffect } from "react";
import ConfettiComponent from "../components/ConfettiComponent";
export default function HomePage({ themeProp, onSetTheme }) {
  const editorRef = useRef(null);
  const [src, setSrc] = useState(
    "https://onecompiler.com/embed?hideRun=true&codeChangeEvent=true&listenToEvents=true"
  );
  const [editorContent, setEditorContent] = useState("print('hello world')");
  const [filename, setFilename] = useState("main.py");
  const [language, setLanguage] = useState("python");
  const [isEditorLoaded,setIsEditorLoaded] = useState(false);
  const [isExecutionSuccess,setIsExecutionSuccess] = useState(false);

  function sendMessageToEditor(message) {
    if (editorRef.current) {
      editorRef.current.contentWindow.postMessage(message, "*");
    } else {
      console.log("no reference of iframe");
    }
  }

  function handleEditorOnLoad()
  {
    setIsEditorLoaded(true);
  }

  function handleThemeChange() {
    let curTheme = themeProp === "dark" ? "light" : "dark";
    onSetTheme(curTheme);
    localStorage.setItem("theme", curTheme);
    setIsEditorLoaded(false);
  }

  function handleMessageFromEditor(event) {
    const { data } = event;
    if (data.action === "codeUpdate") {
      setEditorContent(data.code);
      localStorage.setItem("editorContent", data.files[0].content);
      localStorage.setItem("language", data.language);
      localStorage.setItem("filename",data.files[0].name);
    } else if (data.action === "runComplete") {
      if (data.result.success) {
        setIsExecutionSuccess(true);
        console.log("execution success", data.result);
      } else {
        console.log("execution failed", data.result);
      }
    }
  }

  function runCode(){
    sendMessageToEditor({ eventType: "triggerRun" });
  };

  function formatCode(){
    sendMessageToEditor({ event: "run",action:"format" });
  };

  function RestoreCode(){
    const newCode = localStorage.getItem("editorContent") || editorContent;
    const newLanguage = localStorage.getItem("language") || language;
    const newFilename= localStorage.getItem("filename") || filename;
    sendMessageToEditor({
      eventType: "populateCode",
      language: newLanguage,
      files: [{ name: newFilename, content: newCode }],
    });
  };

  useEffect(() => {
    let newSrc =
      "https://onecompiler.com/embed?hideRun=true&codeChangeEvent=true&listenToEvents=true";
    if (themeProp === "dark") {
      newSrc += "&theme=dark";
    }
    setSrc(newSrc);
    setTimeout(() => {
      RestoreCode();
    }, 50);
    window.addEventListener("message", handleMessageFromEditor);
    return () => {
      window.removeEventListener("message", handleMessageFromEditor);
    };
  }, [themeProp]);

  useEffect(() => {
    RestoreCode();
    // const fallbackTimer = setTimeout(() => {
    //   if (!isEditorLoaded) {
    //     console.warn("Iframe load fallback triggered");
    //     setIsEditorLoaded(true);
    //     RestoreCode();
    //   }
    // }, 5000);
  
    // return () => {
    //   console.log("Cleaning up fallback timer...");
    //   clearTimeout(fallbackTimer);
    // };
  }, [isEditorLoaded]);

  return (
    <>
      <Stack
        sx={{
          height: "100vh",
          width: "100vw",
          boxSizing: "border-box",
          backgroundColor:
            themeProp === "dark" ? "#121212" : "rgba(245,245,245)",
          direction: "column",
          overflow: "hidden",
        }}
      >
        <ConfettiComponent isExecutionSuccessProp={isExecutionSuccess} onSetIsExecutionSuccess={setIsExecutionSuccess}/>
        <Stack direction={"row"} flexDirection={"row-reverse"} gap={5}>
          <Button
            sx={{
              color: themeProp === "dark" ? "white" : "#5063f",
              fontWeight: 300,
            }}
            onClick={handleThemeChange}
          >
            {themeProp === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
          </Button>
          <Button
            sx={{
              color: themeProp === "dark" ? "white" : "#5063f0",
              fontWeight: 300,
            }}
            onClick={runCode}
          >
            Run
          </Button>
          <Button
            sx={{
              color: themeProp === "dark" ? "white" : "#5063f0",
              fontWeight: 300,
            }}
            onClick={formatCode}
          >
            Format
          </Button>
        </Stack>
        <Stack flexGrow={1}>
          <iframe
            frameBorder="0"
            height="100%"
            src={src}
            width="100%"
            ref={editorRef}
            onLoad={handleEditorOnLoad}
          ></iframe>
        </Stack>
      </Stack>
    </>
  );
}
