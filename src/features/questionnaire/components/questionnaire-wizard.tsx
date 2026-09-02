'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppForm, withFieldGroup } from '@/components/ui/tanstack-form';
import { revalidateLogic, useStore } from '@tanstack/react-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Icons } from '@/components/icons';
import { FieldDescription } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStepper } from '@/hooks/use-stepper';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { goalOptions, boothTierOptions, summits } from '@/constants/summit-data';

const questionnaireSchema = z.object({
  goal: z.string().min(1, 'Select a primary goal'),
  teamSize: z.number().min(1, 'Team size must be at least 1'),
  boothTier: z.string().min(1, 'Select a booth ambition'),
  travelOrigin: z.string().min(2, 'Enter a travel origin city')
});

const stepSchemas = [
  questionnaireSchema.pick({ goal: true, teamSize: true }),
  questionnaireSchema.pick({ boothTier: true, travelOrigin: true }),
  z.object({})
];

const Step1Group = withFieldGroup({
  defaultValues: { goal: '', teamSize: undefined as number | undefined },
  render: function Step1Render({ group }) {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Goals & Team</h3>
        <FieldDescription>What are you hoping to get out of this summit?</FieldDescription>

        <group.AppField name='goal'>
          {(field) => (
            <field.SelectField
              label='Primary goal'
              required
              options={goalOptions}
              placeholder='Select a goal'
            />
          )}
        </group.AppField>

        <group.AppField name='teamSize'>
          {(field) => (
            <field.TextField
              label='Team size attending'
              required
              type='number'
              min={1}
              placeholder='e.g. 4'
            />
          )}
        </group.AppField>
      </div>
    );
  }
});

const Step2Group = withFieldGroup({
  defaultValues: { boothTier: '', travelOrigin: '' },
  render: function Step2Render({ group }) {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Booth Ambition & Travel</h3>
        <FieldDescription>Narrow down the booth tier and where your team travels from.</FieldDescription>

        <group.AppField name='boothTier'>
          {(field) => (
            <field.RadioGroupField label='Booth ambition' required options={boothTierOptions} />
          )}
        </group.AppField>

        <group.AppField name='travelOrigin'>
          {(field) => (
            <field.TextField
              label='Travel origin'
              required
              placeholder='e.g. Austin, TX'
            />
          )}
        </group.AppField>
      </div>
    );
  }
});

const Step3Group = withFieldGroup({
  defaultValues: {},
  render: function Step3Render() {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Review & Generate Plan</h3>
        <FieldDescription>Review your answers, then generate the budget and constraints plan.</FieldDescription>
      </div>
    );
  }
});

function ReviewSummary({
  summitName,
  values
}: {
  summitName: string;
  values: { goal: string; teamSize?: number; boothTier: string; travelOrigin: string };
}) {
  const goalLabel = goalOptions.find((g) => g.value === values.goal)?.label ?? '—';
  const boothLabel = boothTierOptions.find((b) => b.value === values.boothTier)?.label ?? '—';
  return (
    <div className='space-y-3'>
      <Separator />
      <div className='grid gap-3'>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Summit</p>
          <p className='text-sm'>{summitName}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Goal</p>
          <p className='text-sm'>{goalLabel}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Team size</p>
          <p className='text-sm'>{values.teamSize ?? '—'}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Booth ambition</p>
          <p className='text-sm'>{boothLabel}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs font-medium uppercase'>Travel origin</p>
          <p className='text-sm'>{values.travelOrigin || '—'}</p>
        </div>
      </div>
    </div>
  );
}

type QuestionnaireValues = {
  goal: string;
  teamSize: number | undefined;
  boothTier: string;
  travelOrigin: string;
};

export function QuestionnaireWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summitId = searchParams.get('summit');
  const summit = summits.find((s) => s.id === summitId) ?? summits[0];

  const { currentValidator, step, currentStep, isFirstStep, handleCancelOrBack, handleNextStepOrSubmit } =
    useFormStepper(stepSchemas);

  const form = useAppForm({
    defaultValues: {
      goal: '',
      teamSize: undefined,
      boothTier: '',
      travelOrigin: ''
    } as QuestionnaireValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: currentValidator as typeof questionnaireSchema,
      onDynamicAsyncDebounceMs: 500
    },
    onSubmit: () => {
      toast.success('Plan generated!');
      router.push(`/dashboard/budget?summit=${summit.id}`);
    }
  });

  const isDefault = useStore(form.store, (state) => state.isDefaultValue);
  const formValues = useStore(form.store, (state) => state.values);

  const groups: Record<number, React.ReactNode> = {
    1: <Step1Group form={form} fields={{ goal: 'goal', teamSize: 'teamSize' }} />,
    2: <Step2Group form={form} fields={{ boothTier: 'boothTier', travelOrigin: 'travelOrigin' }} />,
    3: (
      <>
        <Step3Group form={form} fields={{}} />
        <ReviewSummary summitName={summit.name} values={formValues} />
      </>
    )
  };

  const handleNext = async () => {
    await handleNextStepOrSubmit(form);
  };

  const current = groups[currentStep];

  return (
    <div className='max-w-2xl'>
      <p className='text-muted-foreground mb-4 text-sm'>
        Planning participation for <span className='text-foreground font-medium'>{summit.name}</span>
      </p>
      <form.AppForm>
        <form.Form className='p-0 md:p-0'>
          <div className='flex flex-col gap-2 pt-3'>
            <div className='flex flex-col items-center justify-start gap-1'>
              <span className='text-muted-foreground text-sm'>
                Step {currentStep} of {Object.keys(groups).length}
              </span>
              <Progress value={(currentStep / Object.keys(groups).length) * 100} />
            </div>

            <AnimatePresence mode='popLayout'>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className='flex flex-col gap-2'
              >
                {current}
              </motion.div>
            </AnimatePresence>

            <div className='flex w-full items-center justify-between gap-3 pt-3'>
              <form.StepButton
                label={
                  <>
                    <Icons.chevronLeft /> Previous
                  </>
                }
                disabled={isFirstStep}
                handleMovement={() => handleCancelOrBack({ onBack: () => {} })}
              />
              {step.isCompleted ? (
                <div className='flex w-full items-center justify-end gap-3 pt-3'>
                  {!isDefault && (
                    <Button type='button' onClick={() => form.reset()} className='rounded-lg' variant='outline' size='sm'>
                      Reset
                    </Button>
                  )}
                  <form.SubmitButton>Generate Plan & Budget</form.SubmitButton>
                </div>
              ) : (
                <div className='flex w-full items-center justify-end gap-3 pt-3'>
                  {!isDefault && (
                    <Button type='button' onClick={() => form.reset()} className='rounded-lg' variant='outline' size='sm'>
                      Reset
                    </Button>
                  )}
                  <form.StepButton
                    label={
                      <>
                        Next <Icons.chevronRight />
                      </>
                    }
                    handleMovement={handleNext}
                  />
                </div>
              )}
            </div>
          </div>
        </form.Form>
      </form.AppForm>
    </div>
  );
}
