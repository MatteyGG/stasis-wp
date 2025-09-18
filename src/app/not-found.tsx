import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-pretty text-4xl">Error 404</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-3xl">Извините, страница не найдена.</p>
        </CardContent>
      </Card>
    </div>
  );
}
