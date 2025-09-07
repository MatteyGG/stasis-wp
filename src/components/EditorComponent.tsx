"use client";
import { FC } from "react";
import { 
  MDXEditor, 
  MDXEditorMethods,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  linkDialogPlugin,
  linkPlugin,
  imagePlugin,
  markdownShortcutPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  InsertTable,
  BlockTypeSelect,
  CreateLink,
  tablePlugin,
  thematicBreakPlugin,
  InsertImage,
  InsertAdmonition,
  UndoRedo,
  CodeToggle,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      contentEditableClassName="prose prose-lg max-w-none font-sans"
      plugins={[
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        imagePlugin({
          imageUploadHandler: () => Promise.resolve('https://picsum.photos/200/300'),
          imageAutocompleteSuggestions: [
            'https://picsum.photos/200/300',
            'https://picsum.photos/200',
            'https://picsum.photos/300/200'
          ]
        }),
        markdownShortcutPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        diffSourcePlugin({ viewMode: 'rich-text' }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <CodeToggle />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertAdmonition />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  );
};

export default Editor;