import {useContext, useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import logo from '../../assets/img/logo.png';
import "./Header.css";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import {BoxArrowRight, GearFill, GeoAlt, Tag, TextareaT} from "react-bootstrap-icons";
import {Col, NavDropdown, Row} from "react-bootstrap";
import {AuthContext} from "../../context/AuthContext.jsx";
import {SearchContext} from "../../context/SearchContext.jsx";


export default function Header() {

  const {setEventName, categories, setCategory, locals, setLocalId} = useContext(SearchContext);
  const {userLogged, logoutUser, isAdmin, userInfo} = useContext(AuthContext);

  const navigate = useNavigate();

  const [roleIsVisitor, setRoleIsVisitor] = useState(false);
  const [fieldValue, setFieldValue] = useState({
    nome: "",
    categoria_id: "",
    local_id: ""
  });

  useEffect(() => {
    setEventName(fieldValue.nome);
    setCategory(fieldValue.categoria_id);
    setLocalId(fieldValue.local_id);
  }, [fieldValue])

  useEffect(()=> {
      //  Optional Chaining ('?.') -> antes de setar o valor verifica se ele foi definido, evitando erros
      const roleN = userInfo?.role?.nome?.toLowerCase();

      if(roleN === 'visitante' || roleN === 'público') {
        setRoleIsVisitor(true);
      } else setRoleIsVisitor(false)
  }, [userInfo])


  const handleRegister = () => {
    navigate("/register");
  };

  const handleChange = (event) => {
    setFieldValue({
      ...fieldValue,
      [event.target.name]: event.target.value
    });

    navigate("/");  // Navega para a página inicial ao selecionar uma categoria ou local
  };


  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <div className="p-2">
            <Image height="50" src={logo}/>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll"/>
        <Navbar.Collapse id="navbarScroll">

          {userLogged ? (
            <>
              <Form>
                <Row className="m-auto">
                <Col md={5} xs={12} className="">
                    <label className="labelSearch">
                      <TextareaT className="icon-search"/>
                      <Form.Control name="nome" value={fieldValue.nome} onChange={handleChange} placeholder="Buscar por nome" />
                    </label>
                  </Col>

                  <Col md={3} xs={12} className="">
                    <label className="labelSearch">
                      <Tag className="icon-search"/>
                      <Form.Select name="categoria_id"
                            id="categoria"
                            value={fieldValue.categoria_id}
                            onChange={handleChange}
                            aria-label="Categorias"
                    >
                      <option value="">Todas</option>
                      {categories.map(category => (
                        <option value={category.id} key={category.id}>{category.nome}</option>
                      ))}
                    </Form.Select>
                    </label>
                  </Col>

                  <Col md={4} xs={12}>
                    <label className="labelSearch">
                      <GeoAlt className="icon-search"/>
                      <Form.Select
                        name="local_id"
                        id="local"
                        value={fieldValue.local_id}
                        onChange={handleChange}
                        aria-label="Local"
                      >

                        <option value="">Qualquer lugar</option>
                        {locals.map(local => (
                          <option value={local.id} key={local.id}>{local.nome}</option>
                        ))}

                      </Form.Select>

                    </label>
                  </Col>
                </Row>
              </Form>

              <Row className="p-2 ms-auto">

              {roleIsVisitor ?
                <Col md={6} xs={10}></Col>
                :
                <Col md={6} xs={10}>
                  <div className="">
                    <Nav className="me-auto">
                      <NavDropdown title="Menu">
                        <NavDropdown.Item as={Link} to="/app/create/event" className={''}>Crie seu Evento</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to="/app/my-events">Meus Eventos</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to="/app/locations">Locais</NavDropdown.Item>

                        {isAdmin && (
                          <>
                          <NavDropdown.Divider/>
                          <NavDropdown.Item as={Link} to="/app/categories" >Categorias</NavDropdown.Item>
                          <NavDropdown.Divider/>
                          <NavDropdown.Item as={Link} to="/app/roles">Cargos</NavDropdown.Item>
                          </>
                        )}

                      </NavDropdown>
                    </Nav>
                  </div>
                </Col>

                  }

                <Col md={6} xs={2} className="">
                  <div className="d-flex justify-content-end align-content-center buttons">
                    <Button as={Link}
                            to="/app/settings"
                            className={' ms-auto text-black'}
                            variant='warning'>
                      <GearFill/>
                    </Button>
                    <Button
                      className={'ms-2'}
                      variant="secondary"
                      onClick={() => logoutUser()}>
                      <BoxArrowRight/>
                    </Button>
                  </div>
                </Col>
              </Row>

            </>
          ) : (

            <>
              <Form>
                <Row className="m-auto">
                  <Col md={5} xs={12} className="">
                    <label className="labelSearch">
                      <TextareaT className="icon-search"/>
                      <Form.Control name="nome" value={fieldValue.nome} onChange={handleChange} placeholder="Buscar por nome" />
                    </label>
                  </Col>

                  <Col md={3} xs={12} className="">
                    <label className="labelSearch">
                      <Tag className="icon-search"/>
                      <Form.Select name="categoria_id"
                          id="categoria"
                          value={fieldValue.categoria_id}
                          onChange={handleChange}
                          aria-label="Categorias"
                    >
                      <option value="">Todas</option>
                      {categories.map(category => (
                        <option value={category.id} key={category.id}>{category.nome}</option>
                      ))}
                    </Form.Select>
                    </label>
                  </Col>

                  <Col md={4} xs={12}>
                    <label className="labelSearch">
                      <GeoAlt className="icon-search"/>
                      <Form.Select
                        name="local_id"
                        id="local"
                        value={fieldValue.local_id}
                        onChange={handleChange}
                        aria-label="Local"
                      >

                        <option value="">Qualquer lugar</option>
                        {locals.map(local => (
                          <option value={local.id} key={local.id}>{local.nome}</option>
                        ))}

                      </Form.Select>
                    </label>
                  </Col>
                </Row>
              </Form>


              <Row className="col-ms-6 ms-auto">
                <Col>
                  <div className="p-2 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between w-100">
                    <Nav className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                      {/* <Nav.Link as={Link} to="/app/create/event" className="mb-2 mb-md-0 me-md-2 text-center text-md-start">Crie seu Evento</Nav.Link> */}
                      <Nav.Link as={Link} to="/login" className="mb-2 mb-md-0 me-md-2 text-center text-md-start">Login</Nav.Link>
                    </Nav>
                    <Button variant="outline-primary" onClick={handleRegister} className="mb-2 mb-md-0 ms-md-auto">Cadastre-se</Button>
                  </div>
                </Col>
              </Row>

            </>

          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}