/**
 * Centralized dropdown option lists for all categorical prediction
 * fields. These are sourced from common industry values as a
 * starting point — the backend currently accepts free-form strings
 * for these fields (see PredictionRequest schema notes). Once the
 * exact training vocabulary is confirmed, update this file only;
 * no other module needs to change.
 */

export interface SelectOption {
  label: string;
  value: string;
}

const toOptions = (values: string[]): SelectOption[] =>
  values.map((value) => ({ label: value, value }));

export const DEVICE_TYPE_OPTIONS = toOptions(["Laptop", "Desktop"]);
export const BRAND_OPTIONS = toOptions([
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "MSI",
  "Samsung",
  "Razer",
  "Other",
]);

export const OS_OPTIONS = toOptions(["Windows", "macOS", "Linux"]);

export const FORM_FACTOR_OPTIONS = toOptions([
  "Atx",
  "Mainstream",
  "sff",
  "Gaming",
  "Micro-Atx",
  "Ultrabook",
  "2-In-1",
  "Full-Tower",
  "Workstation",
]);

export const CPU_BRAND_OPTIONS = toOptions(["Intel", "AMD", "Apple"]);

export const CPU_SERIES_OPTIONS = toOptions([
  "Core",
  "Core Ultra",
  "Ryzen",
  "Apple Silicon",
  "Celeron",
  "Pentium",
]);

export const GPU_BRAND_OPTIONS = toOptions(["Nvidia", "AMD", "Intel", "Apple"]);

export const GPU_FAMILY_OPTIONS = toOptions([
  "Ada Lovelace",
  "Ampere",
  "RDNA 3",
  "Xe",
  "Apple Silicon GPU",
]);

export const STORAGE_TYPE_OPTIONS = toOptions([
  "NVMe SSD",
  "SATA SSD",
  "HDD",
  "eMMC",
  "Hybrid",
]);

export const DISPLAY_TYPE_OPTIONS = toOptions([
  "IPS",
  "OLED",
  "TN",
  "VA",
  "Mini-LED",
  "Retina",
]);

export const WIFI_OPTIONS = toOptions([
  "Wi-Fi 5",
  "Wi-Fi 6",
  "Wi-Fi 6E",
  "Wi-Fi 7",
]);
