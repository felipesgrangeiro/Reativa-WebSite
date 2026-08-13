export type ImportMethod = "excel" | "google-sheets" | "drag-drop";

export type ImportValidationStatus = "idle" | "validating" | "success" | "error";

export type ColumnMapping = {
  expectedField: string;
  detectedColumn: string;
  matched: boolean;
};

export type ImportValidationResult = {
  status: "success" | "error";
  columnMappings: ColumnMapping[];
  totalRecords: number;
  message?: string;
};

export type UploadedImportFile = {
  file: File;
  displayName: string;
  displaySize: string;
  /** Caminho no Supabase Storage após upload — preenchido na integração */
  storagePath?: string;
};

export const ACCEPTED_IMPORT_EXTENSIONS = [".xlsx", ".xls", ".csv"] as const;

export const ACCEPTED_IMPORT_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
] as const;

export const MOCK_COLUMN_MAPPINGS: ColumnMapping[] = [
  { expectedField: "Nome do cliente", detectedColumn: "Nome", matched: true },
  { expectedField: "Telefone", detectedColumn: "Telefone", matched: true },
  { expectedField: "Data do atendimento", detectedColumn: "Data", matched: true },
  { expectedField: "Procedimento", detectedColumn: "Procedimento", matched: true },
  { expectedField: "Valor pago", detectedColumn: "Valor", matched: true },
  { expectedField: "Profissional", detectedColumn: "Profissional", matched: true },
  { expectedField: "Forma de pagamento", detectedColumn: "Forma de Pagamento", matched: true },
  { expectedField: "Observação", detectedColumn: "Observação", matched: true },
  { expectedField: "Status do contato", detectedColumn: "Status", matched: true },
];

export const MOCK_TOTAL_RECORDS = 1248;
