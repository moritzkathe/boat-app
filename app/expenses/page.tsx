"use client";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography, InputAdornment, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { t } from "@/lib/i18n";
import { dt } from "@/app/theme";
import ExpenseDeleteDialog from "./DeleteDialog";
import PayPalBalanceCard from "./PayPalBalanceCard";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data.expenses || []);
  };
  const removeExpense = (id: string) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      await fetch(`/api/expenses?id=${expenseToDelete}`, { method: 'DELETE' });
      await fetchExpenses();
    }
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const cancelDeleteExpense = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
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
          sx={{ 
            gridColumn: '1 / -1',
            '& .MuiInputBase-root': {
              height: '56px'
            }
          }}
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
          sx={{ 
            '& .MuiInputBase-root': {
              height: '56px'
            }
          }}
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
          sx={{ 
            '& .MuiInputBase-root': {
              height: '56px'
            }
          }}
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
              <TableCell sx={{ fontWeight: 600 }}>{t('expenses.cost')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('expenses.paidBy')}</TableCell>
              <TableCell sx={{ width: 56 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{new Date(e.date).toLocaleDateString('de-DE')}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{euro.format(e.amountCents / 100)}</TableCell>
                <TableCell>
                  <Chip size="small" label={e.paidBy === 'MARIO' ? t('calendar.mario') : t('calendar.moritz')} color={e.paidBy === 'MARIO' ? 'primary' : 'default'} variant={e.paidBy === 'MARIO' ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell>
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
          p: '20px 24px',
          textAlign: 'center',
          backgroundColor: marioBalance === moritzBalance
            ? `rgba(31,138,101,0.05)`
            : dt.surfaceCard,
          borderColor: marioBalance === moritzBalance
            ? `rgba(31,138,101,0.2)`
            : dt.hairline,
        }}
      >
        <Typography sx={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.88px',
          textTransform: 'uppercase',
          color: dt.muted,
          mb: '8px',
        }}>
          {t('expenses.balance.title')}
        </Typography>
        {marioBalance === moritzBalance ? (
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: dt.semanticSuccess }}>
            {t('expenses.balance.settled')}
          </Typography>
        ) : marioBalance < moritzBalance ? (
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, mb: '2px' }}>
              {t('expenses.balance.marioOwesMoritz')}
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 400, letterSpacing: '-0.02em', color: dt.primary }}>
              {euro.format(moritzBalance / 100)}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, mb: '2px' }}>
              {t('expenses.balance.moritzOwesMario')}
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 400, letterSpacing: '-0.02em', color: dt.primary }}>
              {euro.format(marioBalance / 100)}
            </Typography>
          </Box>
        )}
        <Typography sx={{ fontSize: '0.75rem', color: dt.mutedSoft, mt: '8px', lineHeight: 1.4 }}>
          {t('expenses.balance.hint')}
        </Typography>
      </Paper>

      <Divider />

      <PayPalBalanceCard />

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight={600}>{t('expenses.total')}</Typography>
        <Typography>{euro.format(totalCents / 100)}</Typography>
      </Stack>

      <ExpenseDeleteDialog
        open={deleteDialogOpen}
        onClose={cancelDeleteExpense}
        onConfirm={confirmDeleteExpense}
      />
    </Box>
  );
}
