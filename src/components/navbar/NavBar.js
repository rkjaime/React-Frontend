import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const style = {
    flexGrow: 1
}
const NavBar = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={style} href="#">
                        PNC 2.0
                    </Typography>
                    <Button color="inherit" href="/add">Añadir Convocatoria</Button>
                    <Button color="inherit" href="/announcements">Lista Convocatoria</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar;
