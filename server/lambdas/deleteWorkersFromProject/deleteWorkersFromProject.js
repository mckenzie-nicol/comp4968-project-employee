const { pool } = require('./db');

// Query to add user to project
const deleteWorkerFromProjectQuery = `
WITH deleted AS (
    DELETE FROM public.project_worker
    WHERE project_id = $1 AND worker_id = $2
    RETURNING 1
    )
SELECT 1 FROM deleted;
`;

/**
 * Deletes a user from a project.
 * @param {string} projectId - The ID of the project
 * @param {string} workerId - The ID of the worker
 * @returns {Promise<object>} - The newly created membership record
 */
async function deleteWorkerFromProject(projectId, workerId) {
  const insertResult = await pool.query(deleteWorkerFromProjectQuery, [
    projectId,
    workerId,
  ]);
  return insertResult.rows[0].result;
}


/**
 * Exported lambda function handler for removing worker(s) from project.
 * @param {*} event - The Lambda event object
 * @returns {object} - The HTTP response
 */
exports.handler = async (event) => {
  console.log("Event Received: ", event);
  const { projectId } = event.pathParameters;
  const workers = event.body.workerIds;
  console.log('workers: ', workers);

  try {
    await pool.query('BEGIN');

    const results = {
      successful: [],
      notFound: []
    };

    for (const worker of workers) {
      const deleteResult = await addWorkerToProject(
        projectId,
        worker.worker_id,
      );

      if (deleteResult) {
        results.successful.push({
          ...worker
        });
      } else {
        results.notFound.push({
          ...worker
        })
      }
    }

    await pool.query('COMMIT');
    console.log(`Results: ${results}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Delete request completed.',
        results: {
          totalProcessed: workers.length,
          successfulDeletes: results.successful.length,
          notFound: results.notFound.length,
          results: results
        }
      })
    };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing deletion',
        error: error.message
      })
    };
  }
};

