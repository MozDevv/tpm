'use client';
import { AuthApiService } from '@/components/services/authApi';
import { useAuth } from './AuthContext';
import authEndpoints from '@/components/services/authApi';
import { createContext, useContext, useEffect, useState } from 'react';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useCapNameStore } from '@/zustand/store';

const MdaContext = createContext();

export const useMda = () => useContext(MdaContext);

export const MdaProvider = ({ children }) => {
  const [mdas, setMdas] = useState([]);
  const { auth } = useAuth();
  const userId = auth?.user?.userId;
  const [mdaId, setMdaId] = useState('');
  const [activePensionCap, setActivePensionCap] = useState('');
  const [mdaName, setMdaName] = useState('');

  const [activeCapName, setActiveCapName] = useState('');

  const {setCapName} = useCapNameStore()

  const fetchUserDetails = async () => {
    try {
      const res = await AuthApiService.get(authEndpoints.getUsers, {
        documentID: userId,
      });
      if (res.status === 200) {
        if (!res.data.data.mdaId && typeof window !== 'undefined') {
          localStorage.removeItem('mdaId');
        }

        if (typeof window !== 'undefined' && res.data.data.mdaId) {
          const savedItem = localStorage.setItem('mdaId', res.data.data.mdaId);
          setMdaId(savedItem || res.data.data.mdaId);
        }
      }
      if (res.data.data.mdaId) {
        fetchMdas(res.data.data.mdaId);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchMdas = async (mdaId) => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        'paging.pageSize': 100,
      });

      const userMda = res.data.data.find((mda) => mda.id === mdaId);

      console.log('Found Logged In MDA', userMda);

      const currentCap = userMda?.pensionCap?.id;
      const currentCapName = userMda?.pensionCap?.name;

      setCapName(currentCapName)
      const currentMdaName = userMda?.name;
      setActiveCapName(currentCapName);

      // setCurrentMda(userMda);

      setActivePensionCap(currentCap);

      setMdaName(currentMdaName);
    } catch (error) {
      console.error('Error fetching MDAs:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]); // Added userId as a dependency to refetch when userId changes

  return (
    <MdaContext.Provider
      value={{
        mdaId,
        setMdaId,
        activePensionCap,
        setActiveCapName,
        setActivePensionCap,
        activeCapName,
        mdaName,
      }}
    >
      {children}
    </MdaContext.Provider>
  );
};
