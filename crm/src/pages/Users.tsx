import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
  CBadge,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilPlus } from "@coreui/icons";
import { useGetUsersQuery } from "../store/auth/auth.api";
import ToggleSlidersIcon from "../components/icons/ToggleSlidersIcon";
import ColumnSettingsModal, {
  ColumnConfig,
} from "../components/modals/ColumnSettingsModal";

const Users = () => {
  const { t } = useTranslation();
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [modalVisible, setModalVisible] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "id", label: "ID", visible: true },
    { key: "full_name", label: t("firstName"), visible: true },
    { key: "email", label: t("email"), visible: true },
    { key: "phone_number", label: t("phoneNumber"), visible: true },
    { key: "legal_status", label: t("legalStatus"), visible: true },
    { key: "is_active", label: t("active"), visible: true },
    { key: "role", label: t("role"), visible: true },
    { key: "actions", label: t("actions"), visible: true },
  ]);

  // Update column labels when language changes
  useEffect(() => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.key === "full_name") return { ...col, label: t("firstName") };
        if (col.key === "email") return { ...col, label: t("email") };
        if (col.key === "phone_number") return { ...col, label: t("phoneNumber") };
        if (col.key === "legal_status") return { ...col, label: t("legalStatus") };
        if (col.key === "is_active") return { ...col, label: t("active") };
        if (col.key === "role") return { ...col, label: t("role") };
        if (col.key === "actions") return { ...col, label: t("actions") };
        return col;
      })
    );
  }, [t]);

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );

  const sortedUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    return [...users].sort((a: any, b: any) => (b.id as number) - (a.id as number));
  }, [users]);

  useEffect(() => {
    if (users) {
      console.log("Список пользователей:", users);
    }
  }, [users]);

  const handleEdit = (userId: number) => {
    console.log("Редактирование пользователя:", userId);
    // TODO: Добавить логику редактирования
  };

  const handleDelete = (userId: number) => {
    console.log("Удаление пользователя:", userId);
    // TODO: Добавить логику удаления
  };

  const handleCreateUser = () => {
    console.log("Создание нового пользователя");
    // TODO: Добавить логику создания пользователя (открыть модальное окно или перейти на страницу)
  };

  const handleColumnsChange = (newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
  };

  const renderCellContent = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return user.id;
      case "full_name":
        return user.full_name || "-";
      case "email":
        return user.email || "-";
      case "phone_number":
        return user.phone_number || "-";
      case "legal_status":
        return user.legal_status || "-";
      case "is_active":
        return (
          <CBadge color={user.is_active ? "success" : "danger"}>
            {user.is_active ? t("yes") : t("no")}
          </CBadge>
        );
      case "role":
        return <CBadge color="info">{user.role || "-"}</CBadge>;
      case "actions":
        return (
          <div className="d-flex gap-2">
            <CButton
              color="primary"
              size="sm"
              onClick={() => handleEdit(user.id)}
              title={t("edit")}
            >
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton
              color="danger"
              size="sm"
              onClick={() => handleDelete(user.id)}
              title={t("delete")}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </div>
        );
      default:
        return "-";
    }
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">{t("nav.users")}</h3>
        <div className="d-flex align-items-center gap-2">
          <CButton 
            color="secondary" 
            variant="ghost" 
            className="d-flex align-items-center gap-2" 
            onClick={() => handleCreateUser()}
          >
            <CIcon icon={cilPlus} />
            <span>{t("createUser")}</span>
          </CButton>
          <CButton 
            color="secondary" 
            variant="ghost" 
            className="d-flex align-items-center gap-2" 
            onClick={() => setModalVisible(true)}
          >
            <ToggleSlidersIcon width={24} height={24} />
            <span>{t("showHideColumns")}</span>
          </CButton>
        </div>
      </div>

      {isLoading && (
        <div className="d-flex justify-content-center">
          <CSpinner color="primary" />
        </div>
      )}

      {error && (
        <CAlert color="danger" className="mb-4">
          {t("error")}
        </CAlert>
      )}

      {!isLoading && !error && (!users || users.length === 0) && (
        <CAlert color="info" className="mb-4">
          {t("noData")}
        </CAlert>
      )}

      {!isLoading && !error && users && users.length > 0 && (
        <CTable hover responsive bordered className="mb-4">
          <CTableHead className="bg-primary text-white fw-bold">
            <CTableRow>
              {visibleColumns.map((column) => (
                <CTableHeaderCell
                  key={column.key}
                  scope="col"
                  className="bg-primary text-white fw-bold"
                >
                  {column.label}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sortedUsers.map((user: any) => (
              <CTableRow key={user.id}>
                {visibleColumns.map((column) => (
                  <CTableDataCell key={column.key}>
                    {renderCellContent(user, column.key)}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <ColumnSettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        columns={columns}
        onColumnsChange={handleColumnsChange}
      />
    </div>
  );
};

export default Users;