import {  useEffect, useRef, useState } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import mermaid from 'mermaid';
// import rehypeSanitize from 'rehype-sanitize';
import '@uiw/react-md-editor/markdown-editor.css';

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
        height={1000}
        value={value}
        fullscreen={true}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.group([
            commands.title1,
            commands.title2,
            commands.title3,
            commands.title4,
            commands.title5,
            commands.title6
          ], {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title'}
          }),
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          commands.codeBlock,
          commands.image,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand
        ]}
        previewOptions={{
          components: {code: Code},
          // rehypePlugins: [[rehypeSanitize]]
        }}
      />
    </div>
  );
}