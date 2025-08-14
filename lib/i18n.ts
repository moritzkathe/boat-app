type NestedDict = { [key: string]: string | NestedDict };

const de: NestedDict = {
  app: {
    title: "Cranchi Clipper",
  },
  nav: {
    calendar: "Kalender",
    expenses: "Ausgaben",
    back: "Zurück",
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
      title: "Per PayPal zahlen",
      subtitle: "QR-Code scannen und direkt zahlen",
    },
    status: {
      title: "System Status",
      subtitle: "Anwendungsgesundheit überwachen",
    },
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
  },
  status: {
    title: "System Status",
    subtitle: "Überwachung der Anwendungsgesundheit und Systemleistung",
    database: "Datenbank",
    api: "API",
    build: "Build",
    performance: "Performance",
    memory: "Speicher",
    network: "Netzwerk",
    databaseDesc: "Verbindung zur Datenbank",
    apiDesc: "API-Endpunkte Verfügbarkeit",
    buildDesc: "Letzter Build und Deployment",
    performanceDesc: "Antwortzeiten und Latenz",
    memoryDesc: "Speichernutzung und Ressourcen",
    networkDesc: "Netzwerkverbindung und Sicherheit",
    autoRefresh: "Status wird alle 30 Sekunden automatisch aktualisiert. Letzte Aktualisierung:",
    systemInfo: "Systeminformationen",
    environment: "Umgebung",
    version: "Version",
    nodeVersion: "Node.js",
    framework: "Framework",
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
      title: "Pay via PayPal",
      subtitle: "Scan the QR code to pay",
    },
    status: {
      title: "System Status",
      subtitle: "Monitor application health",
    },
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
  },
  status: {
    title: "System Status",
    subtitle: "Monitor application health and system performance",
    database: "Database",
    api: "API",
    build: "Build",
    performance: "Performance",
    memory: "Memory",
    network: "Network",
    databaseDesc: "Database connection",
    apiDesc: "API endpoints availability",
    buildDesc: "Last build and deployment",
    performanceDesc: "Response times and latency",
    memoryDesc: "Memory usage and resources",
    networkDesc: "Network connectivity and security",
    autoRefresh: "Status is automatically updated every 30 seconds. Last update:",
    systemInfo: "System Information",
    environment: "Environment",
    version: "Version",
    nodeVersion: "Node.js",
    framework: "Framework",
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
