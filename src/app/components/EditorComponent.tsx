"use client";
// InitializedMDXEditor.tsx
import { FC } from "react";
import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";

import {
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  diffSourcePlugin,
  linkDialogPlugin,
  linkPlugin,
  frontmatterPlugin,
  imagePlugin,
  sandpackPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  toolbarPlugin, //Toolbar plugins
  BoldItalicUnderlineToggles,
  InsertTable,
  BlockTypeSelect,
  CreateLink,
  tablePlugin,
  DiffSourceToggleWrapper,
  thematicBreakPlugin,
  InsertFrontmatter,
  InsertImage,
  InsertSandpack,
  InsertAdmonition,
  InsertCodeBlock,
  ChangeAdmonitionType,
  UndoRedo,
} from "@mdxeditor/editor";

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}


const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      plugins={[
        // Add plugins here
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        diffSourcePlugin(),
        frontmatterPlugin(),
        imagePlugin(),
        sandpackPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertTable />
              <InsertImage />
              <InsertAdmonition />
              {/*<InsertSandpack /> */} {/* TODO: Add Sandpack plugin */}
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;