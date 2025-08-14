type NestedDict = { [key: string]: string | NestedDict };

const de: NestedDict = {
  app: {
    title: "Cranchi Clipper",
  },
  wishlist: {
    title: "Wunschliste",
    item: "Gegenstand oder Leistung",
    link: "Link",
    reason: "Begründung",
    reasonPlaceholder: "Ideen und Vorschläge",
    proposedBy: "Vorschlag von",
    add: "Hinzufügen",
    empty: "Noch keine Vorschläge.",
  },
  nav: {
    calendar: "Kalender",
    expenses: "Ausgaben",
    back: "Zurück",
  },
  home: {
    headline: "Cranchi Clipper",
    tagline: "Reservierungen verwalten, Ausgaben teilen & Wünsche sammeln.",
    calendar: {
      title: "Kalender",
      subtitle: "Reservieren und Kalender einsehen",
    },
    expenses: {
      title: "Ausgaben",
      subtitle: "Kosten erfassen und aufteilen",
    },
    pay: {
      title: "PayPal Code",
      subtitle: "Code scannen zum Bezahlen",
    },
    status: {
      title: "System Status",
    },
  },
  status: {
    title: "System Status",
    subtitle: "Überwachung der Anwendungsgesundheit",
    uptime: "Laufzeit",
    memory: "Speichernutzung",
    responseTime: "Antwortzeit",
    database: "Datenbank",
    api: "API Status",
    lastBuild: "Letzter Build",
    autoRefresh: "Auto-Refresh aktiv",
  },
  backup: {
    title: "Backup",
    subtitle: "Datenbank Backup",
  },
  calendar: {
    mario: "Mario",
    moritz: "Moritz",
    primary: "Priorität",
    deleteTitle: "Reservierung löschen",
    deleteMessage: "Möchtest du diese Reservierung wirklich löschen? Dies kann nicht rückgängig gemacht werden.",
    deleteCancel: "Abbrechen",
    deleteConfirm: "Löschen",
  },
  creator: {
    date: "Datum",
    startTime: "Startzeit",
    endTime: "Endzeit",
    owner: "Wer nutzt das Boot?",
    add: "Reservierung hinzufügen",
  },
  expenses: {
    title: "Ausgaben",
    item: "Artikel / Leistung",
    cost: "Kosten",
    date: "Datum",
    paidBy: "Bezahlt von",
    add: "Ausgabe hinzufügen",
    empty: "Noch keine Ausgaben erfasst.",
    total: "Summe",
    balance: {
      title: "Ausgleich",
      settled: "Alles ausgeglichen",
      marioOwesMoritz: "Mario schuldet Moritz",
      moritzOwesMario: "Moritz schuldet Mario",
      hint: "Der Ausgleich berücksichtigt alle erfassten Ausgaben zu gleichen Teilen.",
    },
    deleteTitle: "Ausgabe löschen",
    deleteMessage: "Möchtest du diese Ausgabe wirklich löschen? Dies kann nicht rückgängig gemacht werden.",
    deleteCancel: "Abbrechen",
    deleteConfirm: "Löschen",
  },
  form: {
    required: "Pflichtfeld",
  },
};

const en: NestedDict = {
  app: { title: "Shared Boat" },
  nav: { calendar: "Calendar", expenses: "Expenses", back: "back" },
  home: {
    headline: "Shared Boat",
    tagline: "Manage reservations and split expenses fairly.",
    calendar: {
      title: "Calendar",
      subtitle: "Reserve and view schedule",
    },
    expenses: {
      title: "Expense Tracker",
      subtitle: "Log costs and split fairly",
    },
    pay: {
      title: "PayPal Code",
      subtitle: "Scan code to pay",
    },
    status: {
      title: "System Status",
    },
  },
  status: {
    title: "System Status",
    subtitle: "Application Health Monitoring",
    uptime: "Uptime",
    memory: "Memory Usage",
    responseTime: "Response Time",
    database: "Database",
    api: "API Status",
    lastBuild: "Last Build",
    autoRefresh: "Auto-refresh active",
  },
  backup: {
    title: "Backup",
    subtitle: "Database Backup",
  },
  calendar: { 
    mario: "Mario", 
    moritz: "Moritz", 
    primary: "primary",
    deleteTitle: "Delete reservation",
    deleteMessage: "Do you really want to delete this reservation? This cannot be undone.",
    deleteCancel: "Cancel",
    deleteConfirm: "Delete",
  },
  creator: {
    date: "Date",
    startTime: "Start time",
    endTime: "End time",
    owner: "Who uses the boat?",
    add: "Add reservation",
  },
  expenses: {
    title: "Expenses",
    item: "Item / Service",
    cost: "Cost",
    date: "Date",
    paidBy: "Paid by",
    add: "Add expense",
    empty: "No expenses yet.",
    total: "Total",
    balance: {
      title: "Settlement",
      settled: "All settled",
      marioOwesMoritz: "Mario owes Moritz",
      moritzOwesMario: "Moritz owes Mario",
      hint: "Settlement assumes equal split of all recorded expenses.",
    },
    deleteTitle: "Delete expense",
    deleteMessage: "Do you really want to delete this expense? This cannot be undone.",
    deleteCancel: "Cancel",
    deleteConfirm: "Delete",
  },
  form: { required: "Required" },
};

const dictionaries = { de, en } as const;
type Locale = keyof typeof dictionaries;

let currentLocale: Locale = 'de';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

function getFromDict(dict: NestedDict, path: string[]): string | undefined {
  let node: string | NestedDict | undefined = dict;
  for (const segment of path) {
    if (node && typeof node === 'object' && segment in node) {
      node = (node as NestedDict)[segment];
    } else {
      return undefined;
    }
  }
  return typeof node === 'string' ? node : undefined;
}

export function t(key: string): string {
  const path = key.split('.');
  const fromCurrent = getFromDict(dictionaries[currentLocale], path);
  if (fromCurrent) return fromCurrent;
  // fallback to EN
  const fromEn = getFromDict(dictionaries.en, path);
  return fromEn ?? key;
}

// Removed duplicate flat-key translation table to avoid re-declarations.


