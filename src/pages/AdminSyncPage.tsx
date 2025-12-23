// src/pages/AdminSyncPage.tsx

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { dataIngestionService } from '@/services/dataIngestion'
import {
  RefreshCw,
  Database,
  Users,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'

export default function AdminSyncPage() {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleSync = async () => {
    setSyncing(true)
    setResult(null)

    try {
      const syncResult = await dataIngestionService.syncAll()
      setResult(syncResult)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Администраторски панел
            </h1>
            <p className="text-muted-foreground">
              Синхронизиране на данни от Parliament API
            </p>
          </div>

          {/* Sync Status */}
          {result && (
            <Alert
              className={`mb-6 ${
                result.success ? 'border-green-500' : 'border-red-500'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>
                {result.success
                  ? 'Синхронизацията завърши успешно'
                  : 'Грешка при синхронизация'}
              </AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          {/* Sync Controls */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Депутати
                </CardTitle>
                <CardDescription>
                  Синхронизира депутати и партии
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Законопроекти
                </CardTitle>
                <CardDescription>
                  Синхронизира законопроекти (скоро)
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Гласувания
                </CardTitle>
                <CardDescription>
                  Синхронизира гласувания (скоро)
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Main Sync Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Пълна синхронизация
              </CardTitle>
              <CardDescription>
                Извлича всички налични данни от Parliament API и ги записва в
                базата данни
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSync}
                disabled={syncing}
                size="lg"
                className="w-full"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Синхронизиране...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Стартирай синхронизация
                  </>
                )}
              </Button>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">
                  Какво се случва при синхронизация:
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Извлича списък с депутати от Parliament API</li>
                  <li>Създава или обновява записите за партии</li>
                  <li>Създава или обновява записите за депутати</li>
                  <li>Свързва депутатите с техните партии</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* API Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>API Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Base URL:</span>
                <span className="font-mono">
                  https://www.parliament.bg/api/v1
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proxy Endpoint:</span>
                <span className="font-mono">
                  /functions/v1/parliament-proxy
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache Duration:</span>
                <span>5 минути</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
