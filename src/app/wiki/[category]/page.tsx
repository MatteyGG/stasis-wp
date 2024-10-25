export default function Wiki_category({
  params,
}: {
  params: {
    category: string;
  };
}) {
  return <div>Wiki of {params.category}</div>;
}