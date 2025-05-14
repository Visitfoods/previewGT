'use client';

import { useEffect, useState } from 'react';

type EventType = 'pageView' | 'modelView' | 'interaction' | 'error' | 'performance';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  data?: Record<string, any>;
  timestamp: number;
}

interface PerformanceMetrics {
  fps: number[];
  loadTime: number;
  memoryUsage?: number;
  deviceInfo: {
    userAgent: string;
    platform: string;
    screenSize: string;
    isLowPerformance: boolean;
  };
}

// Armazenamento de eventos em memória para posterior envio
const events: AnalyticsEvent[] = [];
let performanceMetrics: PerformanceMetrics | null = null;

// Variáveis para medição de FPS
let lastFrameTime = 0;
let frameCount = 0;
const fpsSamples: number[] = [];

// Armazenar a última vez que enviamos dados para o servidor
let lastSendTime = 0;

// Estado global para saber se estamos em modo de baixo desempenho
let isLowPerformanceMode = false;

/**
 * Registar um evento de análise
 */
export const trackEvent = (type: EventType, name: string, data?: Record<string, any>) => {
  const event: AnalyticsEvent = {
    type,
    name,
    data,
    timestamp: Date.now()
  };
  
  events.push(event);
  
  // Registar no console em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics event:', event);
  }
  
  // Se acumularmos mais de 10 eventos, enviar para o servidor
  if (events.length >= 10 && Date.now() - lastSendTime > 30000) {
    sendEventsToServer();
  }
};

/**
 * Registar métricas de desempenho
 */
export const trackPerformance = (metrics: Partial<PerformanceMetrics>) => {
  if (!performanceMetrics) {
    performanceMetrics = {
      fps: [],
      loadTime: 0,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        isLowPerformance: isLowPerformanceMode
      }
    };
  }
  
  // Atualizar métricas existentes com as novas
  performanceMetrics = {
    ...performanceMetrics,
    ...metrics,
    deviceInfo: {
      ...performanceMetrics.deviceInfo,
      ...metrics.deviceInfo
    }
  };
};

/**
 * Medir FPS durante a renderização
 */
export const measureFPS = (timestamp: number) => {
  if (!lastFrameTime) {
    lastFrameTime = timestamp;
    return;
  }
  
  frameCount++;
  
  // Calcular FPS a cada segundo
  if (timestamp - lastFrameTime >= 1000) {
    const fps = Math.round(frameCount * 1000 / (timestamp - lastFrameTime));
    fpsSamples.push(fps);
    
    // Manter apenas os últimos 60 samples
    if (fpsSamples.length > 60) {
      fpsSamples.shift();
    }
    
    // Atualizar as métricas de desempenho
    trackPerformance({ fps: [...fpsSamples] });
    
    frameCount = 0;
    lastFrameTime = timestamp;
  }
};

/**
 * Enviar eventos acumulados para o servidor
 */
const sendEventsToServer = async () => {
  if (events.length === 0) return;
  
  try {
    // Clonar eventos para envio e limpar a lista
    const eventsToSend = [...events];
    events.length = 0;
    
    // Aqui, podemos implementar a lógica de envio para um serviço real
    // Por enquanto, apenas simularemos o envio
    
    // Em produção, envie para um endpoint real:
    /*
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        events: eventsToSend,
        performance: performanceMetrics 
      })
    });
    
    if (!response.ok) {
      throw new Error('Falha ao enviar dados de análise');
    }
    */
    
    // Registar envio
    console.log(`Enviados ${eventsToSend.length} eventos para análise`);
    lastSendTime = Date.now();
  } catch (error) {
    console.error('Erro ao enviar dados de análise:', error);
    // Recuperar os eventos para tentar enviar novamente mais tarde
    events.push(...events);
  }
};

/**
 * Componente hook para inicializar rastreamento de análise
 */
export const useAnalytics = (lowPerformanceMode: boolean = false) => {
  useEffect(() => {
    // Registar visualização de página
    isLowPerformanceMode = lowPerformanceMode;
    
    trackEvent('pageView', window.location.pathname);
    
    // Registrar tempo de carregamento
    if (window.performance) {
      const pageLoadTime = window.performance.timing.domContentLoadedEventEnd - 
                          window.performance.timing.navigationStart;
      
      trackPerformance({ 
        loadTime: pageLoadTime,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          isLowPerformance: lowPerformanceMode
        }
      });
    }
    
    // Tentar obter informações de uso de memória, se disponível
    if (window.performance && (window.performance as any).memory) {
      const memoryInfo = (window.performance as any).memory;
      trackPerformance({ 
        memoryUsage: memoryInfo.usedJSHeapSize / (1024 * 1024) // MB
      });
    }
    
    // Enviar dados quando o usuário sai da página
    const handleBeforeUnload = () => {
      sendEventsToServer();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Enviar dados periodicamente
    const interval = setInterval(() => {
      if (events.length > 0) {
        sendEventsToServer();
      }
    }, 60000); // 1 minuto
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
      sendEventsToServer();
    };
  }, [lowPerformanceMode]);
  
  return { trackEvent };
};

/**
 * Componente que envolve a aplicação para rastreamento
 */
const Analytics: React.FC<{ 
  children: React.ReactNode,
  lowPerformanceMode?: boolean
}> = ({ children, lowPerformanceMode = false }) => {
  useAnalytics(lowPerformanceMode);
  
  return <>{children}</>;
};

export default Analytics; 