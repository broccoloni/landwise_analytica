import type {FC, ReactNode} from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import type {Report} from '@/types/report';
import {defaultReport, ReportContext} from './ReportContext';

const STORAGE_KEY = 'landwise.analytica.report';

const restoreReport = (): Report | null => {
  try {
    const restored: string | null = localStorage.getItem(STORAGE_KEY);
    return restored ? JSON.parse(restored) : null;
  } catch (err) {
    console.error('Failed to restore report:', err);
    return null;
  }
};

const storeReport = (report: Record<string, any>): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  } catch (err) {
    console.error(err);
  }
};

interface ReportProviderProps {
  children?: ReactNode;
}

export const ReportProvider: FC<ReportProviderProps> = (props) => {
  const {children} = props;
  const [state, setState] = useState<Report>(defaultReport);

  useEffect(() => {
    const restored = restoreReport();

    if (restored) {
      setState((prevState) => ({
        ...prevState,
        ...restored,
        isInitialized: true,
      }));
    }
  }, []);

  const handleUpdate = (report: Report): void => {
    setState((prevState) => {
      storeReport({
        ...report,
      });

      return {
        ...prevState,
        ...report,
      };
    });
  };

  const clearReportContext = (): void => {
    setState(defaultReport);
  };

  return (
    <ReportContext.Provider 
      value={{
        ...state,
        handleUpdate,
        clearReportContext,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

ReportProvider.propTypes = {
  children: PropTypes.any.isRequired,
};