# ColumnSettingsModal

A reusable modal component for managing table column visibility and order with drag-and-drop functionality.

## Features

- Toggle column visibility
- Reorder columns via drag and drop
- Responsive and mobile-friendly
- Internationalization support
- Cancel/Apply actions

## Usage

```tsx
import ColumnSettingsModal, { ColumnConfig } from "@/components/modals/ColumnSettingsModal";

const [columns, setColumns] = useState<ColumnConfig[]>([
  { key: "id", label: "ID", visible: true },
  { key: "name", label: t("name"), visible: true },
  { key: "email", label: t("email"), visible: true },
]);

<ColumnSettingsModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  columns={columns}
  onColumnsChange={(newColumns) => setColumns(newColumns)}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Called when modal should close |
| `columns` | `ColumnConfig[]` | Yes | Array of column configurations |
| `onColumnsChange` | `(columns: ColumnConfig[]) => void` | Yes | Called when columns are updated |

## ColumnConfig Interface

```tsx
interface ColumnConfig {
  key: string;      // Unique identifier for the column
  label: string;    // Display label (can be localized)
  visible: boolean; // Whether column is visible
}
```

## Internationalization Keys

The component uses the following i18n keys:
- `columnSettings` - Modal title
- `dragToReorder` - Instructions text
- `cancel` - Cancel button text
- `apply` - Apply button text

## Example: Dynamic Table Rendering

```tsx
const visibleColumns = useMemo(
  () => columns.filter((col) => col.visible),
  [columns]
);

<CTable>
  <CTableHead>
    <CTableRow>
      {visibleColumns.map((column) => (
        <CTableHeaderCell key={column.key}>
          {column.label}
        </CTableHeaderCell>
      ))}
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {data.map((row) => (
      <CTableRow key={row.id}>
        {visibleColumns.map((column) => (
          <CTableDataCell key={column.key}>
            {renderCellContent(row, column.key)}
          </CTableDataCell>
        ))}
      </CTableRow>
    ))}
  </CTableBody>
</CTable>
```
