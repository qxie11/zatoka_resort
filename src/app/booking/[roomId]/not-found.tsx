import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Номер не найден</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Запрошенный номер не существует или был удален.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/booking">Посмотреть все номера</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

