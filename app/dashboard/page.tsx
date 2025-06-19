import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

async function getDashboardData() {
  try {
    const res = await fetch('http://localhost:3000/api/dashboard', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { error: 'Failed to load dashboard data' };
  }
}

function formatDate(timestamp: any) {
  if (!timestamp) return '';
  const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <Badge variant='secondary' className={variants[status] || variants.default}>
      {status}
    </Badge>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (data.error) {
    return (
      <Alert variant='destructive'>
        <ExclamationTriangleIcon className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{data.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Total Items: {data.items?.length || 0}
        </p>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px]'>Title</TableHead>
              <TableHead className='w-[400px]'>Description</TableHead>
              <TableHead className='w-[100px]'>Status</TableHead>
              <TableHead className='w-[200px]'>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.title}</TableCell>
                <TableCell className='truncate max-w-[400px]'>{item.description}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
              </TableRow>
            ))}
            {(!data.items || data.items.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className='text-center h-24 text-muted-foreground'>
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}