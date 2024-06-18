import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { findUserById, updateUser, deleteUser } from "../../../services/userService";
import { findAllRoles } from "../../../services/roleService";
import { AuthContext } from "../../../context/AuthContext";
import MaskedInput from "react-text-mask";
import { EnvelopeAt, Lock, Telephone, TextareaT } from "react-bootstrap-icons";

export default function Settings() {
    const {logoutUser, isAdmin} = useContext(AuthContext);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        cargo: ''
    });

    useEffect(() => {
        getRoles();
        loadUserData();
    }, []);

    const getRoles = async () => {
        try {
            const res = await findAllRoles();
            setRoles(res || []);
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadUserData = async () => {
        try {
            const user = await findUserById(userInfo.id);
            setFormData({
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                senha: '', // Não carregue a senha real
                cargo_id: user.cargo.id // Assumindo que o cargo é armazenado como cargo_id
            });
        } catch (error) {
            console.error("Erro ao carregar os dados do usuário:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRadioChange = (e) => {
        setFormData({
            ...formData,
            cargo_id: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userInfo.id, formData);
            alert("Dados atualizados com sucesso!");
            logoutUser()
        } catch (error) {
            console.error("Erro ao atualizar os dados:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Tem certeza de que deseja excluir sua conta?")) {
            try {
                await deleteUser(userInfo.id);
                alert("Conta excluída com sucesso!");
                logoutUser();
            } catch (error) {
                console.error("Erro ao excluir a conta:", error);
            }
        }
    };

    // Função para determinar a máscara do telefone com base no valor atual
    const getMask = (telefone) => {
        return telefone.length >= 6 && telefone[5] === "9"
          ? [ '(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ]
          : [ '(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
    };

    return (
      <section>
          <Container>
              <h1 className="titulo">Minha Conta</h1>
              <Form onSubmit={handleSubmit}>

                  {/* Campo para o nome */}
                  <Form.Group className="mb-3" controlId="formNome">
                      <Form.Label><TextareaT /> Nome</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite seu nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                  </Form.Group>

                  {/* Campo para o email */}
                  <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label><EnvelopeAt /> Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Digite seu email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                      />
                  </Form.Group>

                  {/* Campo para o telefone com máscara */}
                  <Form.Group className="mb-3" controlId="formTelefone">
                      <Form.Label><Telephone /> Telefone</Form.Label>
                      <MaskedInput
                        mask={getMask(formData.telefone)}
                        className="form-control"
                        placeholder="Digite seu telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                      />
                  </Form.Group>

                  {/* Campo para a senha */}
                  <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label><Lock /> Senha</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Digite sua senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                      />
                  </Form.Group>
                  
                  {/* Campos para selecionar o cargo usando radio buttons */}
                  {!isAdmin && (
                    <Form.Group className="mb-3" controlId="formRadio">
                        {roles.map((role) => (
                          role.nome !== 'admin' && (
                            <Form.Check
                              key={role.id}
                              label={role.nome}
                              name="cargo_id"
                              type="radio"
                              id={role.id}
                              value={role.id}
                              checked={formData.cargo_id === role.id}
                              onChange={handleRadioChange}
                            />
                          )
                        ))}
                    </Form.Group>
                  )}

                  {/* Botão para salvar as alterações */}
                  <Button variant="primary" type="submit" className="btn btn-sm me-2">
                      Salvar
                  </Button>

                  {/* Botão para excluir a conta */}
                  <Button variant="danger" type="button" className="btn btn-sm" onClick={handleDelete}>
                      Excluir
                  </Button>
              </Form>
          </Container>
      </section>
    );
}
