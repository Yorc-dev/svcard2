import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';
import { useGetApplicationsListQuery } from '../store/applications/applications.api';
import { useGetMeQuery } from '../store/auth/auth.api';

type SortField = 'id' | 'first_name' | 'last_name' | 'organization_name' | 'email' | null;
type SortOrder = 'asc' | 'desc';

const Applications = () => {
  const { t } = useTranslation();
  const hasToken = Boolean(localStorage.getItem('svcard_token'));
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    isError: isUserError,
    isSuccess: isUserSuccess,
  } = useGetMeQuery(undefined, {
    skip: !hasToken,
  });
  const rawRole = isUserSuccess ? (currentUser as any)?.role ?? (currentUser as any)?.user?.role : null;
  const normalizedRole = typeof rawRole === 'string' ? rawRole.toLowerCase() : null;
  const canAccessApplications = normalizedRole === 'admin' || normalizedRole === 'moderator';
  const { data: applications, isLoading, error } = useGetApplicationsListQuery({}, {
    skip: !canAccessApplications,
  });
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const tableRows = useMemo(() => {
    if (!applications) return [];
    
    if (!sortField) return applications;

    const sorted = [...applications].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Для числовых полей
      if (sortField === 'id') {
        aValue = Number(aValue);
        bValue = Number(bValue);
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Для строковых полей
      aValue = aValue?.toString().toLowerCase() || '';
      bValue = bValue?.toString().toLowerCase() || '';

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [applications, sortField, sortOrder]);

  if (!hasToken) {
    return <Navigate to="/" replace />;
  }

  if (!canAccessApplications && !isUserLoading && !isUserFetching) {
    return <Navigate to="/" replace />;
  }

  //moderator@gmail.com
  //admin@gmail.com

  return (
    <div>
      <div className="mb-3">
        <h3 className="mb-3">{t('nav.applications')}</h3>
      </div>

      {(isLoading || isUserLoading || isUserFetching) && (
        <div className="d-flex justify-content-center">
          <CSpinner color="primary" />
        </div>
      )}

      {(error || isUserError) && (
        <CAlert color="danger" className="mb-4">
          {t('error')}
        </CAlert>
      )}

      {!isLoading && !error && tableRows.length === 0 && (
        <CAlert color="info" className="mb-4">
          {t('noData')}
        </CAlert>
      )}

      {!isLoading && !error && tableRows.length > 0 && (
        <CTable hover responsive bordered className="mb-4">
          <CTableHead className="bg-primary text-white fw-bold">
            <CTableRow>
              <CTableHeaderCell 
                scope="col" 
                className="bg-primary text-white fw-bold" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('id')}
              >
                ID
                {sortField === 'id' && (
                  <CIcon icon={sortOrder === 'asc' ? cilArrowTop : cilArrowBottom} className="ms-2" />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell 
                scope="col" 
                className="bg-primary text-white fw-bold" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('first_name')}
              >
                {t('firstName')}
                {sortField === 'first_name' && (
                  <CIcon icon={sortOrder === 'asc' ? cilArrowTop : cilArrowBottom} className="ms-2" />
                )}
              </CTableHeaderCell>
              {/* <CTableHeaderCell 
                scope="col" 
                className="bg-primary text-white fw-bold" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('last_name')}
              >
                {t('lastName')}
                {sortField === 'last_name' && (
                  <CIcon icon={sortOrder === 'asc' ? cilArrowTop : cilArrowBottom} className="ms-2" />
                )}
              </CTableHeaderCell> */}
              {/* <CTableHeaderCell 
                scope="col" 
                className="bg-primary text-white fw-bold" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('organization_name')}
              >
                {t('organizationName')}
                {sortField === 'organization_name' && (
                  <CIcon icon={sortOrder === 'asc' ? cilArrowTop : cilArrowBottom} className="ms-2" />
                )}
              </CTableHeaderCell> */}
              <CTableHeaderCell scope="col" className="bg-primary text-white fw-bold">{t('phoneNumber')}</CTableHeaderCell>
              {/* <CTableHeaderCell 
                scope="col" 
                className="bg-primary text-white fw-bold" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('email')}
              >
                Email
                {sortField === 'email' && (
                  <CIcon icon={sortOrder === 'asc' ? cilArrowTop : cilArrowBottom} className="ms-2" />
                )}
              </CTableHeaderCell> */}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tableRows.map((application) => (
              <CTableRow key={application.id}>
                <CTableDataCell>{application.id}</CTableDataCell>
                <CTableDataCell>{application.first_name}</CTableDataCell>
                {/* <CTableDataCell>{application.last_name}</CTableDataCell> */}
                {/* <CTableDataCell>{application.organization_name}</CTableDataCell> */}
                <CTableDataCell>{application.phone_number?.replace(/^tel:/, '') || '-'}</CTableDataCell>
                {/* <CTableDataCell>{application.email}</CTableDataCell> */}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </div>
  );
};

export default Applications;