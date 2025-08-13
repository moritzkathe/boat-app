"use client";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography, InputAdornment, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { t } from "@/lib/i18n";

type Expense = {
  id: string;
  description: string;
  amountCents: number;
  date: string;
  paidBy: "MARIO" | "MORITZ";
};

type ExpenseForm = {
  description: string;
  amount: string;
  date: string;
  paidBy: "MARIO" | "MORITZ";
};

export default function ExpensesPage() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ExpenseForm>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      paidBy: "MARIO",
    },
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data.expenses || []);
  };
  const removeExpense = async (id: string) => {
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
    await fetchExpenses();
  };


  useEffect(() => {
    fetchExpenses();
  }, []);

  const onSubmit = async (values: ExpenseForm) => {
    const payload = {
      description: values.description,
      amountCents: Math.round(parseFloat(values.amount) * 100),
      date: values.date,
      paidBy: values.paidBy,
    };
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    reset();
    await fetchExpenses();
  };

  const totalCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);
  const splitEachCents = Math.round(totalCents / 2);
  const paidByMario = expenses.filter(e => e.paidBy === 'MARIO').reduce((s, e) => s + e.amountCents, 0);
  const paidByMoritz = expenses.filter(e => e.paidBy === 'MORITZ').reduce((s, e) => s + e.amountCents, 0);
  const marioBalance = paidByMario - splitEachCents; // positive = Mario paid more than his share
  const moritzBalance = paidByMoritz - splitEachCents; // positive = Moritz paid more than his share

  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight={600}>{t('expenses.title')}</Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          required
          label={t('expenses.item')}
          placeholder="z.B. Ankerseil"
          fullWidth
          {...register("description", { required: t('form.required') as string })}
          error={!!errors.description}
          helperText={errors.description?.message as string}
          sx={{ gridColumn: '1 / -1' }}
        />
        <TextField
          required
          label={t('expenses.cost')}
          placeholder="z.B. 59,90"
          type="number"
          inputProps={{ step: "0.01" }}
          {...register("amount", { required: t('form.required') as string })}
          error={!!errors.amount}
          helperText={errors.amount?.message as string}
          InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
        />
        <TextField
          required
          label={t('expenses.date')}
          type="date"
          placeholder="TT.MM.JJJJ"
          InputLabelProps={{ shrink: true }}
          {...register("date", { required: t('form.required') as string })}
          error={!!errors.date}
          helperText={errors.date?.message as string}
          fullWidth
          sx={{ height: '100%' }}
        />
        <Controller
          name="paidBy"
          control={control}
          rules={{ required: t('form.required') as string }}
          render={({ field: { value, onChange } }) => (
            <ToggleButtonGroup
              exclusive
              size="large"
              value={value}
              onChange={(_, v) => v && onChange(v)}
              aria-label={t('expenses.paidBy')}
              sx={{ gridColumn: '1 / -1', width: '100%' }}
            >
              <ToggleButton value="MARIO" sx={{ flex: 1, py: 1.5 }}>{t('calendar.mario')}</ToggleButton>
              <ToggleButton value="MORITZ" sx={{ flex: 1, py: 1.5 }}>{t('calendar.moritz')}</ToggleButton>
            </ToggleButtonGroup>
          )}
        />
        {errors.paidBy && (
          <Typography variant="caption" color="error" sx={{ gridColumn: '1 / -1' }}>
            {errors.paidBy.message as string}
          </Typography>
        )}
        <Button type="submit" variant="contained" size="large" sx={{ gridColumn: '1 / -1', height: 56 }}>
          {t('expenses.add')}
        </Button>
      </Box>

      <Divider />

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{t('expenses.date')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('expenses.item')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>{t('expenses.cost')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>{t('expenses.paidBy')}</TableCell>
              <TableCell align="center" sx={{ width: 56 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{new Date(e.date).toLocaleDateString('de-DE')}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell align="right">{euro.format(e.amountCents / 100)}</TableCell>
                <TableCell align="center">
                  <Chip size="small" label={e.paidBy === 'MARIO' ? t('calendar.mario') : t('calendar.moritz')} color={e.paidBy === 'MARIO' ? 'primary' : 'default'} variant={e.paidBy === 'MARIO' ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell align="center">
                  <IconButton aria-label="delete" onClick={() => removeExpense(e.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">{t('expenses.empty')}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider />

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          textAlign: 'center',
          bgcolor:
            marioBalance === moritzBalance
              ? 'rgba(76,175,80,0.08)'
              : 'rgba(30,136,229,0.08)',
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('expenses.balance.title')}
        </Typography>
        {marioBalance === moritzBalance ? (
          <Typography variant="h6">{t('expenses.balance.settled')}</Typography>
        ) : marioBalance < moritzBalance ? (
          <Typography variant="h6">
            {t('expenses.balance.marioOwesMoritz')}: {euro.format((moritzBalance - marioBalance) / 100)}
          </Typography>
        ) : (
          <Typography variant="h6">
            {t('expenses.balance.moritzOwesMario')}: {euro.format((marioBalance - moritzBalance) / 100)}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {t('expenses.balance.hint')}
        </Typography>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight={600}>{t('expenses.total')}</Typography>
        <Typography>{euro.format(totalCents / 100)}</Typography>
      </Stack>
    </Box>
  );
}
