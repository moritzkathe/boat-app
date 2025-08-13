"use client";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography, ToggleButton, ToggleButtonGroup, Card, CardContent, CardActions, IconButton, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { t } from "@/lib/i18n";

type WishlistItem = {
  id: string;
  title: string;
  url: string;
  description?: string;
  proposedBy: "MARIO" | "MORITZ";
  createdAt: string;
};

type WishlistForm = {
  title: string;
  url: string;
  description: string;
  proposedBy: "MARIO" | "MORITZ";
};

export default function WishlistPage() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<WishlistForm>({
    defaultValues: {
      proposedBy: "MARIO",
    },
  });
  const [items, setItems] = useState<WishlistItem[]>([]);

  const fetchItems = async () => {
    const res = await fetch("/api/wishlist");
    const data = await res.json();
    setItems(data.items || []);
  };
  const removeItem = async (id: string) => {
    await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onSubmit = async (values: WishlistForm) => {
    const payload = {
      title: values.title,
      url: values.url,
      description: values.description,
      proposedBy: values.proposedBy,
    };
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    reset();
    await fetchItems();
  };

  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight={600}>{t('wishlist.title')}</Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          required
          label={t('wishlist.item')}
          placeholder="z.B. Neues Ankerseil, GPS-Gerät"
          fullWidth
          {...register("title", { required: t('form.required') as string })}
          error={!!errors.title}
          helperText={errors.title?.message as string}
        />
        <TextField
          required
          label={t('wishlist.link')}
          placeholder="https://example.com/product"
          fullWidth
          {...register("url", { required: t('form.required') as string })}
          error={!!errors.url}
          helperText={errors.url?.message as string}
        />
        <TextField
          label={t('wishlist.reason')}
          placeholder={t('wishlist.reasonPlaceholder')}
          fullWidth
          multiline
          rows={3}
          {...register("description")}
        />
        <Controller
          name="proposedBy"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              exclusive
              fullWidth
            >
              <ToggleButton value="MARIO">{t('calendar.mario')}</ToggleButton>
              <ToggleButton value="MORITZ">{t('calendar.moritz')}</ToggleButton>
            </ToggleButtonGroup>
          )}
        />
        <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5 }}>
          {t('wishlist.add')}
        </Button>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>{t('wishlist.title')}</Typography>
        {items.length === 0 ? (
          <Typography color="text.secondary">{t('wishlist.empty')}</Typography>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  {item.description && (
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                  )}
                  <Link href={item.url} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', mb: 1 }}>
                    {item.url}
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    {t('wishlist.proposedBy')} {item.proposedBy === 'MARIO' ? t('calendar.mario') : t('calendar.moritz')} • {new Date(item.createdAt).toLocaleDateString('de-DE')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => removeItem(item.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
