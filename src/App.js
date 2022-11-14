import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import {Modal,ModalBody,ModalFooter,ModalHeader,Button} from 'reactstrap';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
   
  const baseUrl="http://localhost:8080/users";
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [data,setData]=useState([]);
  const [modalInsertar,setModalInsertar]=useState(false);
  const [modalEditar,setModalEditar]=useState(false);
  const [modalEliminar,setModalEliminar]=useState(false);
  const [usuarioSeleccionado,setUsuarioSeleccionado]=useState({
    id: '',
    name: '',
    email: '',
    password: ''
  })
  const handleChange=e=>{
    const {name,value}=e.target;
    if(name==="name"){
      setName(value);
    }else if(name==="email"){
      setEmail(value);
    }else if(name==="password"){
      setPassword(value);
    }
    if(name==="name"){
      setUsuarioSeleccionado((prevState)=>({
        ...prevState,
        name: value
      }))
      }
      else if(name==="email"){
        setUsuarioSeleccionado((prevState)=>({
          ...prevState,
          email: value
        }))
      }
      else if(name==="password"){
        setUsuarioSeleccionado((prevState)=>({
          ...prevState,
          password: value
        }))
      }
  }
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPost=async()=>{
    delete usuarioSeleccionado.id;
    usuarioSeleccionado.name=name;
    usuarioSeleccionado.email=email;
    usuarioSeleccionado.password=password;
    await axios.post(baseUrl, usuarioSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      if(response.data.status===500){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error al insertar',
        showConfirmButton: false,
        timer: 1500
      })
      }else{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario insertado',
          showConfirmButton: false,
          timer: 1500
        })
      }
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPut=async()=>{
    usuarioSeleccionado.name=name;
    usuarioSeleccionado.email=email;
    usuarioSeleccionado.password=password;
    await axios.put(baseUrl+"/"+usuarioSeleccionado.id, usuarioSeleccionado)
    .then(response=>{
      console.log(response.data);
      if(response.data.status===500){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al actualizar usuario',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario actualizado',
          showConfirmButton: false,
          timer: 1500
        })
      }
      var dataNueva=data;
      // eslint-disable-next-line array-callback-return
      dataNueva.map(usuario => {
        if(usuario.id===usuarioSeleccionado.id){
          usuario.name=usuarioSeleccionado.name;
          usuario.email=usuarioSeleccionado.email;
          usuario.password=usuarioSeleccionado.password;
        }
        console.log(usuario);
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+usuarioSeleccionado.id)
    .then(response=>{
      setData(data.filter(usuario=>usuario.id!==response.data));
      abrirCerrarModalEliminar();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: '¡No, cancela!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado.',
            'success'
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'El usuario no ha sido eliminado',
            'error'
          )
        }
      }
      )
    }).catch(error=>{
      console.log(error);
    })
  }
  const seleccionarUsuario=(usuario,caso)=>{
    setUsuarioSeleccionado(usuario);
    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }
  
  useEffect(()=>{
    peticionGet();    
  },[])

  return (
    <div className="App">
      <br />
      <Button color="success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <br /><br />
      <Table striped bordered hover>
        <thead >
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Password</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(usuario=>(
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.password}</td>
              <td>
                <Button color="primary" onClick={()=>seleccionarUsuario(usuario,"Editar")}>Editar</Button> {"   "}
                <Button color="danger" onClick={()=>seleccionarUsuario(usuario,"Eliminar")}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Usuario</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name="name" onChange={handleChange}/>
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange}/>
            <br />
            <label>Contraseña: </label>
            <br />
            <input type="text" className="form-control" name="password" onChange={handleChange}/>
            <br />
            <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>{"   "}
            <Button color="danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
            </div>  
        </ModalBody>
      </Modal>
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Usuario</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name="name" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.name}/>
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.email}/>
            <br />
            <label>Contaseña: </label>
            <br />
            <input type="text" className="form-control" name="password" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.password}/>
            <br />
            <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>{"   "}
            <Button color="danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
            </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estás seguro que deseas eliminar el usuario {usuarioSeleccionado && usuarioSeleccionado.name}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={()=>peticionDelete()}>Sí</Button>
          <Button color="secondary" onClick={()=>abrirCerrarModalEliminar()}>No</Button>
        </ModalFooter>
      </Modal>

    </div>
        );
}

export default App;
