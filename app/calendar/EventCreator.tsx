"use client";
import { Button, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { t } from "../../lib/i18n";

type FormValues = {
  date: string;
  startHour: string; // "00" - "23"
  endHour: string;   // "00" - "23"
  owner: "MARIO" | "MORITZ";
  title?: string; // Optional title for the event
};

export default function EventCreator({ onCreated }: { onCreated?: () => void }) {
  const now = new Date();
  const startDefaultHour = Math.min(18, Math.max(8, now.getHours()));
  const endDefaultHour = Math.min(22, Math.max(11, startDefaultHour + 1));

  const { register, handleSubmit, reset, control, watch, formState: { errors, isValid } } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      startHour: String(startDefaultHour).padStart(2, '0'),
      endHour: String(endDefaultHour).padStart(2, '0'),
      owner: "MARIO",
      title: "", // Default empty title
    },
    mode: 'onChange', // Enable real-time validation
  });

  // Watch form values for validation
  const watchedValues = watch();

  const onSubmit = async (values: FormValues) => {
    // Additional validation
    if (parseInt(values.endHour) <= parseInt(values.startHour)) {
      alert("Die Endzeit muss nach der Startzeit liegen.");
      return;
    }

    // Validate minimum booking duration (at least 1 hour)
    if (parseInt(values.endHour) - parseInt(values.startHour) < 1) {
      alert("Die Buchung muss mindestens 1 Stunde dauern.");
      return;
    }
    
    // Create dates in local timezone and preserve local time
    const startDate = new Date(`${values.date}T${values.startHour.padStart(2, '0')}:00:00`);
    const endDate = new Date(`${values.date}T${values.endHour.padStart(2, '0')}:00:00`);
    
    // Validate dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Ungültige Datums-/Zeitangaben. Bitte überprüfen Sie Ihre Eingaben.");
      return;
    }
    
    // Convert to ISO strings while preserving local time
    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();
    
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: values.title || "", // Send title (empty string if not provided)
          start: startIso, 
          end: endIso, 
          owner: values.owner, 
          allDay: false 
        }),
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
      
      // Reset form to fresh default values
      const newNow = new Date();
      const newStartHour = Math.min(18, Math.max(8, newNow.getHours()));
      const newEndHour = Math.min(22, Math.max(11, newStartHour + 1));
      
      reset({
        date: newNow.toISOString().slice(0, 10),
        startHour: String(newStartHour).padStart(2, '0'),
        endHour: String(newEndHour).padStart(2, '0'),
        owner: "MARIO",
        title: "", // Reset title to empty
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
      {/* Optional Title Field */}
      <TextField
        label="Titel (optional)"
        {...register("title")}
        fullWidth
        placeholder="z.B. Bootsfahrt, Wartung, etc."
        helperText="Optional: Geben Sie einen Titel für den Termin ein"
      />
      
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
            <ToggleButton 
              value="MARIO" 
              sx={{ 
                flex: 1, 
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#2196f3',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }
              }}
            >
              {t('calendar.mario')}
            </ToggleButton>
            <ToggleButton 
              value="MORITZ" 
              sx={{ 
                flex: 1, 
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#ff9800',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#f57c00'
                  }
                }
              }}
            >
              {t('calendar.moritz')}
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      />
      <Button 
        type="submit" 
        variant="contained" 
        size="large" 
        fullWidth 
        disabled={!isValid || parseInt(watchedValues.endHour || '0') <= parseInt(watchedValues.startHour || '0')}
        sx={{ 
          height: 56,
          minHeight: '56px', // Better touch target
          '&:active': {
            backgroundColor: 'primary.dark'
          }
        }}
      >
        {t('creator.add')}
      </Button>
    </Stack>
  );
}
