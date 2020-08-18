const apiResponse = require('../helpers/apiResponse');
// const { authenticateRequest } = require('../middlewares/jwt-cookie');
const { getRuns } = require('../services/services');
const Cache = require('../helpers/cache');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new Cache(ttl); // Create a new cache service instance
const { logger } = require('../helpers/winston');

const columns = [
  { columnHeader: 'Run ID', data: 'runId', editor: false },
  { columnHeader: 'Request ID', data: 'requestId', editor: false },
  { columnHeader: 'Sample ID', data: 'sampleId', editor: false },
  { columnHeader: 'Barcode ID', data: 'barcodeId', editor: false },
  { columnHeader: 'Barcode Seq', data: 'barcodeSeq', editor: false },
  { columnHeader: 'Status', data: 'status', editor: false },
  { columnHeader: 'Requ. Reads', data: 'numberRequestedReads', editor: false },
  { columnHeader: 'Species', data: 'species', editor: false },
  { columnHeader: 'Lab Head', data: 'labHead', editor: false },
  { columnHeader: 'Investigator', data: 'investigator', editor: false },
  { columnHeader: 'Recipe', data: 'recipe', editor: false },
  { columnHeader: 'Start Date', data: 'startDate', editor: false },
  { columnHeader: 'Lanes', data: 'lanes', editor: false },
  { columnHeader: 'FastQ Only', data: 'fastqOnly', editor: false },
  { columnHeader: 'Run Type', data: 'runType', editor: false },
  { columnHeader: '#Requested Samples', data: 'numberRequestSamples', editor: false },
];
/**
 * Returns runs
 *
 * @type {*[]}
 */
exports.getRuns = [
  // authenticateRequest,
  function (req, res) {
    console.log(req.query);

    logger.log('info', 'Retrieving Runs');
    let type = req.query.type;
    let query = req.query.query;

    getRuns(type, query)
      .then((result) => {
        console.log(result);

        let grid = generateGrid(result.data);
        return apiResponse.successResponseWithData(res, 'success', {
          rows: grid,
          columns: columns,
        });
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err.message);
      });
  },
];

/**
 * Returns empty table
 *
 * @type {*[]}
 */
exports.getTable = [
  // authenticateRequest,
  function (req, res) {
    logger.log('info', 'Retrieving table');

    return apiResponse.successResponseWithData(res, 'success', {
      rows: [[]],
      columns: columns,
    });
  },
];

// UTIL
generateGrid = (data) => {
  data.forEach((element) => {
    try {
      element.altConcentration = element.altConcentration.toFixed(2);
      element.concentration = concentration.toFixed(3);
    } catch (error) {
      return;
    }
  });
  return data;
};
