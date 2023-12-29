import React, { useEffect } from 'react';
import TreeVisualization from './components/TreeVisualization';
import store from './store';
import { Provider } from 'react-redux';
import Banner from './components/Steps';
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function App() {

  const [viewTree, setViewTree ] = React.useState(false);

  useEffect(() => {
      store.subscribe(() => {
          store.getState().viewTree === false ? setViewTree(false) : setViewTree(true)
      })
  }, [viewTree])

  return (
      <Provider store={store}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h5" color="inherit" component="div">
              B-tree Visualization
            </Typography>
          </Toolbar>
        </AppBar>  
        {viewTree === false ? <Banner></Banner> : <TreeVisualization></TreeVisualization>}
      </Provider>
  )
}
