
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, ConversionResult } from '../types';
import { convertArtistToStyle } from '../services/geminiService';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDocs, 
  writeBatch,
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = 'conversions';
const LOCAL_STORAGE_KEY = 'vocal_morph_history';

export const useMusicConverter = () => {
  const [state, setState] = useState<AppState>({
    history: [],
    isLoading: false,
    error: null,
    currentResult: null,
  });
  
  const [cloudSyncActive, setCloudSyncActive] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const isFallbackActive = useRef(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const loadLocalHistory = (): ConversionResult[] => {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      return [];
    }
  };

  const saveLocalHistory = (history: ConversionResult[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history.slice(0, 15)));
    } catch (e) {
      console.error("Local storage save failed", e);
    }
  };

  const connectToFirestore = useCallback(() => {
    if (unsubscribeRef.current) unsubscribeRef.current();

    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(15)
    );

    unsubscribeRef.current = onSnapshot(q, (querySnapshot) => {
      const history: ConversionResult[] = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() } as ConversionResult);
      });
      
      setCloudSyncActive(true);
      isFallbackActive.current = false;
      setState(prev => ({ ...prev, history, error: null }));
      saveLocalHistory(history);
      setIsRetrying(false);
    }, (error) => {
      console.warn("Firestore Error:", error.code, error.message);
      setCloudSyncActive(false);
      isFallbackActive.current = true;
      setIsRetrying(false);
      
      let errorMsg = "Mode Lokal: Data tidak akan sinkron antar browser.";
      if (error.code === 'permission-denied') {
        errorMsg = "Akses Ditolak: Periksa 'Firestore Rules' di Firebase Console Anda. Pastikan 'allow read, write' diatur ke true.";
      } else if (error.message.includes("API has not been used")) {
        errorMsg = "API Belum Aktif: Silakan aktifkan Firestore API di Google Cloud Console.";
      }
      setState(prev => ({ ...prev, error: errorMsg }));
    });
  }, []);

  useEffect(() => {
    const initialLocal = loadLocalHistory();
    setState(prev => ({ ...prev, history: initialLocal }));
    connectToFirestore();
    return () => unsubscribeRef.current?.();
  }, [connectToFirestore]);

  const refreshConnection = () => {
    setIsRetrying(true);
    connectToFirestore();
  };

  const convert = useCallback(async (artistName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const description = await convertArtistToStyle(artistName);
      
      const newResultData: Omit<ConversionResult, 'id'> = {
        artistName,
        safeDescription: description,
        timestamp: Date.now(),
      };

      let finalResult: ConversionResult = { ...newResultData };

      // Mencoba simpan ke Cloud
      if (!isFallbackActive.current) {
        try {
          const docRef = await addDoc(collection(db, COLLECTION_NAME), newResultData);
          finalResult.id = docRef.id;
        } catch (cloudErr: any) {
          console.error("Cloud save failed:", cloudErr);
          // Jika gagal simpan ke cloud tapi koneksi hijau, kemungkinan besar karena RULES
          if (cloudErr.code === 'permission-denied') {
            setState(prev => ({ ...prev, error: "Gagal Sinkron: Cek 'Rules' di Firebase Console Anda agar mengizinkan tulis (write)." }));
          }
        }
      }

      setState(prev => {
        // Gabungkan dengan history yang ada, hindari duplikat jika snapshot belum datang
        const exists = prev.history.some(h => h.artistName === finalResult.artistName && Math.abs(h.timestamp - finalResult.timestamp) < 5000);
        const updatedHistory = exists ? prev.history : [finalResult, ...prev.history].slice(0, 15);
        saveLocalHistory(updatedHistory);
        return {
          ...prev,
          isLoading: false,
          currentResult: finalResult,
          history: updatedHistory
        };
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred",
      }));
    }
  }, []);

  const selectHistoryItem = (item: ConversionResult) => {
    setState(prev => ({ ...prev, currentResult: item }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = async () => {
    if (!confirm("Hapus semua riwayat di Cloud dan Lokal?")) return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (!isFallbackActive.current) {
      try {
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.forEach((document) => {
          batch.delete(doc(db, COLLECTION_NAME, document.id));
        });
        await batch.commit();
      } catch (err) {
        console.error("Failed to clear cloud history", err);
      }
    }
    setState(prev => ({ ...prev, currentResult: null, history: [] }));
  };

  return {
    ...state,
    cloudSyncActive,
    isRetrying,
    convert,
    selectHistoryItem,
    clearHistory,
    refreshConnection
  };
};
