import { useEffect, useRef, useState } from "react";

export default function Editor({ themeProp }) {
  const editorRef = useRef();
  const [src, setSrc] = useState("https://onecompiler.com/embed?hideRun=true");
  const [editorContent, setEditorContent] = useState("print('hello world')");
  const [language, setLanguage] = useState("python");


  function sendMessageToEditor(message)
  {
    
  }

  function handleMessageFromEditor(event)
  {

  }

  useEffect(()=>
  {
      RestoreCode();
      window.addEventListener("message",handleMessageFromEditor);
      return (window.addEventListener("message",handleMessageFromEditor));
  },[])




  // let newSrc = "https://onecompiler.com/embed?hideRun=true";
  // if (isDarkThemeProp) {
  //   newSrc += "&theme=dark";
  // }
  // setSrc(newSrc);

  const RestoreCode = () => {
    const newCode = localStorage.getItem["code"] ?? "print('hello world')";
    const language = sendMessageToIframe({
      event: "updateCode",
      code: newCode,
    });
  };

  const runCode = () => {
    sendMessageToIframe({ event: "run", action: "execute" });
  };

  const formatCode = () => {
    sendMessageToIframe({ event: "run", action: "format" });
  };

  const readCode = () => {
    console.log("Current code:", code);
  };

  return (
    <>
      <iframe
        frameBorder="0"
        height="100%"
        src={src}
        width="100%"
        ref={editorRef}
      ></iframe>
    </>
  );
}
