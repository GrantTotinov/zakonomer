// src/services/dataIngestion.ts
// NOTE: This service is for future use when database tables are created.
// Currently disabled as we're using mock data.

export class DataIngestionService {
  
  async syncAll(): Promise<{ success: boolean; message: string }> {
    console.log('Data ingestion is currently disabled - using mock data')
    return {
      success: false,
      message: 'Data ingestion is disabled. Using mock data instead.'
    }
  }
}

// Export singleton instance
export const dataIngestionService = new DataIngestionService()
