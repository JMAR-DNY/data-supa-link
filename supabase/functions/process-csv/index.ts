
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface ProcessCSVRequest {
  fileName: string;
  data: any[];
  mappings: Record<string, string>;
  teamId: number;
  profileId?: number;
  listId?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { fileName, data, mappings, teamId, profileId, listId }: ProcessCSVRequest = await req.json()

    // Create source record
    const { data: sourceData, error: sourceError } = await supabase
      .from('sources')
      .insert({
        file_name: fileName,
        record_count: data.length,
        source_type_id: 1, // CSV data
        status_id: 1, // Raw record
        team_id: teamId,
        created_by_profile_id: profileId
      })
      .select()
      .single()

    if (sourceError) throw sourceError

    // Insert raw data in batches
    const batchSize = 100
    const sourceId = sourceData.id

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      const batchData = batch.map(row => ({
        source_id: sourceId,
        raw_data: row,
        processed: false,
        list_id: listId
      }))

      const { error: insertError } = await supabase
        .from('source_data')
        .insert(batchData)

      if (insertError) throw insertError
    }

    // Process the data with mappings
    const { data: processResult, error: processError } = await supabase
      .rpc('process_csv_mapping', {
        source_id: sourceId,
        mapping_json: mappings,
        profile_id: profileId,
        list_id: listId
      })

    if (processError) throw processError

    return new Response(
      JSON.stringify({ success: true, sourceId, rowsProcessed: data.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing CSV:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
