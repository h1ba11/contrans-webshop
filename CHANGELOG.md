# Changelog

## 0.13.0

- Added a real My McHale serial number lookup to the machine selection flow.
- The lookup calls `https://my.mchale.net/api/MachineDetails/GetMachineDetails?serialNumber=...` directly from the browser in the static prototype.
- Found machine details are shown to the customer and added automatically to the inquiry text.
- Added graceful fallback messaging if the API call is blocked or fails.
- Added support for a future Contrans proxy endpoint through `window.CONTRANS_CONFIG.mchaleMachineDetailsEndpoint`.

## 0.12.0

- Simplified the user interface for customers with limited digital experience.
- Added a machine-first flow: choose machine → add parts → send inquiry.
- Added large buttons and clearer wording.
- Moved technical details, documents and related parts behind expandable details.
- Added illustration placeholders for machines and spare parts.
- Kept the portal inquiry-only: no public prices and no checkout.

## 0.11.0

- Initial inquiry-only spare parts portal MVP.
- Searchable catalog, documentation links and inquiry cart.
- CSV/data model tooling and GitHub Actions validation.
