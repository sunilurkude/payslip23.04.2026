
import { PayslipFieldMapping } from './types';

export const MANAGER_USER_ID = 'sunilurkude';
export const MANAGER_PASSWORD = 'Sunil@1987#'; // In a real app, this would not be hardcoded.
export const APP_TITLE = 'Teachers Payslip Portal';
export const ADMIN_CONTACT_MOBILE = '123-456-7890'; // Mock admin contact number

// IMPORTANT: This mapping is CRITICAL for the detailed payslip generation.
// It defines the structure of the payslip and how data is extracted from Excel.
// - payslipLabel: The exact header name from the Excel sheet.
// - excelHeaderCandidates: Should contain only the `payslipLabel` for exact matching.
// - category: Determines where the field appears ('headerInfo', 'emolument', 'govtRecovery', 'nonGovtRecovery', 'summaryField').
// - isCurrency: If the value is monetary.
// The order of items within each category here will influence display order, matching Excel column order.

export const DEFAULT_PAYSLIP_MAPPINGS: PayslipFieldMapping[] = [
  // Header Information - Mapped from Excel, order matters for display logic
  { payslipLabel: "NAME OF SCHOOL", excelHeaderCandidates: ["NAME OF SCHOOL"], category: 'headerInfo' },
  { payslipLabel: "SCHOOL SHALARTH DDO CODE", excelHeaderCandidates: ["SCHOOL SHALARTH DDO CODE"], category: 'headerInfo' },
  { payslipLabel: "EMPLOYEE NAME", excelHeaderCandidates: ["EMPLOYEE NAME"], category: 'headerInfo' },
  { payslipLabel: "SHALARTH ID", excelHeaderCandidates: ["SHALARTH ID"], category: 'headerInfo' },
  { payslipLabel: "DESIGNATION", excelHeaderCandidates: ["DESIGNATION"], category: 'summaryField' }, // Changed to summaryField
  { payslipLabel: "GPF NO", excelHeaderCandidates: ["GPF NO"], category: 'headerInfo' },
  { payslipLabel: "PAN NO", excelHeaderCandidates: ["PAN NO"], category: 'headerInfo' },
  { payslipLabel: "PRAN NO", excelHeaderCandidates: ["PRAN NO"], category: 'headerInfo' },
  { payslipLabel: "ADHAR NO", excelHeaderCandidates: ["ADHAR NO"], category: 'headerInfo' },
  { payslipLabel: "EMAIL ID", excelHeaderCandidates: ["EMAIL ID"], category: 'headerInfo' },
  { payslipLabel: "MOB NO", excelHeaderCandidates: ["MOB NO"], category: 'headerInfo' },
  { payslipLabel: "BANK ACCOUNT NUMBER", excelHeaderCandidates: ["BANK ACCOUNT NUMBER"], category: 'headerInfo' }, // Employee's bank
  { payslipLabel: "BANK IFSC CODE", excelHeaderCandidates: ["BANK IFSC CODE"], category: 'headerInfo' }, // Employee's bank
  { payslipLabel: "BRANCH NAME", excelHeaderCandidates: ["BRANCH NAME"], category: 'headerInfo' }, // Employee's bank
  { payslipLabel: "PAY MATRIX", excelHeaderCandidates: ["PAY MATRIX"], category: 'headerInfo' },
  
  // Other potential header fields from Excel (not directly displayed in the specified detailed header section, but available)
  { payslipLabel: "SR.NO", excelHeaderCandidates: ["SR.NO"], category: 'summaryField', isCurrency: false }, // Changed to summaryField
  { payslipLabel: "BLOCK / TALUKA", excelHeaderCandidates: ["BLOCK / TALUKA"], category: 'headerInfo', isCurrency: false },
  { payslipLabel: "SCHOOL UDISE CODE", excelHeaderCandidates: ["SCHOOL UDISE CODE"], category: 'headerInfo', isCurrency: false },
  { payslipLabel: "S.R NO OF EMPL", excelHeaderCandidates: ["S.R NO OF EMPL"], category: 'summaryField', isCurrency: false }, // Changed to summaryField
  { payslipLabel: "GENDER M/F", excelHeaderCandidates: ["GENDER M/F"], category: 'headerInfo', isCurrency: false },
  { payslipLabel: "DCPS NO", excelHeaderCandidates: ["DCPS NO"], category: 'summaryField', isCurrency: false }, // Changed to summaryField
  { payslipLabel: "DDO BANK NAME", excelHeaderCandidates: ["DDO BANK NAME"], category: 'summaryField', isCurrency: false }, // Changed to summaryField
  { payslipLabel: "DDO BANK ACCOUNT NUMBER", excelHeaderCandidates: ["DDO BANK ACCOUNT NUMBER"], category: 'summaryField', isCurrency: false }, // Changed to summaryField
  { payslipLabel: "DDO BANK IFSC CODE", excelHeaderCandidates: ["DDO BANK IFSC CODE"], category: 'summaryField', isCurrency: false }, // Changed to summaryField
  { payslipLabel: "BANK NAME", excelHeaderCandidates: ["BANK NAME"], category: 'headerInfo', isCurrency: false },

  // Emoluments (Earnings) - Section 1
  { payslipLabel: "BASIC PAY", excelHeaderCandidates: ["BASIC PAY"], category: 'emolument', isCurrency: true }, // Z
  { payslipLabel: "D.A", excelHeaderCandidates: ["D.A"], category: 'emolument', isCurrency: true }, // AA
  { payslipLabel: "HRA", excelHeaderCandidates: ["HRA"], category: 'emolument', isCurrency: true }, // AB
  { payslipLabel: "T.A", excelHeaderCandidates: ["T.A"], category: 'emolument', isCurrency: true }, // AC
  { payslipLabel: "T.A ARREAR", excelHeaderCandidates: ["T.A ARREAR"], category: 'emolument', isCurrency: true }, // AD
  { payslipLabel: "TRIBAL ALLOWANCE", excelHeaderCandidates: ["TRIBAL ALLOWANCE"], category: 'emolument', isCurrency: true }, // AE
  { payslipLabel: "WASHING ALLOWANCE", excelHeaderCandidates: ["WASHING ALLOWANCE"], category: 'emolument', isCurrency: true }, // AF
  { payslipLabel: "DA ARREARS", excelHeaderCandidates: ["DA ARREARS"], category: 'emolument', isCurrency: true }, // AG
  { payslipLabel: "BASIC ARREARS", excelHeaderCandidates: ["BASIC ARREARS"], category: 'emolument', isCurrency: true }, // AH
  { payslipLabel: "CLA", excelHeaderCandidates: ["CLA"], category: 'emolument', isCurrency: true }, // AI
  { payslipLabel: "NPS EMPR ALLOW", excelHeaderCandidates: ["NPS EMPR ALLOW"], category: 'emolument', isCurrency: true }, // AJ
  
  // Fields explicitly hidden by user
  { payslipLabel: "TOTAL PAY", excelHeaderCandidates: ["TOTAL PAY"], category: 'summaryField', isCurrency: true }, // AK - HIDDEN
  { payslipLabel: "GROSS AFTER DEDUCTING FA", excelHeaderCandidates: ["GROSS AFTER DEDUCTING FA"], category: 'summaryField', isCurrency: true }, // AM - HIDDEN
  { payslipLabel: "NPS TOTAL", excelHeaderCandidates: ["NPS TOTAL"], category: 'summaryField', isCurrency: true }, // BF - HIDDEN
  { payslipLabel: "NGR(TOTAL DEDUCTIONS)", excelHeaderCandidates: ["NGR(TOTAL DEDUCTIONS)"], category: 'summaryField', isCurrency: true }, // BP - HIDDEN

  // Govt. Recoveries (Deductions) - Section 2
  { payslipLabel: "NPS EMPR CONTRI", excelHeaderCandidates: ["NPS EMPR CONTRI"], category: 'govtRecovery', isCurrency: true }, // BB
  { payslipLabel: "NPS EMP CONTRI", excelHeaderCandidates: ["NPS EMP CONTRI"], category: 'govtRecovery', isCurrency: true }, // BC
  { payslipLabel: "NPS EMPR CONTRI ARR", excelHeaderCandidates: ["NPS EMPR CONTRI ARR"], category: 'govtRecovery', isCurrency: true }, // BD
  { payslipLabel: "NPS EMP CONTRI ARR", excelHeaderCandidates: ["NPS EMP CONTRI ARR"], category: 'govtRecovery', isCurrency: true }, // BE
  { payslipLabel: "GPF", excelHeaderCandidates: ["GPF"], category: 'govtRecovery', isCurrency: true }, // AN
  { payslipLabel: "GPF ADV", excelHeaderCandidates: ["GPF ADV"], category: 'govtRecovery', isCurrency: true }, // AO
  { payslipLabel: "PT", excelHeaderCandidates: ["PT"], category: 'govtRecovery', isCurrency: true }, // AP
  { payslipLabel: "GIS(ZP)", excelHeaderCandidates: ["GIS(ZP)"], category: 'govtRecovery', isCurrency: true }, // AQ
  { payslipLabel: "GIS SCOUT", excelHeaderCandidates: ["GIS SCOUT"], category: 'govtRecovery', isCurrency: true }, // AR
  { payslipLabel: "DCPS REGULAR", excelHeaderCandidates: ["DCPS REGULAR"], category: 'govtRecovery', isCurrency: true }, // AS
  { payslipLabel: "DCPS DELAYED", excelHeaderCandidates: ["DCPS DELAYED"], category: 'govtRecovery', isCurrency: true }, // AT
  { payslipLabel: "DCPS PAY ARREARS RECOVERY", excelHeaderCandidates: ["DCPS PAY ARREARS RECOVERY"], category: 'govtRecovery', isCurrency: true }, // AU
  { payslipLabel: "REVENUE STAMP", excelHeaderCandidates: ["REVENUE STAMP"], category: 'govtRecovery', isCurrency: true }, // AV
  { payslipLabel: "DCPS DA ARREARS RECOVERY", excelHeaderCandidates: ["DCPS DA ARREARS RECOVERY"], category: 'govtRecovery', isCurrency: true }, // AW
  { payslipLabel: "GROUP ACCIDENTAL POLICY", excelHeaderCandidates: ["GROUP ACCIDENTAL POLICY"], category: 'govtRecovery', isCurrency: true }, // AX
  { payslipLabel: "NAA", excelHeaderCandidates: ["NAA"], category: 'govtRecovery', isCurrency: true }, // AY
  { payslipLabel: "F A", excelHeaderCandidates: ["F A"], category: 'govtRecovery', isCurrency: true }, // AL
  
  // Intermediate summary fields from Excel, not itemized recoveries but used for context
  { payslipLabel: "TOTAL GOVT DEDUCTIONS", excelHeaderCandidates: ["TOTAL GOVT DEDUCTIONS"], category: 'summaryField', isCurrency: true }, // AZ
  { payslipLabel: "GROSS PAYMENT AFTER GOVT DEDUCTIONS", excelHeaderCandidates: ["GROSS PAYMENT AFTER GOVT DEDUCTIONS"], category: 'summaryField', isCurrency: true }, // BA
  { payslipLabel: "GROSS PAYMENT AFTER NPS DEDUCTIONS", excelHeaderCandidates: ["GROSS PAYMENT AFTER NPS DEDUCTIONS"], category: 'summaryField', isCurrency: true },  // BG

  // Non Govt. Recoveries - Section 3
  { payslipLabel: "INCOME TAX", excelHeaderCandidates: ["INCOME TAX"], category: 'nonGovtRecovery', isCurrency: true }, // BH
  { payslipLabel: "CO-OP BANK", excelHeaderCandidates: ["CO-OP BANK"], category: 'nonGovtRecovery', isCurrency: true }, // BI
  { payslipLabel: "NGR(LIC)", excelHeaderCandidates: ["NGR(LIC)"], category: 'nonGovtRecovery', isCurrency: true }, // BJ
  { payslipLabel: "NGR(SOCIETY LOAN)", excelHeaderCandidates: ["NGR(SOCIETY LOAN)"], category: 'nonGovtRecovery', isCurrency: true }, // BK
  { payslipLabel: "NGR(MISC)", excelHeaderCandidates: ["NGR(MISC)"], category: 'nonGovtRecovery', isCurrency: true }, // BL
  { payslipLabel: "NGR(OTHER RECOVERY)", excelHeaderCandidates: ["NGR(OTHER RECOVERY)"], category: 'nonGovtRecovery', isCurrency: true }, // BM
  { payslipLabel: "NGR(RD)", excelHeaderCandidates: ["NGR(RD)"], category: 'nonGovtRecovery', isCurrency: true }, // BN
  { payslipLabel: "NGR(OTHER DEDUCTION)", excelHeaderCandidates: ["NGR(OTHER DEDUCTION)"], category: 'nonGovtRecovery', isCurrency: true }, // BO
  
  // Final Net Salary from Excel (used directly for display, not itemized)
  { payslipLabel: "EMPLOYEE NET SALARY", excelHeaderCandidates: ["EMPLOYEE NET SALARY"], category: 'summaryField', isCurrency: true }, // BQ
];