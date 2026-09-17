"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ContractItem,
  EventItem,
  HomePayload,
  NetworkStats,
} from "@/modules/landing/domain/atlas-types";
import type { HomePageViewModel } from "@/modules/landing/domain/home-view-model";
import {
  mapActiveContracts,
  mapHomePayload,
  mapStatsToOverview,
  mergeIngestedEvents,
} from "@/modules/landing/domain/map-home-payload";
import {
  getDefaultNetwork,
  getRealtimeWsBaseUrl,
  REALTIME_WS_PATH,
} from "@/shared/config/env";

type ServerMessage = {
  type: string;
  network?: string;
  payload?: unknown;
};

const MAX_RECONNECT_MS = 30_000;
const RECENT_EVENT_LIMIT = 8;

function buildWsUrl(network: string): string {
  const base = getRealtimeWsBaseUrl();
  const params = new URLSearchParams({ network });
  return `${base}${REALTIME_WS_PATH}?${params.toString()}`;
}

export function useHomeWebSocket(initialData: HomePageViewModel) {
  const network = getDefaultNetwork();
  const [data, setData] = useState(initialData);

  const reconnectAttemptRef = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const shouldConnectRef = useRef(true);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current != null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(
    (connect: () => void) => {
      clearReconnectTimer();
      const attempt = reconnectAttemptRef.current;
      const delay = Math.min(1000 * 2 ** attempt, MAX_RECONNECT_MS);
      reconnectAttemptRef.current = attempt + 1;
      reconnectTimerRef.current = window.setTimeout(connect, delay);
    },
    [clearReconnectTimer],
  );

  const handleMessage = useCallback((event: MessageEvent<string>) => {
    let message: ServerMessage;
    try {
      message = JSON.parse(event.data) as ServerMessage;
    } catch {
      return;
    }

    switch (message.type) {
      case "home.snapshot": {
        const payload = message.payload as HomePayload;
        setData(mapHomePayload(payload));
        break;
      }
      case "home.stats_updated": {
        const stats = message.payload as NetworkStats;
        setData((current) => ({
          ...current,
          networkOverview: mapStatsToOverview(stats),
        }));
        break;
      }
      case "home.events_ingested": {
        const events = message.payload as EventItem[];
        setData((current) =>
          mergeIngestedEvents(current, events, RECENT_EVENT_LIMIT),
        );
        break;
      }
      case "home.contracts_updated": {
        const contracts = message.payload as ContractItem[];
        setData((current) => ({
          ...current,
          activeContracts: mapActiveContracts(contracts),
        }));
        break;
      }
      case "ping": {
        socketRef.current?.send(JSON.stringify({ type: "pong" }));
        break;
      }
      default:
        break;
    }
  }, []);

  useEffect(() => {
    shouldConnectRef.current = true;

    const connect = () => {
      if (!shouldConnectRef.current) return;

      clearReconnectTimer();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      const socket = new WebSocket(buildWsUrl(network));
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0;
      };

      socket.onmessage = handleMessage;

      socket.onclose = () => {
        socketRef.current = null;
        if (!shouldConnectRef.current) return;
        scheduleReconnect(connect);
      };
    };

    const handleVisibility = () => {
      if (document.hidden) {
        shouldConnectRef.current = false;
        clearReconnectTimer();
        socketRef.current?.close();
        socketRef.current = null;
        return;
      }

      shouldConnectRef.current = true;
      reconnectAttemptRef.current = 0;
      connect();
    };

    connect();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      shouldConnectRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      clearReconnectTimer();
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [clearReconnectTimer, handleMessage, network, scheduleReconnect]);

  return { data };
}
