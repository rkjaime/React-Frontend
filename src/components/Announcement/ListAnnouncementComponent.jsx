import React, { Component } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import "bootstrap/dist/css/bootstrap.min.css";
import Card from '../card/card';
import AnnouncementService from "../../services/AnnouncementService";
import { Alert, AlertTitle } from '@material-ui/lab';
import Pagination from '../form/Pagination';
import swal from "sweetalert";

class ListAnnouncementComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            announcements: [],
            message: null,
            currentOffset: 0,
            pageCounter: 1,            
        }
        this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
        this.editAnnouncement = this.editAnnouncement.bind(this);
        this.addAnnouncement = this.addAnnouncement.bind(this);
        this.reloadAnnouncementList = this.reloadAnnouncementList.bind(this);
        this.aggregatedCard = React.createRef();
        this.activeCard = React.createRef(); 
        this.recoveredCard = React.createRef();       
    }

    componentDidMount() {
        this.reloadAnnouncementList();
    }
    
    fetchData = (offset = 0) => {
        let params = {
          offset: offset,
          limit: 20
        }
    }
    
    increment= () => {
        const { currentOffset, pageCounter } = this.state;
        this.setState({
          currentOffset: currentOffset + 1,
          pageCounter: pageCounter + 1,
        });
    }
    
    decrement= () => {
        const { currentOffset, pageCounter } = this.state;
        this.setState({
          currentOffset: currentOffset - 1,
          pageCounter: pageCounter - 1,
        });
    }
    
    componentDidUpdate(prevState) {
        if (this.state.currentOffset !== prevState.currentOffset) {
          if (this.state.currentOffset < 0 ) {
            this.setState({
              currentOffset: 0,
              pageCounter: 1,
            });
            this.fetchData(prevState.this.state.currentOffset);
          }
          this.fetchData(this.state.currentOffset);
        }
    }

    getSummaryStatusOpen(arrayStatus){
        var summary = 0;
        for (var count in arrayStatus){
            if (arrayStatus[count].status === 'OPEN') {
                summary = summary + 1;
            }
        }
        return summary;
    }

    getSummaryStatusClosed(arrayStatus){
        var summary = 0;
        for (var count in arrayStatus){
            if (arrayStatus[count].status === 'CLOSED') {
                summary = summary + 1;
            }
        }
        return summary;
    }   

    reloadAnnouncementList() {
        AnnouncementService.fetchAnnouncements()
        .then((response) => {
            this.setState({
              announcements: response.data,
            });
            this.aggregatedCard.current.changeValue(this.state.announcements.length);
            this.activeCard.current.changeValue(this.getSummaryStatusOpen(this.state.announcements)); 
            this.recoveredCard.current.changeValue(this.getSummaryStatusClosed(this.state.announcements));               
          })
          .catch((e) => {
            console.log(e);
          });
    }

    deleteAnnouncement(announcementId) {
        AnnouncementService.deleteAnnouncement(announcementId)
           .then(res => {
                swal({
                    title: "Se elimino anuncio con exito!",
                    text: res.data.message,
                    icon: "success",
                });
            this.setState({announcements: this.state.announcements.filter(announcement => announcement.id !== announcementId)});
            this.reloadAnnouncementList()
           })
    }

    editAnnouncement(id) {
        window.localStorage.setItem("announcementId", id);
        this.props.history.push('/edit-announcement');
    }

    addAnnouncement() {
        window.localStorage.removeItem("announcementId");
        this.props.history.push('/add-announcement');
    }
    
    render() {       
        return (
        <div>
        {this.state.announcements.length > 0 ?       
            <Alert severity="success">
                <AlertTitle>Exitoso</AlertTitle>
                Se ha cargado los registros correctamente
             </Alert> :
            <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
                'No existen registros asociados/No se ha cargado la base de datos'                    
            </Alert>         
        }                 
        {/* Cards */}
        <div className="row col-12 mx-auto">
          <Card 
          ref={this.aggregatedCard}
          title="Convocatorias agregadas" 
          value={0}
          color='#F9345E'/>
          <Card 
          ref={this.activeCard}
          title="Convocatorias abiertas" 
          value={0}
          color='#FA6400'/>
          <Card 
          ref={this.recoveredCard}
          title="Convocatorias finalizadas" 
          value={0}
          color='#1CB142'/>
          <Card 
          ref={this.deathsCard}
          title="Ultima convocatoria" 
          value={0}
          color='#6236FF'/>
        </div>
        <Pagination 
         increment={this.increment} 
         decrement={this.decrement} 
         page={this.state.pageCounter} 
       />                    
        <Typography variant="h4" style={style}>Detalles de convocatoria</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre de convocatoria</TableCell>
                            <TableCell align="right">Lenguaje de convocatoria</TableCell>
                            <TableCell align="right">Salario</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">necesita ingles?</TableCell>
                            <TableCell align="right">candidatos disponibles</TableCell>
                            <TableCell align="right">editar</TableCell>
                            <TableCell align="right">Eliminar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.announcements.map(row => (
                            <TableRow key={row.id}>
                                <TableCell align="left">{row.announcementName}</TableCell>
                                <TableCell align="right">{row.job}</TableCell>
                                <TableCell align="right">{row.salary}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                                <TableCell align="right">{row.english}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right" onClick={() => this.editAnnouncement(row.id)}><CreateIcon /></TableCell>
                                <TableCell align="right" onClick={() => this.deleteAnnouncement(row.id)}><DeleteIcon /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>     
        );
    }
}

const style ={
    display: 'flex',
    justifyContent: 'center'
}

export default ListAnnouncementComponent;