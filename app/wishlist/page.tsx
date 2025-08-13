"use client";
import { useEffect, useState } from "react";
import { Box, Button, Chip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useForm, Controller } from "react-hook-form";
import { t } from "@/lib/i18n";

type Wish = {
  id: string;
  title: string;
  url: string;
  description?: string;
  proposedBy: "MARIO" | "MORITZ";
  createdAt?: string;
};

type WishForm = {
  title: string;
  url: string;
  description?: string;
  proposedBy: "MARIO" | "MORITZ";
};

export default function WishlistPage() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<WishForm>({
    defaultValues: { proposedBy: "MARIO" },
  });
  const [items, setItems] = useState<Wish[]>([]);

  const load = async () => {
    const r = await fetch('/api/wishlist');
    const d = await r.json();
    setItems(d.items || []);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (v: WishForm) => {
    await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
    reset({ title: '', url: '', description: '', proposedBy: 'MARIO' });
    await load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight={600}>{t('wishlist.title')}</Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField label={t('wishlist.item')} placeholder="z.B. Neue Fender" fullWidth required {...register('title', { required: t('form.required') as string })} sx={{ gridColumn: '1 / -1' }} error={!!errors.title} helperText={errors.title?.message as string} />
        <TextField label={t('wishlist.link')} placeholder="https://..." type="url" fullWidth required {...register('url', { required: t('form.required') as string })} error={!!errors.url} helperText={errors.url?.message as string} sx={{ gridColumn: '1 / -1' }} />
        <Controller
          name="proposedBy"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <ToggleButtonGroup
              exclusive
              size="large"
              value={value}
              onChange={(_, v) => v && onChange(v)}
              aria-label={t('wishlist.proposedBy')}
              sx={{ width: '100%', gridColumn: '1 / -1' }}
            >
              <ToggleButton value="MARIO" sx={{ flex: 1, py: 1.5 }}>{t('calendar.mario')}</ToggleButton>
              <ToggleButton value="MORITZ" sx={{ flex: 1, py: 1.5 }}>{t('calendar.moritz')}</ToggleButton>
            </ToggleButtonGroup>
          )}
        />
        <Button type="submit" variant="contained" size="large" sx={{ gridColumn: '1 / -1', height: 56 }}>{t('wishlist.add')}</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{t('wishlist.item')}</TableCell>
              
              <TableCell align="center" sx={{ fontWeight: 600 }}>{t('wishlist.proposedBy')}</TableCell>
              <TableCell align="center" sx={{ width: 112 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((w) => (
              <TableRow key={w.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <a href={w.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <OpenInNewIcon fontSize="small" />
                      <Typography fontWeight={600}>{w.title}</Typography>
                    </a>
                  </Stack>
                </TableCell>
                
                <TableCell align="center"><Chip size="small" label={w.proposedBy === 'MARIO' ? t('calendar.mario') : t('calendar.moritz')} /></TableCell>
                <TableCell align="center">
                  <IconButton aria-label="delete" onClick={() => remove(w.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center"><Typography color="text.secondary">{t('wishlist.empty')}</Typography></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
