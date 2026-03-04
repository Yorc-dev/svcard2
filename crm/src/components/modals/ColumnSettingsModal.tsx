import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import "./ColumnSettingsModal.module.css";

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  visible,
  onClose,
  columns,
  onColumnsChange,
}) => {
  const { t } = useTranslation();
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(columns);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const handleColumnToggle = (key: string) => {
    const updatedColumns = localColumns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setLocalColumns(updatedColumns);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    const updatedColumns = [...localColumns];
    const draggedItem = updatedColumns[draggedIndex];
    
    // Remove dragged item
    updatedColumns.splice(draggedIndex, 1);
    // Insert at new position
    updatedColumns.splice(index, 0, draggedItem);
    
    setLocalColumns(updatedColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleApply = () => {
    onColumnsChange(localColumns);
    onClose();
  };

  const handleCancel = () => {
    setLocalColumns(columns);
    onClose();
  };

  return (
    <CModal visible={visible} onClose={handleCancel} backdrop="static">
      <CModalHeader>
        <CModalTitle>{t("columnSettings")}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <small className="text-muted">{t("dragToReorder")}</small>
        </div>
        <div className="d-flex flex-column gap-2">
          {localColumns.map((column, index) => (
            <div
              key={column.key}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`column-item d-flex align-items-center gap-2 p-2 border rounded ${
                draggedIndex === index ? "dragging" : ""
              }`}
              style={{
                cursor: "move",
                transition: "background-color 0.2s",
              }}
            >
              <CIcon icon={cilMenu} className="text-muted" style={{ cursor: "grab" }} />
              <CFormCheck
                id={`col-${column.key}`}
                label={column.label}
                checked={column.visible}
                onChange={() => handleColumnToggle(column.key)}
                className="flex-grow-1"
              />
            </div>
          ))}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleCancel}>
          {t("cancel")}
        </CButton>
        <CButton color="primary" onClick={handleApply}>
          {t("apply")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ColumnSettingsModal;
