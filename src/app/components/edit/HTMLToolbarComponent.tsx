const HTMLToolbarComponent: React.FC = () => {
  const [currentSelection, activeEditor] = useCellValues(
    currentSelection$,
    activeEditor$
  );

  const currentHTMLNode = React.useMemo(() => {
    return (
      activeEditor?.getEditorState().read(() => {
        const selectedNodes = currentSelection?.getNodes() || [];
        if (selectedNodes.length === 1) {
          return $getNearestNodeOfType(selectedNodes[0], GenericHTMLNode);
        } else {
          return null;
        }
      }) || null
    );
  }, [currentSelection, activeEditor]);

  return (
    <>
      <input
        disabled={currentHTMLNode === null}
        value={getCssClass(currentHTMLNode)}
        onChange={(e) => {
          activeEditor?.update(
            () => {
              const attributesWithoutClass =
                currentHTMLNode
                  ?.getAttributes()
                  .filter((attr) => attr.name !== "class") || [];
              const newClassAttr: MdxJsxAttribute = {
                type: "mdxJsxAttribute",
                name: "class",
                value: e.target.value,
              };
              currentHTMLNode?.updateAttributes([
                ...attributesWithoutClass,
                newClassAttr,
              ]);
            },
            { discrete: true }
          );
          e.target.focus();
        }}
      />
    </>
  );
};

function getCssClass(node: GenericHTMLNode | null) {
  return (
    (node?.getAttributes().find((attr) => attr.name === "class")
      ?.value as string) ?? ""
  );
}

