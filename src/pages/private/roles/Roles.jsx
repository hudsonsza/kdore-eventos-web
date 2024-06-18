import { useEffect, useState } from "react"
import { findAllRoles, createRole, deleteRoleById, updateRole } from "../../../services/roleService.jsx"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import { PencilSquare, Trash } from "react-bootstrap-icons"
import { Col, Container } from "react-bootstrap"

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export default function Roles() {
    const [search, setSearch] = useState("")
    const [roles, setRoles] = useState([])
    const [filteredRoles, setFilteredRoles] = useState([])
    const [role, setRole] = useState("") // Estado para armazenar o cargo sendo editado
    const [roleId, setRoleId] = useState(null)
    const [showCreate, setShowCreate] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showMessage, setShowMessage] = useState({ show: false, message: "" })
    const [showMessageDelete, setShowMessageDelete] = useState(false)
    const [idToDelete, setIdToDelete] = useState(null) // Estado para armazenar o ID do cargo a ser excluído

    const [verifyErrorRole, setVerifyErrorRole] = useState({ class: "", message: "" })

    const clearVerifyErrorRole = () => setVerifyErrorRole({ class: "", message: "" })

    const handleCloseCreate = () => setShowCreate(false)
    const handleShowCreate = () => {
        setShowCreate(true)
        setShowEdit(false)
        setRole("") // Limpar o valor do input
        setRoleId(null) // Limpar o ID do cargo
        clearVerifyErrorRole()
    }

    const handleCloseEdit = () => setShowEdit(false)
    const handleShowEdit = (role) => {
        setShowEdit(true)
        setShowCreate(false)
        setRole(role.nome.charAt(0).toUpperCase() + role.nome.slice(1))
        setRoleId(role.id) // Definir o ID do cargo
        clearVerifyErrorRole()
    }

    const handleCloseMessage = () => setShowMessage({ show: false, message: "" })
    const handleShowMessage = (message) => setShowMessage({ show: true, message: message })

    const handleCloseMessageDelete = () => setShowMessageDelete(false)
    const handleShowMessageDelete = (id) => {
        setIdToDelete(id) // Define o ID do cargo a ser excluído
        setShowMessageDelete(true) // Abre o modal de confirmação
    }

    useEffect(() => {
        getAllRoles()
    }, [])

    useEffect(() => {
        const filtered = roles.filter((role) => removeAccents(role.nome.toLowerCase()).includes(removeAccents(search.toLowerCase())))
        setFilteredRoles(filtered)
    }, [roles, search])

    useEffect(() => {
        clearVerifyErrorRole()
    }, [role])

    async function getAllRoles() {
        try {
            const response = await findAllRoles()
            setRoles(response)
        } catch (error) {
            console.error(error.message)
        }
    }

    async function handleCreateRole(newName) {
        if (!newName.trim()) {
            setVerifyErrorRole({ class: "is-invalid", message: "O nome do cargo não pode estar vazio." })
            return
        }

        const roleExists = roles.some((role) => removeAccents(role.nome.toLowerCase()) === removeAccents(newName.toLowerCase()))

        if (roleExists) {
            setVerifyErrorRole({ class: "is-invalid", message: "Esse cargo já existe." })
            return
        }

        try {
            // Criar cargo
            await createRole({ nome: newName.toLowerCase() })
            await getAllRoles()
            handleCloseCreate()
        } catch (error) {
            console.error(error.message)
        }
    }

    async function handleUpdateRole(id, newName) {
        if (!newName.trim()) {
            setVerifyErrorRole({ class: "is-invalid", message: "O nome do cargo não pode estar vazio." })
            return
        }

        const roleSame = roles.some((role) => ((role.id === id ) && (removeAccents(role.nome.toLowerCase()) === removeAccents(newName.toLowerCase()))))

        if (!roleSame) {
            const roleExists = roles.some((role) => removeAccents(role.nome.toLowerCase()) === removeAccents(newName.toLowerCase()))
    
            if (roleExists) {
                setVerifyErrorRole({ class: "is-invalid", message: "Esse cargo já existe." })
                return
            }
        }

        try {
            await updateRole(id, { nome: newName.toLowerCase() })
            // Atualizar a lista dos cargos após a edição
            await getAllRoles()
            handleCloseEdit()
        } catch (error) {
            console.error(error.message)
        }
    }

    async function handleDeleteRole(id) {
        try {
            handleCloseMessageDelete() // Fecha o modal de confirmação
            await deleteRoleById(id)
            const updatedRoles = roles.filter((role) => role.id !== id)
            setRoles(updatedRoles)
        } catch (error) {
            handleShowMessage("Este cargo está associado a usuários e não pode ser excluído.") // Abre o modal de mensagem de erro
            console.error(error.message)
        }
    }

    return (
        <Container>
            <h1 className={"titulo"}>Lista de Cargos</h1>

            <Form.Control type='text' className='mb-3' aria-describedby='search' placeholder='Pesquisar...' value={search} onChange={(e) => setSearch(e.target.value)} />

            <Button className='btn btn-success btn-sm mb-3' onClick={() => handleShowCreate()}>
                Criar
            </Button>

            {/*Listagem de cargos*/}
            <ListGroup>
                {filteredRoles.map((role) => (
                    <ListGroup.Item key={role.id} className='d-flex align-items-center '>
                        <Col>
                            <p className='mb-0 text-capitalize'>{role.nome}</p>
                        </Col>

                        <Button className='me-2 btn-sm bi-pencil-fill' onClick={() => handleShowEdit(role)}>
                            <PencilSquare />
                        </Button>

                        <Button className='btn btn-sm btn-danger' onClick={() => handleShowMessageDelete(role.id)}>
                            <Trash />
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/*Modal Criar ou Editar cargo*/}
            <Modal
                show={showCreate || showEdit}
                onHide={() => {
                    handleCloseCreate()
                    handleCloseEdit()
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{(showCreate && "Criar Cargo") || (showEdit && "Editar Cargo")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type='text'
                        id='cargo'
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        aria-describedby='cargo'
                        placeholder='Informe um nome para o cargo'
                        className={verifyErrorRole.class}
                    />
                    {verifyErrorRole.message && <Form.Text className='invalid-feedback'>{verifyErrorRole.message}</Form.Text>}
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
                    {(showCreate && (
                        <Button variant='success' className='btn-sm' onClick={() => handleCreateRole(role)}>
                            Criar
                        </Button>
                    )) ||
                        (showEdit && (
                            <Button variant='primary' className='btn-sm' onClick={() => handleUpdateRole(roleId, role)}>
                                Salvar
                            </Button>
                        ))}
                </Modal.Footer>
            </Modal>

            {/*Modal de erro no cargo*/}
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
                <Modal.Body>Tem certeza que deseja excluir esse cargo? </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' className='btn-sm' onClick={handleCloseMessageDelete}>
                        Não
                    </Button>
                    <Button variant='success' className='btn-sm' onClick={() => handleDeleteRole(idToDelete)}>
                        Sim
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
