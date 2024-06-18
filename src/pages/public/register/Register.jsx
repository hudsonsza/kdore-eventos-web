import { useEffect, useState } from "react"
import { findAllRoles } from "../../../services/roleService"
import { createUser } from "../../../services/userService"
import { useNavigate } from "react-router-dom"

import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { EnvelopeAt, Lock, Telephone, TextareaT } from "react-bootstrap-icons"

import MaskedInput from "react-text-mask"

export default function Register() {
    // Informações dos usuários.
    const [nome, setName] = useState("")
    const [telefone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setPassword] = useState("")
    const [cargo_id, setRole] = useState("")

    const [roles, setRoles] = useState([]) // Lista com os cargos do site.

    const [showMessage, setShowMessage] = useState("")

    const [verifyErrorName, setVerifyErrorName] = useState({ class: "", message: "" })
    const [verifyErrorEmail, setVerifyErrorEmail] = useState({ class: "", message: "" })
    const [verifyErrorPhone, setVerifyErrorPhone] = useState({ class: "", message: "" })
    const [verifyErrorPassword, setVerifyErrorPassword] = useState({ class: "", message: "" })
    const [verifyErrorRole, setVerifyErrorRole] = useState({ class: "", message: "" })

    // Funções para mostras as mensagens.
    const handleCloseMessage = () => navigate("/login") // Manda o usuário cadastrado para o login.
    const handleShowMessage = (message) => setShowMessage(message)

    const navigate = useNavigate()

    // Função para determinar a máscara do telefone com base no valor atual
    const getMask = (telefone) => {
        return telefone[5] === "9"
            ? ["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]
            : ["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]
    }

    // Função para buscar os cargos.
    const getRoles = async () => {
        try {
            const res = await findAllRoles()
            setRoles(res || [])
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getRoles()
    }, [])

    useEffect(() => {
        setVerifyErrorName({ class: "", message: "" })
    }, [nome])

    useEffect(() => {
        setVerifyErrorEmail({ class: "", message: "" })
    }, [email])

    useEffect(() => {
        setVerifyErrorPhone({ class: "", message: "" })
    }, [telefone])

    useEffect(() => {
        setVerifyErrorPassword({ class: "", message: "" })
    }, [senha])

    useEffect(() => {
        setVerifyErrorRole({ class: "", message: "" })
    }, [cargo_id])

    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailPattern.test(email)
    }

    // Função de envio do formulário.
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validação do nome
        if (!nome.trim()) {
            setVerifyErrorName({ class: "is-invalid", message: "O nome não pode estar vazio." })
            return
        } else if (nome.trim().length < 3) {
            setVerifyErrorName({ class: "is-invalid", message: "O nome deve ter pelo menos 3 caracteres." })
            return
        }

        // Validação do e-mail
        if (!email.trim()) {
            setVerifyErrorEmail({ class: "is-invalid", message: "O e-mail não pode estar vazio." })
            return
        } else if (!isValidEmail(email)) {
            setVerifyErrorEmail({ class: "is-invalid", message: "O e-mail é inválido." })
            return
        }

        // Validação do telefone
        if (!telefone.trim()) {
            setVerifyErrorPhone({ class: "is-invalid", message: "O número de telefone não pode estar vazio." })
            return
        } else if (telefone.includes("_")) {
            setVerifyErrorPhone({ class: "is-invalid", message: "O número de telefone está incompleto." })
            return
        }

        // Validação da senha
        if (!senha.trim()) {
            setVerifyErrorPassword({ class: "is-invalid", message: "A senha não pode estar vazia." })
            return
        } else if (senha.includes(" ")) {
            setVerifyErrorPassword({ class: "is-invalid", message: "A senha não deve conter espaços." })
            return
        } else if (senha.length < 7 || senha.length > 20) {
            setVerifyErrorPassword({ class: "is-invalid", message: "A senha deve ter entre 7 e 20 caracteres." })
            return
        }

        // Validação do cargo
        if (!cargo_id) {
            setVerifyErrorRole({ class: "is-invalid", message: "Selecione um cargo." })
            return
        }

        try {
            await createUser({ nome, email, telefone, senha, cargo_id })
            handleShowMessage("Conta criada com sucesso!")
        } catch (error) {
            if (error.message.includes("409")) {
                setVerifyErrorEmail({ class: "is-invalid", message: "Este email já está registrado." })
            } else {
                console.error(error.message)
            }
        }
    }

    return (
        <section>
            <Container>
                <h1 className='titulo'>Cadastre-se</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <TextareaT /> Nome
                        </Form.Label>
                        <Form.Control type='text' className={verifyErrorName.class} placeholder='Digite seu nome' value={nome} onChange={(e) => setName(e.target.value)} />
                        {verifyErrorName.message && <div className='invalid-feedback'>{verifyErrorName.message}</div>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <EnvelopeAt /> E-mail
                        </Form.Label>
                        <Form.Control type='email' className={verifyErrorEmail.class} placeholder='Digite email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        {verifyErrorEmail.message && <div className='invalid-feedback'>{verifyErrorEmail.message}</div>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <Telephone /> Telefone
                        </Form.Label>
                        <MaskedInput
                            mask={getMask(telefone)}
                            className={"form-control " + verifyErrorPhone.class}
                            placeholder='Digite seu telefone'
                            value={telefone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {verifyErrorPhone.message && <div className='invalid-feedback'>{verifyErrorPhone.message}</div>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            <Lock /> Senha
                        </Form.Label>
                        <Form.Control type='password' className={verifyErrorPassword.class} maxLength='20' placeholder='Digite sua senha' value={senha} onChange={(e) => setPassword(e.target.value)} />
                        {verifyErrorPassword.message && <div className='invalid-feedback'>{verifyErrorPassword.message}</div>}
                    </Form.Group>

                    <Form.Group className={`mb-3 ${verifyErrorRole.class}`} controlId='formRadio'>
                        {roles.map(
                            (role) =>
                                role.nome !== "admin" && (
                                    <div key={role.id} className={`form-check ${verifyErrorRole.class}`}>
                                        <input className={`form-check-input ${verifyErrorRole.class}`} type='radio' name='cargo_id' id={role.id} value={role.id} onChange={() => setRole(role.id)} />
                                        <label className='form-check-label' htmlFor={role.id}>
                                            {role.nome.charAt(0).toUpperCase() + role.nome.slice(1)}
                                        </label>
                                    </div>
                                )
                        )}
                        {verifyErrorRole.message && <div className='invalid-feedback'>{verifyErrorRole.message}</div>}
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Button variant='success' type='submit'>
                            Criar
                        </Button>
                    </Form.Group>
                </Form>

                {/*Modal de sucesso*/}
                <Modal show={showMessage} onHide={handleCloseMessage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Mensagem</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{showMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant='success' className='btn-sm' onClick={handleCloseMessage}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </section>
    )
}
