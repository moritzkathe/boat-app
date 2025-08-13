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
  const marioBalance = paidByMario - splitEachCents;
  const moritzBalance = paidByMoritz - splitEachCents;

  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight={600}>{t('expenses.title')}</Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          required
          label={t('expenses.item')}
          placeholder="z.B. Neues Ankerseil, Diesel Tankfüllung"
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
          {...register("date", { required: t('form.required') as string })}
          error={!!errors.date}
          helperText={errors.date?.message as string}
        />
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Controller
            name="paidBy"
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
            {t('expenses.add')}
          </Button>
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>{t('expenses.balance.title')}</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body1">
            {t('expenses.total')}: {euro.format(totalCents / 100)}
          </Typography>
          <Typography variant="body1">
            {t('expenses.balance.hint')}
          </Typography>
        </Stack>
        
        {marioBalance === 0 && moritzBalance === 0 ? (
          <Chip label={t('expenses.balance.settled')} color="success" />
        ) : marioBalance > 0 ? (
          <Chip label={t('expenses.balance.marioOwesMoritz') + ` ${euro.format(marioBalance / 100)}`} color="warning" />
        ) : (
          <Chip label={t('expenses.balance.moritzOwesMario') + ` ${euro.format(Math.abs(marioBalance) / 100)}`} color="warning" />
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>{t('expenses.title')}</Typography>
        {expenses.length === 0 ? (
          <Typography color="text.secondary">{t('expenses.empty')}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('expenses.item')}</TableCell>
                  <TableCell>{t('expenses.cost')}</TableCell>
                  <TableCell>{t('expenses.date')}</TableCell>
                  <TableCell>{t('expenses.paidBy')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{euro.format(expense.amountCents / 100)}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString('de-DE')}</TableCell>
                    <TableCell>{expense.paidBy === 'MARIO' ? t('calendar.mario') : t('calendar.moritz')}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeExpense(expense.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
