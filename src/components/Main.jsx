import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ScheduleTable from './ScheduleTable';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

const Main = (props) => {
  const ScheduleTableWithStyle = withStyles(styles)(ScheduleTable)
  return (
    <ScheduleTableWithStyle />
  )
};

export default Main;