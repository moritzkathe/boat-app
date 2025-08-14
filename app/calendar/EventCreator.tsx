"use client";
import { Button, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { t } from "@/lib/i18n";

type FormValues = {
  date: string;
  startHour: string; // "00" - "23"
  endHour: string;   // "00" - "23"
  owner: "MARIO" | "MORITZ";
};

export default function EventCreator({ onCreated }: { onCreated?: () => void }) {
  const now = new Date();
  const startDefaultHour = Math.min(18, Math.max(8, now.getHours()));
  const endDefaultHour = Math.min(22, Math.max(11, startDefaultHour + 1));

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      startHour: String(startDefaultHour).padStart(2, '0'),
      endHour: String(endDefaultHour).padStart(2, '0'),
      owner: "MARIO",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Validate that end time is after start time
    if (parseInt(values.endHour) <= parseInt(values.startHour)) {
      alert("Die Endzeit muss nach der Startzeit liegen.");
      return;
    }
    
    // Create dates in local timezone to avoid timezone conversion issues
    const startDate = new Date(`${values.date}T${values.startHour.padStart(2, '0')}:00:00`);
    const endDate = new Date(`${values.date}T${values.endHour.padStart(2, '0')}:00:00`);
    
    // Convert to ISO strings for API
    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();
    
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startIso, end: endIso, owner: values.owner, allDay: false }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "OVERLAP") {
          alert("Dieser Zeitraum ist bereits gebucht. Bitte wählen Sie einen anderen Zeitraum.");
          return;
        } else if (errorData.error === "Cannot book in the past") {
          alert("Sie können keine Termine in der Vergangenheit buchen.");
          return;
        } else if (errorData.error) {
          alert(`Fehler: ${errorData.error}`);
          return;
        }
      }
      
      // Reset form to default values
      reset({
        date: new Date().toISOString().slice(0, 10),
        startHour: String(startDefaultHour).padStart(2, '0'),
        endHour: String(endDefaultHour).padStart(2, '0'),
        owner: "MARIO",
      });
      
      // Show success message
      alert("Termin erfolgreich gebucht!");
      onCreated?.();
    } catch (error) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Stack direction="column" spacing={2} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ alignItems: 'stretch' }}>
      <Controller
        name="date"
        control={control}
        rules={{ 
          required: true, 
          validate: (v) => {
            const selectedDate = new Date(v);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today || 'Datum muss in der Zukunft liegen';
          }
        }}
        render={({ field: { value, onChange } }) => (
          <DatePicker
            label={t('creator.date')}
            value={dayjs(value || new Date().toISOString().slice(0, 10))}
            onChange={(d) => d && onChange(d.format('YYYY-MM-DD'))}
            disablePast
            minDate={dayjs().startOf('day')}
            sx={{ width: '100%' }}
            slotProps={{ textField: { fullWidth: true, inputProps: { readOnly: true }, sx: { width: '100%' } } }}
          />
        )}
      />
      <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
        <TextField label={t('creator.startTime')} select {...register("startHour", { required: true })} fullWidth sx={{ flex: 1 }}>
          {Array.from({ length: 11 }, (_, i) => String(8 + i).padStart(2, '0')).map((h) => (
            <MenuItem key={h} value={h}>{h}:00</MenuItem>
          ))}
        </TextField>
        <TextField label={t('creator.endTime')} select {...register("endHour", { required: true })} fullWidth sx={{ flex: 1 }}>
          {Array.from({ length: 14 }, (_, i) => String(9 + i).padStart(2, '0')).map((h) => (
            <MenuItem key={h} value={h}>{h}:00</MenuItem>
          ))}
        </TextField>
      </Stack>
      <Controller
        name="owner"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <ToggleButtonGroup
            exclusive
            size="large"
            value={value}
            onChange={(_, val) => val && onChange(val)}
            aria-label={t('creator.owner')}
            sx={{ alignSelf: 'stretch', width: '100%' }}
          >
            <ToggleButton value="MARIO" sx={{ flex: 1, py: 1.5 }}>{t('calendar.mario')}</ToggleButton>
            <ToggleButton value="MORITZ" sx={{ flex: 1, py: 1.5 }}>{t('calendar.moritz')}</ToggleButton>
          </ToggleButtonGroup>
        )}
      />
      <Button type="submit" variant="contained" size="large" fullWidth sx={{ height: 56 }}>{t('creator.add')}</Button>
    </Stack>
  );
}
