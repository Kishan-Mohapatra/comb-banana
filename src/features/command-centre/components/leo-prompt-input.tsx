'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  contractSuggestion,
  defaultAgentId,
  detectAgentId
} from '@/constants/command-centre-scenarios';
import { AgentPicker } from './agent-picker';

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface LeoPromptInputProps {
  onSubmit: (value: string, attachments?: Attachment[], agentId?: string) => void;
  processing?: boolean;
  onCancel?: () => void;
}

const ease = [0.23, 1, 0.32, 1] as const;

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active
}: {
  icon: (typeof Icons)[keyof typeof Icons];
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type='button'
            className={cn(
              'flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150',
              'hover:bg-muted hover:text-foreground active:scale-[0.97]',
              active && 'bg-primary/10 text-primary'
            )}
            onClick={onClick}
          />
        }
      >
        <Icon className='size-4' />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function LeoPromptInput({ onSubmit, processing, onCancel }: LeoPromptInputProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [focused, setFocused] = useState(false);
  const [agentId, setAgentId] = useState(defaultAgentId);
  const [agentManual, setAgentManual] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reduced = useReducedMotion();

  const hasText = value.trim().length > 0;
  const hasAttachments = attachments.length > 0;

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setAttachments((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({
        id: `${f.name}-${Date.now()}`,
        name: f.name,
        url: URL.createObjectURL(f)
      }))
    ]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((a) => a.id !== id);
    });
  }

  function submit() {
    if (!hasText && !hasAttachments) return;
    onSubmit(value.trim(), attachments, agentId);
    setValue('');
    setAttachments([]);
    setAgentManual(false);
  }

  function handleTextChange(next: string) {
    setValue(next);
    if (!agentManual) setAgentId(detectAgentId(next));
  }

  function handleAgentChange(id: string) {
    setAgentId(id);
    setAgentManual(true);
  }

  // ponytail: one deterministic canned suggestion for the demo, not a real predictor.
  // Gmail-style: placeholder shows until typing starts, then the completion continues inline.
  const ghost =
    !processing && hasText && contractSuggestion.toLowerCase().startsWith(value.toLowerCase())
      ? contractSuggestion.slice(value.length)
      : '';

  const dur = reduced ? 0 : 0.25;

  return (
    <div className='w-full'>
      <input
        ref={fileRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Main input card — gradient ring only while actively focused, plain border otherwise */}
      <div className={cn('rounded-3xl', focused && 'gradient-border-focus p-[1.5px]')}>
        <motion.div
          layout
          transition={{ duration: dur, ease }}
          className={cn(
            'relative overflow-hidden rounded-3xl bg-card shadow-sm',
            'transition-shadow duration-200',
            focused
              ? 'border-0'
              : 'border focus-within:ring-1 focus-within:ring-ring/30 focus-within:shadow-md'
          )}
        >
          {/* Attachments row */}
          <AnimatePresence>
            {hasAttachments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: dur, ease }}
                className='overflow-hidden'
              >
                <div className='flex flex-wrap gap-1.5 px-4 pt-3'>
                  {attachments.map((a) => (
                    <motion.span
                      key={a.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease }}
                      className='inline-flex max-w-[11rem] items-center gap-1.5 rounded-lg border bg-muted/50 py-1 pr-1.5 pl-2 text-xs'
                    >
                      <Icons.image className='size-3 shrink-0 text-muted-foreground' />
                      <span className='truncate'>{a.name}</span>
                      <button
                        type='button'
                        aria-label={`Remove ${a.name}`}
                        className='flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground'
                        onClick={() => removeAttachment(a.id)}
                      >
                        <Icons.xCircle className='size-3.5' />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea / Processing state */}
          <div className='relative px-4 pt-3 pb-1'>
            {processing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex min-h-[52px] items-center gap-2.5'
              >
                <Icons.sparkles className='size-4 animate-pulse text-violet-400' />
                <span className='text-sm font-medium text-violet-400'>
                  Working on your request …
                </span>
              </motion.div>
            ) : (
              <>
                {ghost && (
                  <div
                    aria-hidden
                    className='pointer-events-none absolute inset-0 min-h-[52px] w-full overflow-hidden px-4 pt-3 pb-1 text-sm leading-relaxed whitespace-pre-wrap'
                  >
                    <span className='invisible'>{value}</span>
                    <span className='text-muted-foreground/50'>{ghost}</span>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && ghost) {
                      e.preventDefault();
                      setValue(contractSuggestion);
                      return;
                    }
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder='Ask anything, @models, /prompts …'
                  rows={1}
                  className={cn(
                    'relative min-h-[52px] w-full resize-none bg-transparent text-sm leading-relaxed outline-none',
                    'placeholder:text-muted-foreground/50'
                  )}
                  style={{ fieldSizing: 'content' } as React.CSSProperties}
                />
              </>
            )}

            {/* Sparkles hint — top right */}
            {!processing && !hasText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className='absolute top-3 right-4'
              >
                <Icons.sparkles className='size-4 text-muted-foreground' />
              </motion.div>
            )}
          </div>

          {/* Toolbar */}
          <div className='flex items-center px-2.5 pb-2.5'>
            {processing ? (
              <>
                <div className='flex items-center gap-2 px-1.5 text-xs text-muted-foreground'>
                  <Icons.brain className='size-3.5 text-violet-400' />
                  <span className='animate-pulse'>Thinking...</span>
                  <Icons.loader className='size-3 animate-spin text-muted-foreground/50' />
                </div>
                <div className='ml-auto'>
                  <Button
                    type='button'
                    size='icon-sm'
                    variant='outline'
                    className='rounded-full'
                    aria-label='Stop'
                    onClick={onCancel}
                  >
                    <Icons.square className='size-3' />
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Left toolbar */}
                <div className='flex items-center gap-0.5'>
                  <ToolbarButton
                    icon={Icons.add}
                    label='Attach'
                    onClick={() => fileRef.current?.click()}
                  />
                  <ToolbarButton
                    icon={Icons.lightbulb}
                    label='Suggestions'
                    onClick={() =>
                      toast.info('Suggestion mode — coming soon.', { id: 'leo-suggest' })
                    }
                  />
                  <AgentPicker value={agentId} onChange={handleAgentChange} />
                </div>
                {/* Right toolbar */}
                <div className='ml-auto flex items-center gap-0.5'>
                  <ToolbarButton
                    icon={Icons.target}
                    label='Focus'
                    onClick={() => toast.info('Focus mode — coming soon.', { id: 'leo-focus' })}
                  />
                  <ToolbarButton
                    icon={Icons.mic}
                    label='Voice'
                    onClick={() => toast.info('Voice input — coming soon.', { id: 'leo-voice' })}
                  />

                  {/* Send button — appears when typing */}
                  <AnimatePresence>
                    {(hasText || hasAttachments) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: 'auto' }}
                        exit={{ opacity: 0, scale: 0.9, width: 0 }}
                        transition={{ duration: 0.2, ease }}
                      >
                        <Button
                          type='button'
                          size='icon-sm'
                          className='ml-1 rounded-2xl active:scale-[0.97]'
                          aria-label='Send'
                          onClick={submit}
                        >
                          <Icons.arrowUp className='size-4' />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
