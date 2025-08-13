"use client";
import { useState } from "react";
import { Box, Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { t } from "@/lib/i18n";

type EventForm = {
  date: string;
  startTime: string;
  endTime: string;
  owner: "MARIO" | "MORITZ";
};

export default function EventCreator({ onCreated }: { onCreated: () => void }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<EventForm>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      startTime: "10:00",
      endTime: "18:00",
      owner: "MARIO",
    },
  });

  const onSubmit = async (values: EventForm) => {
    const start = new Date(`${values.date}T${values.startTime}`);
    const end = new Date(`${values.date}T${values.endTime}`);
    
    const payload = {
      start: start.toISOString(),
      end: end.toISOString(),
      owner: values.owner,
    };

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    reset();
    onCreated();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <TextField
        required
        label={t('creator.date')}
        type="date"
        {...register("date", { required: t('form.required') as string })}
        error={!!errors.date}
        helperText={errors.date?.message as string}
        sx={{ gridColumn: '1 / -1' }}
      />
      <TextField
        required
        label={t('creator.startTime')}
        type="time"
        {...register("startTime", { required: t('form.required') as string })}
        error={!!errors.startTime}
        helperText={errors.startTime?.message as string}
      />
      <TextField
        required
        label={t('creator.endTime')}
        type="time"
        {...register("endTime", { required: t('form.required') as string })}
        error={!!errors.endTime}
        helperText={errors.endTime?.message as string}
      />
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Controller
          name="owner"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              exclusive
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="MARIO">{t('calendar.mario')}</ToggleButton>
              <ToggleButton value="MORITZ">{t('calendar.moritz')}</ToggleButton>
            </ToggleButtonGroup>
          )}
        />
        <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5 }}>
          {t('creator.add')}
        </Button>
      </Box>
    </Box>
  );
}
