import React, { useState, useEffect } from 'react';
import { getRuns, getTable } from './services/services';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button, ButtonGroup } from '@material-ui/core';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100vw',
    margin: '0 auto',
    overflow: 'auto',
  },
  toolbar: {
    margin: theme.spacing(2),
    display: 'flex',
    gap: '2em',
  },
}));
function HomePage() {
  const classes = useStyles();
  const hotTableComponent = React.createRef();
  const [runs, setRuns] = useState({
    runs: [],
  });
  const [filteredRuns, setFilteredRuns] = useState({
    filteredRuns: [],
  });
  const [columns, setColumns] = useState({
    columns: [],
  });
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sorting, setSorting] = React.useState(false);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    let searchTerm = event.target.value;
    if (searchTerm == '') return setFilteredRuns(runs);

    var searchResults = [];
    searchResults = runs.filter((el) => {
      return Object.values(el).join().toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (searchResults.length == 0) {
      setSorting(false);
      setFilteredRuns([[]]);
    } else {
      setFilteredRuns(searchResults);
    }
  };

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleExport = () => {
    exportExcel(filteredRuns, columns);
  };
  async function handleGetRuns() {
    setIsLoading(true);
    getRuns(query, 'run').then((result) => {
      setSorting(false);
      setRuns(result.rows);
      setFilteredRuns(result.rows);
      setColumns(result.columns);
      setIsLoading(false);
    });
  }

  async function handleGetProject() {
    setIsLoading(true);
    getRuns(query, 'project').then((result) => {
      setRuns(result.rows);
      setFilteredRuns(result.rows);
      setColumns(result.columns);
      setIsLoading(false);
    });
  }

  async function handleGetTable() {
    setIsLoading(true);
    getTable().then((result) => {
      setRuns(result.rows);
      setFilteredRuns(result.rows);
      setColumns(result.columns);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    handleGetTable();
  }, []);

  return (
    <div className={classes.container}>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <div className={classes.toolbar}>
          <TextField id='searchRun' label='ID to search for' variant='outlined' value={query} onChange={handleQuery} />
          <ButtonGroup variant='contained' color='primary' aria-label='contained primary button group'>
            <Button id='getLog' onClick={handleGetRuns} color='primary' variant='contained' type='submit'>
              Search Run
            </Button>
            <Button id='getLog' onClick={handleGetProject} color='primary' variant='contained' type='submit'>
              Search Project
            </Button>
          </ButtonGroup>
          <Button id='gridExport' onClick={handleExport} color='secondary' variant='contained' type='submit'>
            Export Excel
          </Button>
          <TextField id='search' label='Filter Table' variant='outlined' value={searchTerm} onChange={handleChange} />
        </div>
        <HotTable
          ref={hotTableComponent}
          data={filteredRuns}
          search='true'
          colHeaders={columns ? Object.keys(columns).map((el) => columns[el].columnHeader) : ''}
          columns={columns}
          filters='true'
          columnSorting={sorting}
          manualColumnResize={true}
          licenseKey='non-commercial-and-evaluation'
          rowHeaders={true}
          stretchH='all'
        />
      </LoadingOverlay>
    </div>
  );
}

export default HomePage;
