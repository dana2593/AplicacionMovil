"use client"

import { useState, useCallback } from "react"
import type { ApiResponse } from "@/types/models"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await apiCall()

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        })
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || "Error desconocido",
        })
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
