import { useCallback, useEffect, useState } from "react"
import { createLocal, findAllLocals, updateLocal, deleteLocal, findLocalCep } from "../../../services/localService.jsx"

import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import { PencilSquare, Trash, Funnel, Search, Building, GeoAlt, Flag, Globe, Signpost, InfoCircle } from "react-bootstrap-icons"
import { Col, Row, Container } from "react-bootstrap"
import Paginationn from "../../../components/pagination/Paginationn.jsx"

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

const estadosBrasil = {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins",
}

export default function Locations() {
    // Estado para armazenar a lista de locais e informações do local atual
    const [locations, setLocations] = useState([]) // Lista de locais
    const [localId, setLocalId] = useState(null) // ID do local atual

    // Estado para armazenar os dados do formulário de criação/edição de local
    const [nome, setLocalName] = useState("") // Nome do local
    const [endereco, setAddress] = useState("") // Endereço do local
    const [cidade, setCity] = useState("") // Cidade do local
    const [estado, setState] = useState("") // Estado do local
    const [pais, setCountry] = useState("") // País do local

    // Estado para armazenar os critérios de pesquisa
    const [searchCep, setSearchCep] = useState("") // Pesquisa por Cep
    const [searchNome, setSearchName] = useState("") // Pesquisa por nome
    const [searchEndereco, setSearchAddress] = useState("") // Pesquisa por endereço
    const [searchCidade, setSearchCity] = useState("") // Pesquisa por cidade
    const [searchEstado, setSearchState] = useState("") // Pesquisa por estado
    const [searchPais, setSearchCountry] = useState("") // Pesquisa por país

    // Estado para controlar a visibilidade dos modais e mensagens
    const [showCreate, setShowCreate] = useState(false) // Modal de criação
    const [showEdit, setShowEdit] = useState(false) // Modal de edição
    const [showMessage, setShowMessage] = useState({ show: false, message: "" }) // Modal de mensagem
    const [showMessageDelete, setShowMessageDelete] = useState(false) // Modal de confirmação de exclusão
    const [idToDelete, setIdToDelete] = useState(null) // ID do local a ser excluído

    // Estado para armazenar a lista filtrada de locais e controlar a pesquisa avançada
    const [filteredLocations, setFilteredLocations] = useState([]) // Lista de locais filtrados
    const [selectedLocationId, setSelectedLocationId] = useState(null) // ID do local selecionado para exibição de detalhes
    const [advancedSearch, setAdvancedSearch] = useState(false) // Controle da pesquisa avançada

    // Estado para controlar o alerta de erro e o carregamento dos dados
    const [showAlert, setShowAlert] = useState(false) // Alerta de erro
    const [loading, setLoading] = useState(true) // Indicador de carregamento

    const [errorCep, setErrorCep] = useState(false) // Se houver um erro no CEP

    // Estado para os itens da página atual
    const [currentItems, setCurrentItems] = useState([])

    const closeAlert = () => setShowAlert(false) // Fecha o alerta de erro do formulário.

    // Controla a visibilidade do modal de criação.
    const handleCloseCreate = () => {
        setShowCreate(false)
        closeAlert()
    }
    const handleShowCreate = () => {
        setShowCreate(true)
        setShowEdit(false)
        setLocalId(null) // Limpar o ID do local
        clearForm()
    }

    // Controla a visibilidade do modal de edição.
    const handleCloseEdit = () => setShowEdit(false)
    const handleShowEdit = (local) => {
        clearForm()
        setShowCreate(false)
        setShowEdit(true)
        setLocalId(local.id) // Definir o ID do local
        setLocalName(local.nome)
        setAddress(local.endereco)
        setCity(local.cidade)
        setState(local.estado)
        setCountry(local.pais)
    }

    // Controla a visibilidade do modal de mensagem.
    const handleCloseMessage = () => setShowMessage({ show: false, message: "" })
    const handleShowMessage = (message) => setShowMessage({ show: true, message: message })

    // Controla a visibilidade do modal de confirmação de exclusão.
    const handleCloseMessageDelete = () => setShowMessageDelete(false)
    const handleShowMessageDelete = (id) => {
        setIdToDelete(id) // Define o ID do local a ser excluído
        setShowMessageDelete(true) // Abre o modal de confirmação
    }

    // Carrega todos os locais da API quando o componente é montado.
    useEffect(() => {
        getAllLocations()
    }, [])

    // Filtra a lista de locais conforme os critérios de pesquisa são atualizados.
    useEffect(() => {
        const filtered = locations.filter((local) => {
            const searchNomeStr = removeAccents(searchNome.toLowerCase())
            const searchEnderecoStr = removeAccents(searchEndereco.toLowerCase())
            const searchCidadeStr = removeAccents(searchCidade.toLowerCase())
            const searchEstadoStr = removeAccents(searchEstado.toLowerCase())
            const searchPaisStr = removeAccents(searchPais.toLowerCase())

            const matchNome = searchNomeStr === "" || removeAccents(local.nome.toLowerCase()).includes(searchNomeStr)
            const matchEndereco = searchEnderecoStr === "" || removeAccents(local.endereco.toLowerCase()).includes(searchEnderecoStr)
            const matchCidade = searchCidadeStr === "" || removeAccents(local.cidade.toLowerCase()).includes(searchCidadeStr)
            const matchEstado = searchEstadoStr === "" || removeAccents(local.estado.toLowerCase()).includes(searchEstadoStr)
            const matchPais = searchPaisStr === "" || removeAccents(local.pais.toLowerCase()).includes(searchPaisStr)

            return matchNome && matchEndereco && matchCidade && matchEstado && matchPais
        })
        setFilteredLocations(filtered)
    }, [locations, searchNome, searchEndereco, searchCidade, searchEstado, searchPais])

    // Recupera todos os locais do serviço de API e atualiza o estado locations.
    async function getAllLocations() {
        try {
            const response = await findAllLocals()
            setLocations(response)
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function getLocalCep(cep) {
        // Limpa o CEP, mantendo apenas números e hífens
        const sanitizedCep = cep.replace(/[^0-9-]/g, "")

        // Verifica se o CEP tem um formato válido
        const isValidCep = sanitizedCep.length === 8 || (sanitizedCep.length === 9 && sanitizedCep.includes("-"))

        if (!isValidCep) {
            setErrorCep(true)
            return
        }

        try {
            // Chama a função para encontrar o endereço a partir do CEP
            const response = await findLocalCep(sanitizedCep)

            // Atualiza o estado com as informações recebidas
            setErrorCep(false)
            setAddress(response.logradouro || "")
            setCity(response.localidade || "")
            setState(estadosBrasil[response.uf] || "")
            setCountry("Brasil")
        } catch (error) {
            // Se houver um erro, define o estado de erro do CEP
            setErrorCep(true)
        }
    }

    // Cria um novo local com os dados fornecidos no formulário.
    async function handleCreateLocal() {
        if (nome && endereco && cidade && estado && pais) {
            try {
                await createLocal({ nome, endereco, estado, cidade, pais })
                await getAllLocations()
                handleCloseCreate()
            } catch (error) {
                console.error(error.message)
            }
        } else {
            setShowAlert(true)
        }
    }

    // Atualiza um local existente com os dados do formulário de edição.
    async function handleUpdateLocal(id) {
        if (nome && endereco && cidade && estado && pais) {
            try {
                await updateLocal(id, { nome, endereco, estado, cidade, pais })
                await getAllLocations()
                handleCloseEdit()
            } catch (error) {
                handleShowMessage("Erro ao atualizar o local.")
                console.error(error.message)
            }
        } else {
            setShowAlert(true)
        }
    }

    // Exclui um local especificado pelo ID.
    async function handleDeleteLocal(id) {
        try {
            await deleteLocal(id)
            setLocations(locations.filter((local) => local.id !== id))
        } catch (error) {
            handleShowMessage("Este local está associado a eventos e não pode ser excluído.")
            console.error(error.message)
        }
        handleCloseMessageDelete()
    }

    // Alterna a exibição dos detalhes de um local.
    const handleShowDetails = (id) => {
        setSelectedLocationId(selectedLocationId === id ? null : id)
    }

    // Limpa todos os campos de pesquisa.
    const clearAllSearch = () => {
        setSearchName("")
        clearAdvancedSearch()
    }

    // Limpa os campos de pesquisa avançada.
    const clearAdvancedSearch = () => {
        setSearchAddress("")
        setSearchCity("")
        setSearchState("")
        setSearchCountry("")
    }

    // Limpa o formulário de criação/edição de locais.
    const clearForm = () => {
        setErrorCep(false)
        setSearchCep("")
        setLocalName("")
        setAddress("")
        setCity("")
        setState("")
        setCountry("")
    }

    // Alterna a exibição da pesquisa avançada.
    const toggleAdvancedSearch = () => {
        setAdvancedSearch(!advancedSearch)
        if (advancedSearch) clearAdvancedSearch()
    }

    // Função de callback para lidar com a mudança de página
    const handlePageChange = useCallback((pageItems) => {
        setCurrentItems(pageItems)
    }, [])

    return (
        <Container>
            <h1 className={"titulo"}>Lista de Locais</h1>

            <Form>
                <Row>
                    <Form.Group className='d-flex mb-3'>
                        <Form.Control type='text' placeholder='Pesquisar por Nome' value={searchNome} onChange={(e) => setSearchName(e.target.value)} />
                        <Button className='btn btn-primary ms-2 d-flex justify-content-center align-items-center gap-1 ' onClick={toggleAdvancedSearch}>
                            <Funnel />
                        </Button>
                        <Button className='btn btn-danger ms-2 d-flex justify-content-center align-items-center gap-1 ' onClick={clearAllSearch}>
                            <Trash />
                        </Button>
                    </Form.Group>
                </Row>

                {advancedSearch && (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Control type='text' placeholder='Pesquisar por Endereço' value={searchEndereco} onChange={(e) => setSearchAddress(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Control type='text' placeholder='Pesquisar por Cidade' value={searchCidade} onChange={(e) => setSearchCity(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Control type='text' placeholder='Pesquisar por Estado' value={searchEstado} onChange={(e) => setSearchState(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Control type='text' placeholder='Pesquisar por País' value={searchPais} onChange={(e) => setSearchCountry(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>

            <Button className='btn btn-success btn-sm mb-3' onClick={() => handleShowCreate()}>
                Criar
            </Button>

            {/*Listagem de locais*/}
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <ListGroup>
                    {currentItems.map((local) => (
                        <ListGroup.Item key={local.id} className='d-flex flex-column align-items-start'>
                            <div className='w-100'>
                                <Row className='align-items-center'>
                                    <Col xs={12} sm={7} md={7} className='mb-2 mb-md-0'>
                                        <p className='mb-0 text-capitalize'>{selectedLocationId === local.id ? <strong>{local.nome}</strong> : local.nome}</p>
                                    </Col>
                                    <Col xs={12} sm={5} md={5} className='mb-2 mb-sm-0 d-flex justify-content-end'>
                                        <Button className='me-2 btn btn-warning' onClick={() => handleShowDetails(local.id)}>
                                            <InfoCircle />
                                        </Button>
                                        <Button className='me-2 btn bi-pencil-fill' onClick={() => handleShowEdit(local)}>
                                            <PencilSquare />
                                        </Button>
                                        <Button className='btn btn btn-danger' onClick={() => handleShowMessageDelete(local.id)}>
                                            <Trash />
                                        </Button>
                                    </Col>
                                </Row>
                            </div>

                            {selectedLocationId === local.id && (
                                <div className='w-100'>
                                    <hr className='mt-2 mb-2' />
                                    <p className='mb-1 d-flex align-items-center'>
                                        <Signpost className='me-2' /> Endereço: {local.endereco}
                                    </p>
                                    <p className='mb-1 d-flex align-items-center'>
                                        <GeoAlt className='me-2' /> Cidade: {local.cidade}
                                    </p>
                                    <p className='mb-1 d-flex align-items-center'>
                                        <Flag className='me-2' /> Estado: {local.estado}
                                    </p>
                                    <p className='mb-1 d-flex align-items-center'>
                                        <Globe className='me-2' /> País: {local.pais}
                                    </p>
                                </div>
                            )}
                        </ListGroup.Item>
                    ))}

                    <Paginationn items={filteredLocations} onPageChange={handlePageChange} />
                </ListGroup>
            )}

            {/*Modal Criar e Editar local*/}
            <Modal
                show={showCreate || showEdit}
                onHide={() => {
                    handleCloseCreate()
                    handleCloseEdit()
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {showCreate && "Criar Local"} 
                        {showEdit && "Editar Local"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className='mb-3'>
                        <Form.Label>Pesquisar Cep</Form.Label>
                        <div className='d-flex align-items-start'>
                            <div className='flex-grow-1 me-2'>
                                <Form.Control
                                    type='text'
                                    className={errorCep ? "is-invalid" : ""}
                                    value={searchCep}
                                    onChange={(e) => setSearchCep(e.target.value)}
                                    placeholder='CEP do Local'
                                    maxLength={9}
                                    required
                                />
                                {errorCep && <div className='invalid-feedback'>CEP incorreto. Por favor, insira um CEP válido no formato 00000-000.</div>}
                            </div>
                            <Button variant='success' className='btn' onClick={() => getLocalCep(searchCep)}>
                                <Search />
                            </Button>
                        </div>
                    </Form.Group>
                    <hr className='mt-1 mb-2' />
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <Building className='me-2' />
                            Nome
                        </Form.Label>
                        <Form.Control type='text' value={nome} onChange={(e) => setLocalName(e.target.value)} placeholder='Nome do Local' required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <Signpost className='me-2' />
                            Endereço
                        </Form.Label>
                        <Form.Control type='text' value={endereco} onChange={(e) => setAddress(e.target.value)} placeholder='Endereço do Local' required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <GeoAlt className='me-2' />
                            Cidade
                        </Form.Label>
                        <Form.Control type='text' value={cidade} onChange={(e) => setCity(e.target.value)} placeholder='Cidade do Local' required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <Flag className='me-2' />
                            Estado
                        </Form.Label>
                        <Form.Control type='text' value={estado} onChange={(e) => setState(e.target.value)} placeholder='Estado do Local' required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <Globe className='me-2' />
                            País
                        </Form.Label>
                        <Form.Control type='text' value={pais} onChange={(e) => setCountry(e.target.value)} placeholder='País do Local' required />
                    </Form.Group>
                    <Alert show={showAlert} variant='danger' onClose={closeAlert} dismissible>
                        É necessário preencher todos os campos do cadastro!
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='secondary'
                        className='btn-sm'
                        onClick={() => {
                            handleCloseCreate()
                            handleCloseEdit()
                        }}
                    >
                        Fechar
                    </Button>
                    {showCreate && (
                        <Button variant='success' className='btn-sm' onClick={handleCreateLocal}>
                            Criar
                        </Button>
                    )}
                    {showEdit && (
                        <Button variant='primary' className='btn-sm' onClick={() => handleUpdateLocal(localId)}>
                            Salvar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/*Modal de erro no local*/}
            <Modal show={showMessage.show} onHide={handleCloseMessage}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showMessage.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' className='btn-sm' onClick={handleCloseMessage}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Modal de confirmação de exclusão*/}
            <Modal show={showMessageDelete} onHide={handleCloseMessageDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja excluir esse local? </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' className='btn-sm' onClick={handleCloseMessageDelete}>
                        Não
                    </Button>
                    <Button variant='success' className='btn-sm' onClick={() => handleDeleteLocal(idToDelete)}>
                        Sim
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
