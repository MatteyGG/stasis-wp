export default function Wiki_page( { params }: {
    params: {
        category: string,
        wikipageid: string
    }
} ) {
    return (
        <div className="text-3xl flex justify-center">
            <h1>Wiki Page {params.wikipageid} of { params.category } </h1>
        </div>
    );
}