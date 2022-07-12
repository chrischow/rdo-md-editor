import {  useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import mermaid from 'mermaid';
// import rehypeSanitize from 'rehype-sanitize';

const Code = ({inline, children=[], className, ...props}: any) => {
  const demoid = useRef('1337');
  const code = getCode(children);
  const demo = useRef(null);

  useEffect( () => {
    if (demo.current) {
      try {
        const mermaidStr = mermaid.render(
          demoid.current,
          code,
          () => null,
          demo.current
        );
        // @ts-ignore
        demo.current.innerHTML = mermaidStr;
      } catch (error) {
        // @ts-ignore
        demo.current.innerHTML = error;
      }
    }
  }, [code, demo])

  if (
    typeof code === 'string' &&
    typeof className === 'string' &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoid.current} style={{ display: "none" }} />
      </code>
    );
  }

  return <code className={String(className)}>{children}</code>;
}

const getCode = (arr = []):string => {
  return arr.map((dt:any) => {
    if (typeof dt === 'string') {
      return dt;
    }
    if (dt.props && dt.props.children) {
      return getCode(dt.props.children);
    }
    return false;
  })
  .filter(Boolean)
  .join("");
}

export default function MarkdownEditor() {
  const [value, setValue] = useState<string>('');
  return (
    <div data-color-mode="dark">
      <MDEditor
        onChange={(newValue="") => setValue(newValue)}
        textareaProps={{ placeholder: "Input markdown here." }}
        visibleDragbar={false}
        height={600}
        value={value}
        fullscreen={true}
        previewOptions={{
          components: {code: Code},
          // rehypePlugins: [[rehypeSanitize]]
        }}
        style={{fontFamily:'Consolas,Courier,"Courier New",monospace'}}
      />
    </div>
  );
}