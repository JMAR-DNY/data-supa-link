
import { supabase } from "@/integrations/supabase/client";
import { ContactDataItem } from "@/contexts/ListCreationContext";

interface DataIngestionResult {
  success: boolean;
  sourceId?: number;
  rowsProcessed: number;
  errors?: string[];
}

/**
 * Sanitize a string to prevent SQL injection
 */
const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    // Basic sanitization
    return value.replace(/['";]/g, '');
  }
  return value;
};

/**
 * Create a new source record for the uploaded CSV file
 */
const createSourceRecord = async (
  fileName: string, 
  recordCount: number,
  teamId: number,
  profileId?: number
): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('sources')
      .insert({
        file_name: fileName,
        record_count: recordCount,
        source_type_id: 1, // CSV data
        status_id: 1, // Raw record
        team_id: teamId,
        created_by_profile_id: profileId || null
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating source record:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Error in createSourceRecord:', err);
    return null;
  }
};

/**
 * Insert CSV data into source_data table
 */
const insertSourceData = async (
  sourceId: number, 
  rows: ContactDataItem[],
  listId?: number
): Promise<number> => {
  let successCount = 0;
  
  // Process in batches of 100 for better performance
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchData = batch.map(row => ({
      source_id: sourceId,
      raw_data: row,
      processed: false,
      list_id: listId
    }));
    
    const { data, error } = await supabase
      .from('source_data')
      .insert(batchData);
    
    if (!error) {
      successCount += batch.length;
    } else {
      console.error('Error inserting batch:', error);
    }
  }
  
  return successCount;
};

/**
 * Process the data with the specified mappings
 * This is where raw data gets transformed into contacts/companies
 */
const processDataWithMappings = async (
  sourceId: number,
  mappings: Record<string, string>
): Promise<boolean> => {
  try {
    // Fetch the source data that needs processing
    const { data: sourceData, error: fetchError } = await supabase
      .from('source_data')
      .select('*')
      .eq('source_id', sourceId)
      .eq('processed', false);
    
    if (fetchError || !sourceData) {
      console.error('Error fetching source data for processing:', fetchError);
      return false;
    }
    
    // Process each record
    for (const record of sourceData) {
      try {
        const rawData = record.raw_data;
        
        // Create structures for the processed data
        const contactData: any = {};
        const companyData: any = {};
        const addressData: any = {};
        const emailData: any = {};
        const phoneData: any = {};
        const urlData: any = {};
        
        // Process each mapping
        for (const [csvField, dbField] of Object.entries(mappings)) {
          const value = rawData[csvField];
          if (value === undefined || value === null || value === '') continue;
          
          // Determine which table this field belongs to based on the field path
          if (dbField.startsWith('contacts.')) {
            contactData[dbField.replace('contacts.', '')] = sanitizeValue(value);
          } else if (dbField.startsWith('companies.')) {
            companyData[dbField.replace('companies.', '')] = sanitizeValue(value);
          } else if (dbField.startsWith('contact_addresses.') || dbField.startsWith('company_addresses.')) {
            addressData[dbField.split('.')[1]] = sanitizeValue(value);
          } else if (dbField.startsWith('contact_email_addresses.') || dbField.startsWith('company_email_addresses.')) {
            emailData[dbField.split('.')[1]] = sanitizeValue(value);
          } else if (dbField.startsWith('contact_phone_numbers.') || dbField.startsWith('company_phone_numbers.')) {
            phoneData[dbField.split('.')[1]] = sanitizeValue(value);
          } else if (dbField.startsWith('contact_urls.') || dbField.startsWith('company_urls.')) {
            urlData[dbField.split('.')[1]] = sanitizeValue(value);
          }
        }
        
        // TODO: Insert the processed data into the respective tables
        // This would involve creating contact/company records first,
        // then creating related address/email/phone/url records
        
        // Mark as processed
        await supabase
          .from('source_data')
          .update({ processed: true })
          .eq('id', record.id);
        
      } catch (processError) {
        console.error('Error processing record:', processError);
        
        // Log the error
        await supabase
          .from('source_data')
          .update({
            error_log: `Error processing: ${processError}`
          })
          .eq('id', record.id);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error in processDataWithMappings:', err);
    return false;
  }
};

/**
 * Main function to ingest CSV data into the database
 */
export const ingestCsvData = async (
  fileName: string,
  contactData: ContactDataItem[],
  mappings: Record<string, string>,
  teamId: number,
  profileId?: number,
  listId?: number
): Promise<DataIngestionResult> => {
  try {
    // Step 1: Create a source record
    const sourceId = await createSourceRecord(
      fileName,
      contactData.length,
      teamId,
      profileId
    );
    
    if (!sourceId) {
      return {
        success: false,
        rowsProcessed: 0,
        errors: ['Failed to create source record']
      };
    }
    
    // Step 2: Insert raw data into source_data
    const rowsProcessed = await insertSourceData(sourceId, contactData, listId);
    
    // Step 3: Process the data with mappings
    // This is commented out for now as it requires more complex logic
    // const processingSuccess = await processDataWithMappings(sourceId, mappings);
    
    return {
      success: true,
      sourceId,
      rowsProcessed
    };
  } catch (err) {
    console.error('Error in ingestCsvData:', err);
    return {
      success: false,
      rowsProcessed: 0,
      errors: [String(err)]
    };
  }
};
