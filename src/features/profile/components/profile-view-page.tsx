import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { demoUser } from '@/constants/demo-user';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col p-4'>
      <Card className='mx-auto w-full max-w-lg'>
        <CardHeader className='flex flex-row items-center gap-4'>
          <Avatar className='h-16 w-16'>
            <AvatarFallback className='text-lg'>
              {demoUser.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{demoUser.fullName}</CardTitle>
            <p className='text-muted-foreground text-sm'>
              {demoUser.emailAddresses[0].emailAddress}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            This is a static demo profile — no auth backend is wired up in this prototype.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
