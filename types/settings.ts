export type ClinicProfile = {
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logoUrl?: string | null;
};

export type CalculationSettingRow = {
  id: string;
  label: string;
  value: string;
  options: string[];
  description: string;
};

export type CalculationSettings = {
  rows: CalculationSettingRow[];
};


export type ProcedureCategory = {
  id: string;
  name: string;
  color: string;
};

export type ProcedureConfigItem = {
  /** Vazio ("") para procedimento novo ainda não persistido. */
  id: string;
  name: string;
  category: string;
  /** Valor de referência (R$) — fallback de ticket quando não há histórico. */
  price: number;
  /** Ciclo esperado de retorno (dias) — fonte da classificação de inatividade. */
  cycleExpectedDays: number;
  /**
   * false quando o ciclo NÃO está cadastrado no banco (NULL) — nesse caso
   * `cycleExpectedDays` carrega o valor que o motor usa de fato (biblioteca ou
   * default), para a UI nunca exibir um número diferente do classificador.
   */
  cycleDefined?: boolean;
  configurationStatus?: "pending" | "confirmed";
  createdSource?: "import" | "manual" | "system" | "legacy";
  observedAveragePrice?: number | null;
  confirmedAt?: string | null;
};

export type ExportAction = {
  id: string;
  title: string;
  description: string;
  icon: "cloud" | "users" | "document";
};

export type SettingsPageData = {
  dateRangeLabel: string;
  clinicProfile: ClinicProfile;
  calculationSettings: CalculationSettings;
  procedureCategories: ProcedureCategory[];
  exportActions: ExportAction[];
};
