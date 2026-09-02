'use client';

import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { campaignSegments } from '@/constants/command-centre-scenarios';

export function CampaignModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Create Follow-up Campaign</DialogTitle>
          <DialogDescription>
            Leo drafted a segment-specific email for each of your 23 pending follow-ups.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={campaignSegments[0].id}>
          <TabsList className='w-full'>
            {campaignSegments.map((segment) => (
              <TabsTrigger key={segment.id} value={segment.id}>
                {segment.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {campaignSegments.map((segment) => (
            <TabsContent key={segment.id} value={segment.id} className='space-y-2 pt-3'>
              <div className='flex items-center justify-between gap-2'>
                <p className='text-sm font-medium'>{segment.subject}</p>
                <Badge variant='outline'>{segment.recipients} recipients</Badge>
              </div>
              <p className='rounded-lg bg-muted p-3 text-sm text-muted-foreground'>
                {segment.preview}
              </p>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} className='active:scale-[0.97]'>
            Cancel
          </Button>
          <Button
            className='active:scale-[0.97]'
            onClick={() => {
              toast.success('Campaign scheduled', {
                id: 'campaign-scheduled',
                description: 'Sending to 23 recipients tomorrow at 9:00 AM.'
              });
              onClose();
            }}
          >
            Send tomorrow 9 AM
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
