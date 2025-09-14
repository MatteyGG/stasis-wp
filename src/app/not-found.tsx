import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>404 - Page Not Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          The page you are looking for doesn't exist or has been removed.
        </p>
      </CardContent>
    </Card>
  );
}
