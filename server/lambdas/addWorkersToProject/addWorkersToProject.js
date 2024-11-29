const { pool } = require('./db');

// Query to add user to project
const addWorkerToProjectQuery = `
  INSERT INTO public.project_worker (
    project_id, 
    worker_id
  )
  VALUES ($1, $2)
  ON CONFLICT (project_id, worker_id) 
  DO NOTHING
  RETURNING true;
`;

/**
 * Adds a user to an project.
 * @param {string} projectId - The ID of the project
 * @param {string} workerId - The ID of the worker
 * @returns {Promise<object>} - The newly created membership record
 */
async function addWorkerToProject(projectId, workerId) {
  const insertResult = await pool.query(addWorkerToProjectQuery, [
    projectId,
    workerId,
  ]);
  return insertResult.rows[0];
}


/**
 * Exported lambda function handler for inviting user(s) to project.
 * Checks if user with a matching email exists in DB, if they're already part of the project, and adds them to it if not
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
      alreadyInProject: []
    };

    for (const worker of workers) {
      const addedNewWorker = await addWorkerToProject(
        projectId,
        worker.worker_id,
      );

      if (addedNewWorker) {
        results.successful.push({
          ...worker
        });
      } else {
        results.alreadyInProject.push({
          ...worker
        })
      }
    }

    await pool.query('COMMIT');
    console.log(`Results: ${results}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Invitation processing completed',
        results: {
          totalProcessed: workers.length,
          successfulInvites: results.successful.length,
          alreadyInProject: results.alreadyInProject.length,
          results: results
        }
      })
    };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers: genericHeaders,
      body: JSON.stringify({
        message: 'Error processing invitations',
        error: error.message
      })
    };
  }
};

