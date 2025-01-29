import { Button, Stack, Typography, useThemeProps } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRef, useState, useEffect } from "react";
import ConfettiComponent from "../components/ConfettiComponent";
import { readLocalStorage, writeLocalStorage } from "../helpers/RestoreHelper";
export default function HomePage({ themeProp, onSetTheme }) {
  const editorRef = useRef(null);
  const [src, setSrc] = useState(
    "https://onecompiler.com/embed?hideRun=true&codeChangeEvent=true&listenToEvents=true"
  );
  const [editorContent, setEditorContent] = useState("print('hello world')");
  const [filename, setFilename] = useState("main.py");
  const [language, setLanguage] = useState("python");
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [isExecutionSuccess, setIsExecutionSuccess] = useState(false);

  function sendMessageToEditor(message) {
    if (editorRef.current) {
      editorRef.current.contentWindow.postMessage(message, "*");
    } else {
      console.log("no reference of iframe");
    }
  }

  function handleEditorOnLoad() {
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
      console.log(data);
      // localStorage.setItem("editorContent", data.files[0].content);
      localStorage.setItem("language", data.language);
      // localStorage.setItem("filename", data.files[0].name);
      // writeLocalStorage("editorContent",data.files.map((item)=>item.content));
      // writeLocalStorage("language",data.language);
      // writeLocalStorage("filename",data.files.map((item)=>item.name));
      writeLocalStorage("files", data.files);
    } else if (data.action === "runComplete") {
      if (data.result.success) {
        setIsExecutionSuccess(true);
      } else {
        console.log("execution failed", data.result);
      }
    }
  }

  function runCode() {
    sendMessageToEditor({ eventType: "triggerRun" });
  }

  function formatCode() {
    sendMessageToEditor({ event: "run", action: "format" });
  }

  function RestoreCode() {
    // const newCode = localStorage.getItem("editorContent") || editorContent;
    const newLanguage = localStorage.getItem("language") || language;
    // const newFilename = localStorage.getItem("filename") || filename;
    // const newLanguage=readLocalStorage("language") || language;
    // const editorContentList= readLocalStorage("editorContent") || [editorContent];
    const files = readLocalStorage("files") || [
      { name: filename, content: editorContent },
    ];
    sendMessageToEditor({
      eventType: "populateCode",
      language: newLanguage,
      files: files,
    });
  }

  useEffect(() => {
    let newSrc =
      "https://onecompiler.com/embed?hideRun=true&codeChangeEvent=true&listenToEvents=true";
    if (themeProp === "dark") {
      newSrc += "&theme=dark";
    }
    setSrc(newSrc);
    setTimeout(() => {
      RestoreCode();
    }, 150);
    window.addEventListener("message", handleMessageFromEditor);
    return () => {
      window.removeEventListener("message", handleMessageFromEditor);
    };
  }, [themeProp]);

  useEffect(() => {
    setTimeout(() => {
      RestoreCode();
    }, 150);
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
          justifyContent:"space-between"
        }}
      >
        <ConfettiComponent
          isExecutionSuccessProp={isExecutionSuccess}
          onSetIsExecutionSuccess={setIsExecutionSuccess}
        />
        <Stack direction={"row"} gap={5} justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"}>
        <Typography color={themeProp === "dark" ? "white" : "#5063f0"} fontWeight={300} fontSize={20} marginLeft={2}>Code Ground</Typography>
          <Stack direction={"row"} flexDirection={"row-reverse"} gap={5} flexWrap={"wrap"}>
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
