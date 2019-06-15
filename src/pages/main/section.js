import React from 'react';
import './section.css'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

function Section() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" className="container">
        <Typography component="div" className="section" style={{ backgroundColor: '#cfe8fc', height: '15vh' }} />
      </Container>
    </React.Fragment>
  );
}

export default Section;